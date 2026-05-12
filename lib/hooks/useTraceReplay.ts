"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ElevatorState, ElevatorLogEvent, ElevatorMetrics } from "@/lib/simulations/elevator/types";

// --- Types ---

export interface TraceEvent {
  id: string;
  timestamp: number;
  actionType: string;
  label: string;
  prevState: ElevatorState;
  nextState: ElevatorState;
  logs: ElevatorLogEvent[];
  metrics: ElevatorMetrics | null;
}

const MAX_EVENTS = 120;

// --- Hook ---

export function useTraceReplay() {
  const [trace, setTrace] = useState<TraceEvent[]>([]);
  const [isReplaying, setIsReplaying] = useState(false);
  const [replayIndex, setReplayIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Derived replay state — the nextState of the event at replayIndex
  const replayState: ElevatorState | null =
    isReplaying && trace.length > 0 && replayIndex < trace.length
      ? trace[replayIndex].nextState
      : null;

  // The previous state for diff highlighting
  const replayPrevState: ElevatorState | null =
    isReplaying && trace.length > 0 && replayIndex < trace.length
      ? trace[replayIndex].prevState
      : null;

  // --- Recording ---

  const recordEvent = useCallback(
    (
      actionType: string,
      label: string,
      prevState: ElevatorState,
      nextState: ElevatorState,
      logs: ElevatorLogEvent[],
      metrics: ElevatorMetrics | null
    ) => {
      const event: TraceEvent = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        timestamp: Date.now(),
        actionType,
        label,
        prevState: structuredClone(prevState),
        nextState: structuredClone(nextState),
        logs,
        metrics,
      };

      setTrace((prev) => {
        const next = [...prev, event];
        if (next.length > MAX_EVENTS) {
          return next.slice(next.length - MAX_EVENTS);
        }
        return next;
      });
    },
    []
  );

  const clearTrace = useCallback(() => {
    stopPlayback();
    setIsReplaying(false);
    setReplayIndex(0);
    setTrace([]);
  }, []);

  // --- Replay controls ---

  const enterReplay = useCallback(() => {
    if (trace.length === 0) return;
    setIsReplaying(true);
    setReplayIndex(trace.length - 1);
    setIsPlaying(false);
    stopPlayback();
  }, [trace.length]);

  const exitReplay = useCallback(() => {
    stopPlayback();
    setIsReplaying(false);
    setIsPlaying(false);
    setReplayIndex(0);
  }, []);

  const goToStep = useCallback(
    (index: number) => {
      if (index < 0 || index >= trace.length) return;
      setReplayIndex(index);
    },
    [trace.length]
  );

  const nextStep = useCallback(() => {
    setReplayIndex((prev) => Math.min(prev + 1, trace.length - 1));
  }, [trace.length]);

  const prevStep = useCallback(() => {
    setReplayIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  // Stop interval helper (no state dependency)
  function stopPlayback() {
    if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
      playIntervalRef.current = null;
    }
  }

  const pause = useCallback(() => {
    stopPlayback();
    setIsPlaying(false);
  }, []);

  const play = useCallback(() => {
    if (trace.length === 0) return;
    setIsPlaying(true);

    stopPlayback();
    playIntervalRef.current = setInterval(() => {
      setReplayIndex((prev) => {
        if (prev >= trace.length - 1) {
          // Reached end — pause
          stopPlayback();
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 500);
  }, [trace.length]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => stopPlayback();
  }, []);

  return {
    // Recording
    trace,
    recordEvent,
    clearTrace,

    // Replay
    isReplaying,
    replayIndex,
    replayState,
    replayPrevState,
    enterReplay,
    exitReplay,
    goToStep,
    nextStep,
    prevStep,
    play,
    pause,
    isPlaying,
  };
}
