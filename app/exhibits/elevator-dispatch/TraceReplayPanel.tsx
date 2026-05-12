"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, SkipBack, SkipForward,
  History, X, ChevronRight
} from "lucide-react";
import { ElevatorState } from "@/lib/simulations/elevator/types";
import { TraceEvent } from "@/lib/hooks/useTraceReplay";
import { GlassPanel } from "@/app/components/ui/GlassPanel";
import { Badge } from "@/app/components/ui/Badge";

// --- Helpers ---

const ACTION_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  REQUEST_FLOOR:    { bg: "bg-blue-500/15",    text: "text-blue-400",    border: "border-blue-500/30" },
  STEP:             { bg: "bg-violet-500/15",   text: "text-violet-400",  border: "border-violet-500/30" },
  TARGET_LOCKED:    { bg: "bg-cyan-500/15",     text: "text-cyan-400",    border: "border-cyan-500/30" },
  ARRIVE_AT_TARGET: { bg: "bg-emerald-500/15",  text: "text-emerald-400", border: "border-emerald-500/30" },
  RESET:            { bg: "bg-amber-500/15",    text: "text-amber-400",   border: "border-amber-500/30" },
  SET_ALGORITHM:    { bg: "bg-rose-500/15",     text: "text-rose-400",    border: "border-rose-500/30" },
};

function getActionColor(actionType: string) {
  return ACTION_COLORS[actionType] || ACTION_COLORS.STEP;
}

function formatRelativeTime(timestamp: number, baseTimestamp: number): string {
  const diffMs = timestamp - baseTimestamp;
  if (diffMs < 1000) return `+${diffMs}ms`;
  return `+${(diffMs / 1000).toFixed(1)}s`;
}

// --- Diff Field ---

interface DiffFieldProps {
  label: string;
  current: string | number | null | undefined;
  previous: string | number | null | undefined;
}

function DiffField({ label, current, previous }: DiffFieldProps) {
  const changed = String(current ?? "--") !== String(previous ?? "--");
  const displayValue = current ?? "--";

  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-lg p-2.5 relative overflow-hidden">
      <AnimatePresence>
        {changed && (
          <motion.div
            key={`pulse-${String(current)}-${Date.now()}`}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 bg-blue-500/20 rounded-lg pointer-events-none"
          />
        )}
      </AnimatePresence>
      <span className="text-[8px] font-black uppercase tracking-[0.2em] text-neutral-600 block mb-0.5">
        {label}
      </span>
      <span
        className={`text-[11px] font-mono font-bold block transition-colors duration-300 ${
          changed ? "text-blue-400" : "text-neutral-300"
        }`}
      >
        {String(displayValue)}
      </span>
    </div>
  );
}

// --- Main Panel ---

