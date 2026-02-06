import React, { useState, useEffect, useRef } from 'react';
import { useMetronome, type InstrumentType } from '../hooks/useMetronome';
import { useTimer } from '../hooks/useTimer';
import { exercises } from '../data/exercises';
import { ExerciseAnimation } from './ExerciseAnimation';
import { Play, Pause, Minus, Plus, RotateCcw, Timer, ChevronLeft, ChevronRight } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const BEATS_PER_EXERCISE = 50;

export const Metronome: React.FC = () => {
    const [bpm, setBpm] = useState(180);
    const [instrument, setInstrumentState] = useState<InstrumentType>('digital');
    const [lastBeat, setLastBeat] = useState<number | null>(null);
    const [isBumping, setIsBumping] = useState(false);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const beatCountRef = useRef(0);

    const { isPlaying, toggle, setInstrument, setOnBeat } = useMetronome({ bpm, beatsPerMeasure: 4 });
    const { formattedTime, isRunning: isTimerRunning, start: startTimer, stop: stopTimer, reset: resetTimer } = useTimer();

    // Sync instrument state with hook
    useEffect(() => {
        setInstrument(instrument);
    }, [instrument, setInstrument]);

    // Sync visual beat and count for exercise switching
    useEffect(() => {
        setOnBeat((beat) => {
            setLastBeat(beat);
            setIsBumping(true);
            setTimeout(() => setIsBumping(false), 100);

            // 增加节拍计数
            beatCountRef.current += 1;

            // 每50拍切换到下一个动作
            if (beatCountRef.current >= BEATS_PER_EXERCISE) {
                beatCountRef.current = 0;
                setCurrentExerciseIndex((prev) => (prev + 1) % exercises.length);
            }
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

    // Reset beat count when stopped
    useEffect(() => {
        if (!isPlaying) {
            beatCountRef.current = 0;
        }
    }, [isPlaying]);

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

    const goToPrevExercise = () => {
        beatCountRef.current = 0;
        setCurrentExerciseIndex((prev) => (prev - 1 + exercises.length) % exercises.length);
    };

    const goToNextExercise = () => {
        beatCountRef.current = 0;
        setCurrentExerciseIndex((prev) => (prev + 1) % exercises.length);
    };

    const currentExercise = exercises[currentExerciseIndex];
    const remainingBeats = BEATS_PER_EXERCISE - beatCountRef.current;

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-neu-base px-4 py-2 font-sans text-slate-600 overflow-y-auto">

            {/* Title */}
            <h1 className="text-lg font-bold tracking-wider text-slate-500 uppercase drop-shadow-sm select-none mb-2">
                Rhythm<span className="text-slate-400">Flow</span>
            </h1>

            {/* Main Card */}
            <div className="relative w-full max-w-xs rounded-[2rem] bg-neu-base shadow-neu-flat p-4 flex flex-col items-center space-y-3">

                {/* Exercise Display */}
                <div className="w-full flex flex-col items-center p-3 rounded-2xl bg-neu-base shadow-neu-pressed">
                    {/* Exercise Navigation */}
                    <div className="w-full flex items-center justify-between mb-2">
                        <button
                            onClick={goToPrevExercise}
                            className="w-8 h-8 rounded-full bg-neu-base flex items-center justify-center shadow-neu-flat active:shadow-neu-pressed transition-all text-slate-400"
                        >
                            <ChevronLeft size={16} />
                        </button>

                        <div className="flex-1 text-center">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                动作 {currentExercise.id}/8
                            </span>
                        </div>

                        <button
                            onClick={goToNextExercise}
                            className="w-8 h-8 rounded-full bg-neu-base flex items-center justify-center shadow-neu-flat active:shadow-neu-pressed transition-all text-slate-400"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>

                    {/* Animation */}
                    <ExerciseAnimation exerciseId={currentExercise.id} isPlaying={isPlaying} />

                    {/* Exercise Info */}
                    <div className="text-center mt-2">
                        <h2 className="text-base font-bold text-slate-700">{currentExercise.name}</h2>
                        <p className="text-xs text-blue-500 font-medium">{currentExercise.subtitle}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{currentExercise.description}</p>
                    </div>

                    {/* Progress */}
                    {isPlaying && (
                        <div className="w-full mt-2">
                            <div className="h-1 bg-neu-dark rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-400 transition-all duration-200"
                                    style={{ width: `${((BEATS_PER_EXERCISE - remainingBeats) / BEATS_PER_EXERCISE) * 100}%` }}
                                />
                            </div>
                            <p className="text-[9px] text-slate-400 text-center mt-1">
                                剩余 {remainingBeats} 拍
                            </p>
                        </div>
                    )}
                </div>

                {/* BPM Display - Compact */}
                <div className="w-full flex items-center justify-between p-3 rounded-xl bg-neu-base shadow-neu-pressed">
                    <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">BPM</span>
                        <input
                            type="number"
                            value={bpm}
                            onChange={handleBpmInput}
                            onBlur={handleBpmBlur}
                            className={twMerge(
                                "w-16 text-center bg-transparent text-2xl font-bold text-slate-700 outline-none border-none tabular-nums transition-transform duration-75",
                                isBumping && "scale-105 text-blue-500"
                            )}
                            style={{ MozAppearance: 'textfield' }}
                        />
                    </div>

                    {/* Beat Dots */}
                    <div className="flex space-x-1.5">
                        {[0, 1, 2, 3].map((b) => (
                            <div
                                key={b}
                                className={twMerge(
                                    "w-2 h-2 rounded-full transition-all duration-150",
                                    lastBeat === b && isBumping
                                        ? (b === 0 ? "bg-blue-500 shadow-[0_0_6px_#3b82f6] scale-125" : "bg-slate-400 scale-110")
                                        : "bg-neu-dark"
                                )}
                            />
                        ))}
                    </div>
                </div>

                {/* Timer Display - Compact */}
                <div className="w-full flex items-center justify-between p-2.5 rounded-xl bg-neu-base shadow-neu-pressed">
                    <div className="flex items-center space-x-2">
                        <Timer size={12} className="text-slate-400" />
                        <span className={twMerge(
                            "text-lg font-bold tabular-nums tracking-wide transition-colors duration-200",
                            isTimerRunning ? "text-blue-500" : "text-slate-600"
                        )}>
                            {formattedTime}
                        </span>
                    </div>
                    <button
                        onClick={resetTimer}
                        className="w-8 h-8 rounded-full bg-neu-base flex items-center justify-center shadow-neu-flat active:shadow-neu-pressed transition-all text-slate-500"
                    >
                        <RotateCcw size={12} />
                    </button>
                </div>

                {/* Instrument Selector */}
                <div className="w-full flex justify-between bg-neu-base rounded-full p-0.5 shadow-neu-pressed">
                    {(['digital', 'woodblock', 'drum'] as InstrumentType[]).map((inst) => (
                        <button
                            key={inst}
                            onClick={() => setInstrumentState(inst)}
                            className={twMerge(
                                "flex-1 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-wider transition-all duration-200",
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
                <div className="w-full flex items-center space-x-2">
                    <button
                        onClick={() => adjustBpm(-1)}
                        className="w-8 h-8 rounded-full bg-neu-base flex items-center justify-center shadow-neu-flat active:shadow-neu-pressed transition-all text-slate-500 flex-shrink-0"
                    >
                        <Minus size={14} />
                    </button>
                    <input
                        type="range"
                        min="40"
                        max="280"
                        value={bpm}
                        onChange={handleBpmChange}
                        className="flex-1 h-2 bg-neu-base rounded-full shadow-neu-pressed appearance-none cursor-pointer focus:outline-none"
                    />
                    <button
                        onClick={() => adjustBpm(1)}
                        className="w-8 h-8 rounded-full bg-neu-base flex items-center justify-center shadow-neu-flat active:shadow-neu-pressed transition-all text-slate-500 flex-shrink-0"
                    >
                        <Plus size={14} />
                    </button>
                </div>

                {/* Play Button */}
                <button
                    onClick={toggle}
                    className={twMerge(
                        "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300",
                        isPlaying
                            ? "shadow-neu-pressed text-blue-500"
                            : "shadow-neu-flat text-slate-500 hover:text-slate-700"
                    )}
                >
                    {isPlaying ? (
                        <Pause size={24} fill="currentColor" className="opacity-90" />
                    ) : (
                        <Play size={24} fill="currentColor" className="ml-0.5 opacity-90" />
                    )}
                </button>

            </div>

            {/* Hidden number spinner style */}
            <style>{`input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }`}</style>

        </div>
    );
};
