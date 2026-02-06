import { useRef, useEffect, useState, useCallback } from 'react';

// Frequencies for High and Low clicks
const HERTZ_HIGH = 1000;
const HERTZ_LOW = 800;

interface UseMetronomeProps {
    bpm: number;
    beatsPerMeasure: number;
}

export type InstrumentType = 'digital' | 'woodblock' | 'drum';

export const useMetronome = ({ bpm, beatsPerMeasure }: UseMetronomeProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioContext = useRef<AudioContext | null>(null);
    const nextNoteTime = useRef<number>(0);
    const currentBeat = useRef<number>(0);
    const workerRef = useRef<Worker | null>(null);
    const scheduleAheadTime = 0.1; // seconds

    const ensureAudioContext = () => {
        if (!audioContext.current) {
            audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
    };

    const playDigital = (ctx: AudioContext, time: number, beat: number) => {
        try {
            const osc = ctx.createOscillator();
            const env = ctx.createGain();
            osc.frequency.value = beat === 0 ? HERTZ_HIGH : HERTZ_LOW;
            env.gain.setValueAtTime(1.5, time);
            env.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
            osc.connect(env);
            env.connect(ctx.destination);
            osc.start(time);
            osc.stop(time + 0.05);
        } catch (e) {
            console.warn('Audio error:', e);
        }
    };

    const playWoodblock = (ctx: AudioContext, time: number, beat: number) => {
        try {
            const osc = ctx.createOscillator();
            const env = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = beat === 0 ? 1200 : 800;
            env.gain.setValueAtTime(1.5, time);
            env.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
            osc.connect(env);
            env.connect(ctx.destination);
            osc.start(time);
            osc.stop(time + 0.1);
        } catch (e) {
            console.warn('Audio error:', e);
        }
    };

    const playDrum = (ctx: AudioContext, time: number, beat: number) => {
        try {
            const osc = ctx.createOscillator();
            const env = ctx.createGain();
            osc.frequency.setValueAtTime(beat === 0 ? 150 : 100, time);
            osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
            env.gain.setValueAtTime(1.5, time);
            env.gain.exponentialRampToValueAtTime(0.01, time + 0.5);
            osc.connect(env);
            env.connect(ctx.destination);
            osc.start(time);
            osc.stop(time + 0.5);
        } catch (e) {
            console.warn('Audio error:', e);
        }
    };

    const playSound = (ctx: AudioContext, type: InstrumentType, time: number, beat: number) => {
        switch (type) {
            case 'woodblock': playWoodblock(ctx, time, beat); break;
            case 'drum': playDrum(ctx, time, beat); break;
            case 'digital': default: playDigital(ctx, time, beat); break;
        }
    };

    // Refs for closure access in scheduler loop
    const bpmRef = useRef(bpm);
    useEffect(() => { bpmRef.current = bpm; }, [bpm]);

    const instrumentRef = useRef<InstrumentType>('digital');
    const setInstrument = (type: InstrumentType) => {
        instrumentRef.current = type;
    };

    const onBeatRef = useRef<((beat: number) => void) | null>(null);
    const setOnBeat = (cb: (beat: number) => void) => {
        onBeatRef.current = cb;
    };

    const nextNoteRef = useRef<(() => void) | null>(null);
    nextNoteRef.current = () => {
        const secondsPerBeat = 60.0 / bpmRef.current;
        nextNoteTime.current += secondsPerBeat;
        currentBeat.current = (currentBeat.current + 1) % beatsPerMeasure;
    };

    const schedulerRef = useRef<(() => void) | null>(null);

    // Initialize Worker
    useEffect(() => {
        const worker = new Worker(new URL('./metronome.worker.ts', import.meta.url), { type: 'module' });
        workerRef.current = worker;

        worker.onmessage = (e) => {
            if (e.data === 'tick') {
                schedulerRef.current?.();
            }
        };

        return () => {
            worker.terminate();
        };
    }, []);

    // Update scheduler
    useEffect(() => {
        schedulerRef.current = () => {
            if (!audioContext.current) return;
            while (nextNoteTime.current < audioContext.current.currentTime + scheduleAheadTime) {
                // Schedule Sound
                playSound(audioContext.current, instrumentRef.current, nextNoteTime.current, currentBeat.current);

                // Schedule Visual Sync
                const delay = (nextNoteTime.current - audioContext.current.currentTime) * 1000;
                const scheduledBeat = currentBeat.current;
                setTimeout(() => {
                    if (onBeatRef.current) onBeatRef.current(scheduledBeat);
                }, Math.max(0, delay));

                if (nextNoteRef.current) nextNoteRef.current();
            }
        };
    }, [beatsPerMeasure]); // No loop dependency needed

    const start = () => {
        ensureAudioContext();
        if (!audioContext.current) return;

        if (audioContext.current.state === 'suspended') {
            audioContext.current.resume();
        }

        currentBeat.current = 0;
        nextNoteTime.current = audioContext.current.currentTime + 0.05;

        setIsPlaying(true);
        // Start worker timer
        workerRef.current?.postMessage('start');
    };

    const stop = () => {
        setIsPlaying(false);
        // Stop worker timer
        workerRef.current?.postMessage('stop');
    };

    // Wake Lock for mobile
    useEffect(() => {
        let wakeLock: WakeLockSentinel | null = null;

        const requestWakeLock = async () => {
            try {
                // Cast navigator to any because wakeLock types might be missing in older TS/Env
                const nav = navigator as any;
                if (isPlaying && nav.wakeLock) {
                    wakeLock = await nav.wakeLock.request('screen');
                }
            } catch (err) {
                console.warn('Wake Lock error:', err);
            }
        };

        const releaseWakeLock = async () => {
            if (wakeLock) {
                try {
                    await wakeLock.release();
                    wakeLock = null;
                } catch (err) {
                    console.warn('Wake Lock release error:', err);
                }
            }
        };

        if (isPlaying) {
            requestWakeLock();
        } else {
            releaseWakeLock();
        }

        // handle visibility change to re-acquire lock if tab becomes visible again
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && isPlaying) {
                requestWakeLock();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            releaseWakeLock();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [isPlaying]);

    const toggle = useCallback(() => {
        if (isPlaying) {
            stop();
        } else {
            start();
        }
    }, [isPlaying]);

    // Cleanup
    useEffect(() => {
        return () => {
            // Stop worker if unmounted while playing (though worker.terminate does this)
            if (audioContext.current) audioContext.current.close();
        }
    }, []);

    return { isPlaying, toggle, setInstrument, setOnBeat };
};