interface TraceReplayPanelProps {
  trace: TraceEvent[];
  isReplaying: boolean;
  replayIndex: number;
  replayState: ElevatorState | null;
  replayPrevState: ElevatorState | null;
  isPlaying: boolean;
  enterReplay: () => void;
  exitReplay: () => void;
  goToStep: (index: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  play: () => void;
  pause: () => void;
  clearTrace: () => void;
}

export default function TraceReplayPanel({
  trace,
  isReplaying,
  replayIndex,
  replayState,
  replayPrevState,
  isPlaying,
  enterReplay,
  exitReplay,
  goToStep,
  nextStep,
  prevStep,
  play,
  pause,
  clearTrace,
}: TraceReplayPanelProps) {
  const timelineRef = useRef<HTMLDivElement>(null);

  // Auto-scroll timeline to active step during replay
  useEffect(() => {
    if (isReplaying && timelineRef.current) {
      const activeEl = timelineRef.current.querySelector(`[data-trace-index="${replayIndex}"]`);
      activeEl?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [replayIndex, isReplaying]);

  const currentEvent = isReplaying && trace[replayIndex] ? trace[replayIndex] : null;
  const baseTimestamp = trace.length > 0 ? trace[0].timestamp : 0;

  return (
    <GlassPanel intensity="medium" className="p-0 mt-4 overflow-hidden">
      {/* Replay Mode Banner */}
      <AnimatePresence>
        {isReplaying && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="bg-blue-500/10 border-b border-blue-500/20 px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-2 h-2 rounded-full bg-blue-400"
                />
                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-blue-400">
                  Replay Mode Active
                </span>
              </div>
              <span className="text-[9px] font-mono text-blue-400/60">
                Backend paused — read-only
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <History className="w-3.5 h-3.5 text-neutral-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">
            Trace Replay
          </span>
          {trace.length > 0 && (
            <span className="text-[9px] font-mono text-neutral-600 bg-white/5 px-1.5 py-0.5 rounded">
              {trace.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isReplaying && trace.length > 0 && (
            <button
              onClick={clearTrace}
              className="text-[9px] font-mono text-neutral-600 hover:text-neutral-400 transition-colors uppercase tracking-wider"
            >
              Clear
            </button>
          )}
          {trace.length > 0 && (
            <button
              onClick={isReplaying ? exitReplay : enterReplay}
              className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest transition-all ${
                isReplaying
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30"
                  : "bg-white/5 text-neutral-400 border border-white/10 hover:bg-white/10 hover:text-white"
              }`}
            >
              {isReplaying ? (
                <span className="flex items-center gap-1.5">
                  <X className="w-3 h-3" /> Exit
                </span>
              ) : (
                "Enter Replay"
              )}
            </button>
          )}
        </div>
      </div>

      {/* Empty state */}
      {trace.length === 0 && (
        <div className="px-4 py-8 flex flex-col items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mb-3">
            <History className="w-4 h-4 text-neutral-700" />
          </div>
          <span className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest">
            No trace events
          </span>
          <span className="text-[8px] text-neutral-700 mt-1">
            Dispatch requests to start recording
          </span>
        </div>
      )}

      {/* Replay Controls — only when replaying */}
      {isReplaying && currentEvent && (
        <div className="px-4 py-3 space-y-3 border-b border-white/5">
          {/* Scrubber */}
          <div className="relative">
            <input
              type="range"
              min={0}
              max={Math.max(trace.length - 1, 0)}
              value={replayIndex}
              onChange={(e) => goToStep(Number(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-3
                [&::-webkit-slider-thumb]:h-3
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-blue-400
                [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(59,130,246,0.5)]
                [&::-webkit-slider-thumb]:cursor-grab
                [&::-webkit-slider-thumb]:active:cursor-grabbing
                [&::-moz-range-thumb]:w-3
                [&::-moz-range-thumb]:h-3
                [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:bg-blue-400
                [&::-moz-range-thumb]:border-0
                [&::-moz-range-thumb]:shadow-[0_0_8px_rgba(59,130,246,0.5)]
                [&::-moz-range-thumb]:cursor-grab"
            />
          </div>

          {/* Transport + step counter */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                onClick={prevStep}
                disabled={replayIndex === 0}
                className="p-1.5 rounded-md hover:bg-white/5 text-neutral-400 hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-neutral-400"
              >
                <SkipBack className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={isPlaying ? pause : play}
                className="p-1.5 rounded-md hover:bg-white/5 text-neutral-400 hover:text-white transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-3.5 h-3.5" />
                ) : (
                  <Play className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                onClick={nextStep}
                disabled={replayIndex >= trace.length - 1}
                className="p-1.5 rounded-md hover:bg-white/5 text-neutral-400 hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-neutral-400"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            </div>

            <span className="text-[10px] font-mono text-neutral-500">
              <span className="text-white font-bold">{replayIndex + 1}</span>
              <span className="text-neutral-700 mx-1">/</span>
              {trace.length}
            </span>
          </div>

          {/* Active event badge */}
          {(() => {
            const color = getActionColor(currentEvent.actionType);
            return (
              <div className="flex items-center justify-between gap-3">
                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider border ${color.bg} ${color.text} ${color.border}`}
                >
                  <ChevronRight className="w-3 h-3" />
                  {currentEvent.actionType}
                </div>
                <span className="text-[9px] font-mono text-neutral-600 truncate max-w-[140px]">
                  {currentEvent.label}
                </span>
              </div>
            );
          })()}

          {/* State diff grid */}
          <div className="grid grid-cols-3 gap-1.5">
            <DiffField
              label="Floor"
              current={replayState?.currentFloor}
              previous={replayPrevState?.currentFloor}
            />
            <DiffField
              label="Target"
              current={replayState?.targetFloor}
              previous={replayPrevState?.targetFloor}
            />
            <DiffField
              label="Queue"
              current={replayState?.queue.length}
              previous={replayPrevState?.queue.length}
            />
            <DiffField
              label="Direction"
              current={replayState?.direction}
              previous={replayPrevState?.direction}
            />
            <DiffField
              label="Done"
              current={replayState?.completedRequests}
              previous={replayPrevState?.completedRequests}
            />
            <DiffField
              label="Algorithm"
              current={replayState?.algorithm}
              previous={replayPrevState?.algorithm}
            />
          </div>
        </div>
      )}

      {/* Mini Timeline — always visible when there are events */}
      {trace.length > 0 && (
        <div
          ref={timelineRef}
          className="max-h-[180px] overflow-y-auto overflow-x-hidden scrollbar-thin"
        >
          {trace.map((event, idx) => {
            const isActive = isReplaying && idx === replayIndex;
            const color = getActionColor(event.actionType);

            return (
              <button
                key={event.id}
                data-trace-index={idx}
                onClick={() => {
                  if (!isReplaying) enterReplay();
                  goToStep(idx);
                }}
                className={`w-full flex items-center gap-2.5 px-4 py-2 text-left transition-all duration-200 relative ${
                  isActive
                    ? "bg-blue-500/10"
                    : "hover:bg-white/[0.03]"
                }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="trace-active-indicator"
                    className="absolute left-0 top-0 bottom-0 w-[2px] bg-blue-400"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}

                {/* Dot */}
                <div className="relative flex-shrink-0">
                  <div
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      isActive ? "bg-blue-400" : "bg-neutral-700"
                    }`}
                  />
                  {isActive && (
                    <motion.div
                      animate={{ opacity: [0.6, 0, 0.6], scale: [1, 2.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-0 rounded-full bg-blue-400 pointer-events-none"
                    />
                  )}
                </div>

                {/* Action badge */}
                <span
                  className={`text-[8px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border shrink-0 ${color.bg} ${color.text} ${color.border}`}
                >
                  {event.actionType.length > 12
                    ? event.actionType.slice(0, 12) + "…"
                    : event.actionType}
                </span>

                {/* Label */}
                <span
                  className={`text-[9px] truncate flex-1 transition-colors ${
                    isActive ? "text-neutral-300" : "text-neutral-600"
                  }`}
                >
                  {event.label}
                </span>

                {/* Timestamp */}
                <span className="text-[8px] font-mono text-neutral-700 shrink-0">
                  {formatRelativeTime(event.timestamp, baseTimestamp)}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </GlassPanel>
  );
}
