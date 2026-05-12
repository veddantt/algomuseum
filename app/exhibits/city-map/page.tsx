"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw, Flag, Compass, CheckCircle2, Navigation, Zap, Globe, Cpu, Map as MapIcon, Database, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { nodes, edges } from "@/lib/cityMapData"; // data file
import { generateDijkstraSteps, DijkstraStep, Node } from "@/lib/dijkstra";
import { MapCanvas } from "@/components/MapCanvas";
import { RoutingHUD } from "@/components/RoutingHUD";
import { PriorityQueuePanel } from "@/components/PriorityQueuePanel";
import { ResultOverlay } from "@/components/ResultOverlay";
import ExhibitShell from "@/app/components/ExhibitShell";
import { exhibits } from "@/lib/data";
import { useProgression } from "@/lib/hooks/useProgression";

const timelineItems = [
  { label: "Initialize", description: "Loading map grid" },
  { label: "Routing", description: "Scanning intersections" },
  { label: "Locked", description: "Optimal path found" }
];

const useCases = [
  {
    title: "GPS Navigation",
    icon: Navigation,
    explanation: "Calculating the quickest route from point A to B while avoiding traffic.",
    impact: "Powers Google Maps, Waze, and every modern GPS system.",
    detail: "Dijkstra's algorithm evaluates every road segment's travel time to guarantee the shortest path. Modern GPS systems run it thousands of times per second, dynamically recalculating as traffic conditions change in real time."
  },
  {
    title: "Network Routing",
    icon: Zap,
    explanation: "Directing data packets through the fastest internet nodes.",
    impact: "Ensures low latency and high-speed global connectivity.",
    detail: "The OSPF (Open Shortest Path First) protocol used in enterprise networks is a direct implementation of Dijkstra's algorithm. Every router builds a topology map and computes the lowest-cost path to every destination."
  },
  {
    title: "Logistics Fleet",
    icon: Globe,
    explanation: "Optimizing delivery routes for thousands of packages daily.",
    impact: "Saves millions in fuel and time for companies like UPS and Amazon.",
    detail: "Logistics companies model road networks as weighted graphs where edge weights represent distance, fuel cost, or time. Dijkstra's algorithm finds the optimal route for each delivery vehicle across the entire fleet."
  }
];

