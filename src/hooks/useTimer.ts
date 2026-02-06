import { useState, useRef, useCallback, useEffect } from 'react';

export const useTimer = () => {
    const [elapsedTime, setElapsedTime] = useState(0); // in milliseconds
    const [isRunning, setIsRunning] = useState(false);
    const startTimeRef = useRef<number>(0);
    const accumulatedTimeRef = useRef<number>(0);
    const rafIdRef = useRef<number | null>(null);

    const updateTimer = useCallback(() => {
        if (startTimeRef.current > 0) {
            const now = performance.now();
            setElapsedTime(accumulatedTimeRef.current + (now - startTimeRef.current));
        }
        rafIdRef.current = requestAnimationFrame(updateTimer);
    }, []);

    const start = useCallback(() => {
        if (!isRunning) {
            startTimeRef.current = performance.now();
            setIsRunning(true);
            rafIdRef.current = requestAnimationFrame(updateTimer);
        }
    }, [isRunning, updateTimer]);

    const stop = useCallback(() => {
        if (isRunning) {
            if (rafIdRef.current) {
                cancelAnimationFrame(rafIdRef.current);
            }
            const now = performance.now();
            accumulatedTimeRef.current += now - startTimeRef.current;
            startTimeRef.current = 0;
            setIsRunning(false);
        }
    }, [isRunning]);

    const reset = useCallback(() => {
        if (rafIdRef.current) {
            cancelAnimationFrame(rafIdRef.current);
        }
        startTimeRef.current = 0;
        accumulatedTimeRef.current = 0;
        setElapsedTime(0);
        setIsRunning(false);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (rafIdRef.current) {
                cancelAnimationFrame(rafIdRef.current);
            }
        };
    }, []);

    // Format time as mm:ss.ms
    const formatTime = (ms: number): string => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const milliseconds = Math.floor((ms % 1000) / 10);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
    };

    return {
        elapsedTime,
        isRunning,
        formattedTime: formatTime(elapsedTime),
        start,
        stop,
        reset,
    };
};
