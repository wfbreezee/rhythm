import React, { useState, useEffect } from 'react';
import { useMetronome, type InstrumentType } from '../hooks/useMetronome';
import { Play, Pause, Minus, Plus } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export const Metronome: React.FC = () => {
    const [bpm, setBpm] = useState(120);
    const [instrument, setInstrumentState] = useState<InstrumentType>('digital');
    const [lastBeat, setLastBeat] = useState<number | null>(null);
    const [isBumping, setIsBumping] = useState(false);

    const { isPlaying, toggle, setInstrument, setOnBeat } = useMetronome({ bpm, beatsPerMeasure: 4 });

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

    const handleBpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value);
        setBpm(val);
    };

    const handleBpmInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = parseInt(e.target.value);
        if (isNaN(val)) val = 0; // Handle empty input temporarily
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-neu-base p-6 font-sans text-slate-600 space-y-12">

            {/* Title */}
            <h1 className="text-3xl font-bold tracking-wider text-slate-500 uppercase drop-shadow-sm select-none">
                Rhythm<span className="text-slate-400">Flow</span>
            </h1>

            {/* Main Card */}
            <div className="relative w-full max-w-sm rounded-[3rem] bg-neu-base shadow-neu-flat p-10 flex flex-col items-center space-y-10">

                {/* Display Screen (Inset) */}
                <div className="w-full flex flex-col items-center justify-center p-8 rounded-3xl bg-neu-base shadow-neu-pressed relative overflow-hidden">
                    {/* Beat Indicator (Flash) */}
                    <div
                        className={twMerge(
                            "absolute inset-0 bg-blue-400/5 transition-opacity duration-100 pointer-events-none",
                            isBumping ? "opacity-100" : "opacity-0"
                        )}
                    />

                    <span className="text-xs font-bold tracking-[0.2em] text-slate-400 mb-2 uppercase">Beats Per Minute</span>

                    <div className="relative flex items-center justify-center h-20">
                        <input
                            type="number"
                            value={bpm}
                            onChange={handleBpmInput}
                            onBlur={handleBpmBlur}
                            className={twMerge(
                                "w-full text-center bg-transparent text-6xl font-bold text-slate-700 outline-none border-none tabular-nums leading-none transition-transform duration-75 p-0 m-0",
                                isBumping && "scale-110 text-blue-500"
                            )}
                            style={{ MozAppearance: 'textfield' }} // Hide spinners FF
                        />
                        {/* Hide spinners Chrome/Safari */}
                        <style>{`input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }`}</style>
                    </div>

                    {/* Beat Dots */}
                    <div className="flex space-x-2 mt-6">
                        {[0, 1, 2, 3].map((b) => (
                            <div
                                key={b}
                                className={twMerge(
                                    "w-3 h-3 rounded-full transition-all duration-150",
                                    lastBeat === b && isBumping
                                        ? (b === 0 ? "bg-blue-500 shadow-[0_0_10px_#3b82f6] scale-125" : "bg-slate-400 scale-110")
                                        : "bg-neu-dark shadow-inner"
                                )}
                            />
                        ))}
                    </div>
                </div>

                {/* Instrument Selector (New) */}
                <div className="w-full flex justify-between bg-neu-base rounded-full p-1 shadow-neu-pressed">
                    {(['digital', 'woodblock', 'drum'] as InstrumentType[]).map((inst) => (
                        <button
                            key={inst}
                            onClick={() => setInstrumentState(inst)}
                            className={twMerge(
                                "flex-1 py-3 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-200",
                                instrument === inst
                                    ? "bg-neu-base shadow-neu-flat text-blue-500 transform scale-[1.02]"
                                    : "text-slate-400 hover:text-slate-600 hover:bg-white/20"
                            )}
                        >
                            {inst}
                        </button>
                    ))}
                </div>

                {/* Slider Controls */}
                <div className="w-full space-y-6">
                    <input
                        type="range"
                        min="40"
                        max="280"
                        value={bpm}
                        onChange={handleBpmChange}
                        className="w-full h-4 bg-neu-base rounded-full shadow-neu-pressed appearance-none cursor-pointer focus:outline-none"
                    />

                    <div className="flex justify-between w-full px-2">
                        <button
                            onClick={() => adjustBpm(-1)}
                            className="w-12 h-12 rounded-full bg-neu-base flex items-center justify-center shadow-neu-flat active:shadow-neu-pressed transition-all duration-200 text-slate-500 hover:text-slate-700"
                        >
                            <Minus size={20} />
                        </button>
                        <button
                            onClick={() => adjustBpm(1)}
                            className="w-12 h-12 rounded-full bg-neu-base flex items-center justify-center shadow-neu-flat active:shadow-neu-pressed transition-all duration-200 text-slate-500 hover:text-slate-700"
                        >
                            <Plus size={20} />
                        </button>
                    </div>
                </div>

                {/* Play Button - Large */}
                <button
                    onClick={toggle}
                    className={twMerge(
                        "w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300",
                        isPlaying
                            ? "shadow-neu-pressed text-blue-500 ring-4 ring-neu-base"
                            : "shadow-neu-flat text-slate-500 hover:text-slate-700"
                    )}
                >
                    {isPlaying ? (
                        <Pause size={32} fill="currentColor" className="opacity-90" />
                    ) : (
                        <Play size={32} fill="currentColor" className="ml-1 opacity-90" />
                    )}
                </button>

            </div>

            {/* Footer / Branding */}
            <div className="text-sm text-slate-400 font-medium opacity-80">
                Designed for Focus
            </div>

        </div>
    );
};
