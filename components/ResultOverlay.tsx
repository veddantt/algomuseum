"use client";

import { motion } from "framer-motion";
import { DijkstraStep } from "@/lib/dijkstra";
import { CheckCircle2, RotateCcw, Clock, Navigation2, Zap } from "lucide-react";

interface ResultOverlayProps {
  step: DijkstraStep;
  endNode: string;
  reset: () => void;
}

export function ResultOverlay({ step, endNode, reset }: ResultOverlayProps) {
  const finalDistance = step.distances[endNode];
  const intersectionsScanned = Object.keys(step.visited).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-md bg-black/60"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="max-w-lg w-full bg-neutral-900 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden"
      >
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 blur-[100px] -mr-32 -mt-32" />
        
        <div className="relative">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-green-500/20 text-green-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tighter text-white">ROUTE ACQUIRED</h2>
              <p className="text-neutral-400 font-medium">Optimal path successfully calculated</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/5">
              <div className="flex items-center gap-2 mb-2 text-neutral-500">
                <Clock className="w-4 h-4" />
                <span className="text-[10px] uppercase font-bold tracking-widest">Total Time</span>
              </div>
              <div className="text-3xl font-mono font-black text-green-400">
                {finalDistance}<span className="text-sm ml-1 text-green-500/50">min</span>
              </div>
            </div>
            <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/5">
              <div className="flex items-center gap-2 mb-2 text-neutral-500">
                <Navigation2 className="w-4 h-4" />
                <span className="text-[10px] uppercase font-bold tracking-widest">Efficiency</span>
              </div>
              <div className="text-3xl font-mono font-black text-blue-400">
                100<span className="text-sm ml-1 text-blue-500/50">%</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-10">
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <span className="text-sm text-neutral-500 font-medium">Intersections Scanned</span>
              <span className="text-sm font-mono text-white font-bold">{intersectionsScanned}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <span className="text-sm text-neutral-500 font-medium">Algorithm Type</span>
              <span className="text-sm font-mono text-white font-bold">Dijkstra's Pathfinding</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/10 mb-8">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <p className="text-sm leading-relaxed text-blue-100/70">
                Dijkstra found the optimal route by systematically exploring the shortest known paths first, ensuring no better alternative exists.
              </p>
            </div>
          </div>

          <button
            onClick={reset}
            className="w-full h-16 rounded-2xl bg-white text-black font-black uppercase tracking-tighter hover:scale-[1.02] transition-transform flex items-center justify-center gap-3"
          >
            <RotateCcw className="w-5 h-5" />
            Restart Simulation
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