export default function DijkstraExhibit() {
  const exhibitData = exhibits.find(e => e.slug === "city-map")!;
  const { markComplete } = useProgression();
  const [startNode, setStartNode] = useState("home");
  const [endNode, setEndNode] = useState("hospital");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = useMemo(() => generateDijkstraSteps(startNode, endNode, nodes, edges), [startNode, endNode]);
  const step = steps[currentStepIndex];
  const isComplete = step.status === "found" || step.status === "not_found";

  useEffect(() => {
    if (isComplete && step.status === "found") {
      markComplete(exhibitData.id);
    }
  }, [isComplete, step.status, exhibitData.id, markComplete]);

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) setCurrentStepIndex(i => i + 1);
  };
  const reset = () => setCurrentStepIndex(0);

  useEffect(() => {
    setCurrentStepIndex(0);
  }, [startNode, endNode]);

  return (
    <ExhibitShell
      exhibit={exhibitData}
      sidebar={timelineItems.map((item, i) => ({
        label: item.label,
        description: item.description,
        isActive: step.timelineIndex === i,
        isPast: step.timelineIndex > i
      }))}
      controls={
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 mr-4">
            <div className="flex flex-col items-end">
              <span className="text-[7px] uppercase tracking-widest text-neutral-500 font-bold">Start</span>
              <select
                value={startNode}
                onChange={e => setStartNode(e.target.value)}
                className="bg-transparent text-xs font-mono text-blue-400 font-bold outline-none cursor-pointer text-right appearance-none"
              >
                {nodes.map(n => (
                  <option key={n.id} value={n.id} className="bg-neutral-900">
                    {n.label}
                  </option>
                ))}
              </select>
            </div>
            <ArrowLeft className="w-3 h-3 text-neutral-600 rotate-180 mx-1" />
            <div className="flex flex-col items-start">
              <span className="text-[7px] uppercase tracking-widest text-neutral-500 font-bold">Destination</span>
              <select
                value={endNode}
                onChange={e => setEndNode(e.target.value)}
                className="bg-transparent text-xs font-mono text-green-400 font-bold outline-none cursor-pointer appearance-none"
              >
                {nodes
                  .filter(n => n.id !== startNode)
                  .map(n => (
                    <option key={n.id} value={n.id} className="bg-neutral-900">
                      {n.label}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <button onClick={reset} className="p-2 rounded-lg hover:bg-blue-500/10 text-neutral-500 hover:text-blue-400 transition-all">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      }
      simulation={
        <>
          <div className="relative rounded-2xl overflow-hidden border border-white/[0.07] bg-black/40">
            <motion.div
              key={`accent-${currentStepIndex}`}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{ originY: 0 }}
              className={`absolute left-0 top-0 bottom-0 w-[3px] z-20 ${
                step.status === "found"
                  ? "bg-green-500"
                  : step.status === "not_found"
                  ? "bg-red-500/70"
                  : step.status === "init"
                  ? "bg-blue-500/50"
                  : "bg-blue-500"
              }`}
            />
            <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(255,255,255,0.012)_4px)] z-10" />

            <div className="pl-5 pr-5 py-4 relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${step.status === "found" ? "bg-green-400" : "bg-blue-400 animate-pulse"}`} />
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] text-neutral-500">Navigation Log</span>
                </div>
                <span className="text-[9px] font-mono text-neutral-600">
                  STEP {currentStepIndex + 1} / {steps.length}
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStepIndex}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[8px] font-black uppercase tracking-widest text-neutral-600 w-20 shrink-0">Status</span>
                    <span className={`text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded ${
                      step.status === "found"
                        ? "bg-green-500/15 text-green-400"
                        : step.status === "not_found"
                        ? "bg-red-500/15 text-red-400"
                        : step.status === "init"
                        ? "bg-blue-500/10 text-blue-400/70"
                        : "bg-blue-500/15 text-blue-400"
                    }`}>
                      {step.statusLabel}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-[8px] font-black uppercase tracking-widest text-neutral-600 w-20 shrink-0 pt-0.5">Action</span>
                    <span className="text-sm font-semibold text-white leading-snug">{step.action}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-[8px] font-black uppercase tracking-widest text-neutral-600 w-20 shrink-0 pt-0.5">Note</span>
                    <span className="text-[11px] text-neutral-400 leading-snug">{step.note}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <MapCanvas nodes={nodes} edges={edges} step={step} startNode={startNode} endNode={endNode} />

          <div className="flex items-center gap-6 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
            <button
              onClick={nextStep}
              disabled={isComplete}
              className="flex-1 group relative h-14 rounded-xl overflow-hidden bg-white text-black font-black uppercase tracking-tighter disabled:opacity-20 transition-all active:scale-[0.98]"
            >
              <div className="relative flex items-center justify-center gap-3">
                {isComplete ? <Flag className="w-4 h-4" /> : <Compass className="w-4 h-4" />}
                <span>{isComplete ? "Route Acquired" : "Process Next Scan"}</span>
              </div>
            </button>
            <button onClick={reset} className="p-4 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-500 hover:text-white transition-all">
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <PriorityQueuePanel queue={step.queue} nodes={nodes} />
        </>
      }
      hud={
        <RoutingHUD step={step} nodes={nodes} startNode={startNode} endNode={endNode} />
      }
      useCases={useCases}
      performanceInsight={
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8 md:p-12">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                 <h3 className="text-3xl font-bold text-white leading-tight">Greedy vs <br/><span className="text-blue-500">Shortest Path</span></h3>
                 <p className="text-neutral-400 leading-relaxed">Dijkstra’s algorithm is unique because it guarantees the shortest path by exploring all possibilities in order of their cumulative distance.</p>
                 <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-tighter">
                    <span className="px-3 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">Optimal</span>
                    <span className="px-3 py-1 rounded bg-white/5 text-neutral-500">Consistent</span>
                 </div>
              </div>
              <div className="bg-black/40 p-8 rounded-3xl border border-white/5">
                 <div className="flex items-center gap-3 mb-6 text-blue-400">
                    <Cpu className="w-5 h-5" />
                    <span className="text-xs font-black uppercase tracking-widest">Complexity Insight</span>
                 </div>
                 <p className="text-neutral-500 text-sm leading-relaxed mb-4">With a priority queue, the algorithm runs in <span className="text-white font-bold">O(E log V)</span> time, where E is edges and V is vertices. This efficiency is why it can navigate cities with millions of streets.</p>
              </div>
           </div>
        </motion.div>
      }
      scaleVisualization={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[
             { title: "Local Grid", scale: "10-100 nodes", note: "Smart home devices" },
             { title: "City Map", scale: "10k-100k nodes", note: "Metropolitan routing" },
             { title: "Internet backbone", scale: "Millions", note: "Global traffic" }
           ].map((scale, i) => (
             <div key={i} className="bg-white/[0.02] border border-white/5 rounded-3xl p-8">
                <span className="text-[9px] font-black uppercase tracking-widest text-neutral-600 mb-2 block">{scale.title}</span>
                <p className="text-xl font-bold text-white mb-2">{scale.scale}</p>
                <p className="text-xs text-neutral-500">{scale.note}</p>
             </div>
           ))}
        </div>
      }
      takeaway="Dijkstra's algorithm ensures that we never take a longer route by always exploring the nearest unknown intersection first."
      takeawaySub="Efficiency in routing isn't just about speed; it's about the mathematical certainty of optimality. In high-stakes systems, 'close enough' isn't an option."
      successOverlay={
        isComplete && step.status === "found" && (
          <ResultOverlay step={step} endNode={endNode} reset={reset} />
        )
      }
    />
  );
}
