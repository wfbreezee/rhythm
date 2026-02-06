import React, { useState, useEffect } from 'react';
import { useMetronome, type InstrumentType } from '../hooks/useMetronome';
import { useTimer } from '../hooks/useTimer';
import { Play, Pause, Minus, Plus, RotateCcw, Timer, Square } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export const Metronome: React.FC = () => {
    const [bpm, setBpm] = useState(180);
    const [instrument, setInstrumentState] = useState<InstrumentType>('digital');
    const [lastBeat, setLastBeat] = useState<number | null>(null);
    const [isBumping, setIsBumping] = useState(false);

    const { isPlaying, toggle, setInstrument, setOnBeat } = useMetronome({ bpm, beatsPerMeasure: 4 });
    const { formattedTime, isRunning: isTimerRunning, start: startTimer, stop: stopTimer, reset: resetTimer } = useTimer();

    // Sync instrument state with hook
    useEffect(() => {
        setInstrument(instrument);
    }, [instrument, setInstrument]);

    // Sync visual beat
    useEffect(() => {
        setOnBeat((beat) => {
            setLastBeat(beat);
            setIsBumping(true);
            setTimeout(() => setIsBumping(false), 100);
        });
    }, [setOnBeat]);

    // Sync timer with metronome
    useEffect(() => {
        if (isPlaying) {
            startTimer();
        } else {
            stopTimer();
        }
    }, [isPlaying, startTimer, stopTimer]);


    const handleBpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value);
        setBpm(val);
    };

    const handleBpmInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = parseInt(e.target.value);
        if (isNaN(val)) val = 0;
        setBpm(val);
    };

    const handleBpmBlur = () => {
        const clamped = Math.min(280, Math.max(40, bpm));
        if (clamped !== bpm) setBpm(clamped);
    };

    const adjustBpm = (delta: number) => {
        setBpm(curr => Math.min(280, Math.max(40, curr + delta)));
    };

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-neu-base px-4 py-3 font-sans text-slate-600">

            {/* Title */}
            <h1 className="text-xl font-bold tracking-wider text-slate-500 uppercase drop-shadow-sm select-none mb-3">
                Rhythm<span className="text-slate-400">Flow</span>
            </h1>

            {/* Main Card */}
            <div className="relative w-full max-w-xs rounded-[2rem] bg-neu-base shadow-neu-flat p-5 flex flex-col items-center space-y-4">

                {/* Display Screen (Inset) */}
                <div className="w-full flex flex-col items-center justify-center p-4 rounded-2xl bg-neu-base shadow-neu-pressed relative overflow-hidden">
                    {/* Beat Indicator (Flash) */}
                    <div
                        className={twMerge(
                            "absolute inset-0 bg-blue-400/5 transition-opacity duration-100 pointer-events-none",
                            isBumping ? "opacity-100" : "opacity-0"
                        )}
                    />

                    <span className="text-[10px] font-bold tracking-[0.15em] text-slate-400 mb-1 uppercase">BPM</span>

                    <div className="relative flex items-center justify-center h-14">
                        <input
                            type="number"
                            value={bpm}
                            onChange={handleBpmInput}
                            onBlur={handleBpmBlur}
                            className={twMerge(
                                "w-full text-center bg-transparent text-5xl font-bold text-slate-700 outline-none border-none tabular-nums leading-none transition-transform duration-75 p-0 m-0",
                                isBumping && "scale-110 text-blue-500"
                            )}
                            style={{ MozAppearance: 'textfield' }}
                        />
                        <style>{`input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }`}</style>
                    </div>

                    {/* Beat Dots */}
                    <div className="flex space-x-2 mt-3">
                        {[0, 1, 2, 3].map((b) => (
                            <div
                                key={b}
                                className={twMerge(
                                    "w-2.5 h-2.5 rounded-full transition-all duration-150",
                                    lastBeat === b && isBumping
                                        ? (b === 0 ? "bg-blue-500 shadow-[0_0_8px_#3b82f6] scale-125" : "bg-slate-400 scale-110")
                                        : "bg-neu-dark shadow-inner"
                                )}
                            />
                        ))}
                    </div>
                </div>

                {/* Timer Display - Compact */}
                <div className="w-full flex items-center justify-between p-3 rounded-xl bg-neu-base shadow-neu-pressed">
                    <div className="flex items-center space-x-2">
                        <Timer size={14} className="text-slate-400" />
                        <span className={twMerge(
                            "text-xl font-bold tabular-nums tracking-wide transition-colors duration-200",
                            isTimerRunning ? "text-blue-500" : "text-slate-600"
                        )}>
                            {formattedTime}
                        </span>
                    </div>

                    {/* Timer Controls */}
                    <div className="flex space-x-2">
                        <button
                            onClick={isTimerRunning ? stopTimer : startTimer}
                            className={twMerge(
                                "w-9 h-9 rounded-full bg-neu-base flex items-center justify-center transition-all duration-200",
                                isTimerRunning
                                    ? "shadow-neu-pressed text-orange-500"
                                    : "shadow-neu-flat text-green-500"
                            )}
                        >
                            {isTimerRunning ? <Square size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                        </button>
                        <button
                            onClick={resetTimer}
                            className="w-9 h-9 rounded-full bg-neu-base flex items-center justify-center shadow-neu-flat active:shadow-neu-pressed transition-all duration-200 text-slate-500"
                        >
                            <RotateCcw size={14} />
                        </button>
                    </div>
                </div>

                {/* Instrument Selector */}
                <div className="w-full flex justify-between bg-neu-base rounded-full p-0.5 shadow-neu-pressed">
                    {(['digital', 'woodblock', 'drum'] as InstrumentType[]).map((inst) => (
                        <button
                            key={inst}
                            onClick={() => setInstrumentState(inst)}
                            className={twMerge(
                                "flex-1 py-2 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all duration-200",
                                instrument === inst
                                    ? "bg-neu-base shadow-neu-flat text-blue-500"
                                    : "text-slate-400"
                            )}
                        >
                            {inst}
                        </button>
                    ))}
                </div>

                {/* Slider + Controls */}
                <div className="w-full flex items-center space-x-3">
                    <button
                        onClick={() => adjustBpm(-1)}
                        className="w-10 h-10 rounded-full bg-neu-base flex items-center justify-center shadow-neu-flat active:shadow-neu-pressed transition-all duration-200 text-slate-500 flex-shrink-0"
                    >
                        <Minus size={16} />
                    </button>
                    <input
                        type="range"
                        min="40"
                        max="280"
                        value={bpm}
                        onChange={handleBpmChange}
                        className="flex-1 h-3 bg-neu-base rounded-full shadow-neu-pressed appearance-none cursor-pointer focus:outline-none"
                    />
                    <button
                        onClick={() => adjustBpm(1)}
                        className="w-10 h-10 rounded-full bg-neu-base flex items-center justify-center shadow-neu-flat active:shadow-neu-pressed transition-all duration-200 text-slate-500 flex-shrink-0"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                {/* Play Button */}
                <button
                    onClick={toggle}
                    className={twMerge(
                        "w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300",
                        isPlaying
                            ? "shadow-neu-pressed text-blue-500"
                            : "shadow-neu-flat text-slate-500 hover:text-slate-700"
                    )}
                >
                    {isPlaying ? (
                        <Pause size={28} fill="currentColor" className="opacity-90" />
                    ) : (
                        <Play size={28} fill="currentColor" className="ml-1 opacity-90" />
                    )}
                </button>

            </div>

            {/* Footer */}
            <div className="text-xs text-slate-400 font-medium opacity-70 mt-3">
                Designed for Focus
            </div>

        </div>
    );
};
