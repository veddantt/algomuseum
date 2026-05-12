"use client";

import { motion } from "framer-motion";
import { Node } from "@/lib/dijkstra";
import { Layers } from "lucide-react";

interface PriorityQueuePanelProps {
  queue: { node: string; dist: number }[];
  nodes: Node[];
}

export function PriorityQueuePanel({ queue, nodes }: PriorityQueuePanelProps) {
  return (
    <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
          <Layers className="w-4 h-4" />
        </div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400">Priority Queue</h3>
      </div>

      <div className="space-y-2">
        {queue.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-2xl bg-black/20">
            <motion.div 
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center gap-2 mb-2"
            >
              <div className="w-1 h-1 rounded-full bg-blue-500" />
              <div className="w-1 h-1 rounded-full bg-blue-500" />
              <div className="w-1 h-1 rounded-full bg-blue-500" />
            </motion.div>
            <span className="text-[10px] text-neutral-600 font-mono uppercase tracking-[0.2em]">System Standby</span>
          </div>
        ) : (
          queue.map((item, index) => {
            const node = nodes.find((n) => n.id === item.node);
            return (
              <motion.div
                key={item.node}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`flex items-center justify-between p-3 rounded-xl border ${
                  index === 0
                    ? "bg-blue-500/10 border-blue-500/20"
                    : "bg-white/[0.02] border-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      index === 0 ? "bg-blue-400 animate-pulse" : "bg-neutral-600"
                    }`}
                  />
                  <span className="text-sm font-medium text-white">{node?.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase">Cost</span>
                  <span className="text-xs font-mono font-bold text-blue-400">
                    {item.dist === Infinity ? "∞" : item.dist}
                  </span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-white/5">
        <p className="text-[10px] leading-relaxed text-neutral-500 uppercase tracking-tight">
          The system prioritizes intersections with the lowest current travel cost.
        </p>
      </div>
    </div>
  );
}
