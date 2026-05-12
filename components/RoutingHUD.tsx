import React from "react";
import { DijkstraStep, Node } from "@/lib/dijkstra";
import { Route } from "lucide-react";

interface RoutingHUDProps {
  step: DijkstraStep;
  nodes: Node[];
  startNode: string;
  endNode: string;
}

export const RoutingHUD: React.FC<RoutingHUDProps> = ({ step, nodes, startNode, endNode }) => {
  const currentLabel = step.currentNode ? nodes.find(n => n.id === step.currentNode)?.label : "STANDBY";
  return (
    <div className="bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-0.5 bg-blue-500/20" />
      <div className="flex items-center gap-2 mb-6">
        <Route className="w-3 h-3 text-blue-500" />
        <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400">Route HUD</h3>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-end border-b border-white/5 pb-2">
          <span className="text-[8px] font-bold uppercase text-neutral-600">Scanning</span>
          <span className="text-xs font-mono font-bold text-blue-400">{currentLabel}</span>
        </div>
        <div className="flex justify-between items-end border-b border-white/5 pb-2">
          <span className="text-[8px] font-bold uppercase text-neutral-600">Visited</span>
          <span className="text-xs font-mono font-bold text-white">{step.visited.length} / {nodes.length}</span>
        </div>
        <div className="flex justify-between items-end border-b border-white/5 pb-2">
          <span className="text-[8px] font-bold uppercase text-neutral-600">Queue Depth</span>
          <span className="text-xs font-mono font-bold text-blue-400">{step.queue.length} <span className="text-[8px] text-neutral-600">nodes</span></span>
        </div>
        <div className="flex justify-between items-end border-b border-white/5 pb-2">
          <span className="text-[8px] font-bold uppercase text-neutral-600">Cycle ID</span>
          <span className="text-xs font-mono font-bold text-neutral-400">#{(step.queue.length * 7 + step.visited.length).toString(16).toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
};
