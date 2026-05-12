"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  RotateCcw, MapPin, Truck, ChevronRight, 
  Package, Navigation, Zap, Network, Crosshair, Box,
  Terminal, ShieldCheck, ArrowRight
} from "lucide-react";
import ExhibitShell from "@/app/components/ExhibitShell";
import { exhibits } from "@/lib/data";
import { useProgression } from "@/lib/hooks/useProgression";

// --- Types ---

interface Point {
  id: string;
  x: number;
  y: number;
  label: string;
}

type Phase = "dispatch" | "evaluate" | "compare" | "commit" | "move" | "arrived" | "complete";

// --- Data ---

const DEPOT: Point = { id: "depot", x: 50, y: 85, label: "Depot" };

const INITIAL_STOPS: Point[] = [
  { id: "A", x: 20, y: 60, label: "Stop A" },
  { id: "B", x: 35, y: 25, label: "Stop B" },
  { id: "C", x: 75, y: 20, label: "Stop C" },
  { id: "D", x: 85, y: 55, label: "Stop D" },
  { id: "E", x: 55, y: 45, label: "Stop E" },
];

const USE_CASES = [
  { icon: Truck, title: "Delivery Logistics", explanation: "Routing drivers through neighborhoods.", impact: "Optimizes millions of daily drop-offs.", detail: "Companies like UPS use greedy-like localized heuristics to quickly route drivers to the nearest next cluster of stops without recalculating the entire global route." },
  { icon: Navigation, title: "Ride Sharing", explanation: "Assigning drivers to nearby riders.", impact: "Minimizes wait times and deadhead miles.", detail: "Uber and Lyft use greedy distance metrics to dispatch the absolute closest available driver to a new ride request." },
  { icon: Box, title: "Warehouse Picking", explanation: "Navigating robots through inventory aisles.", impact: "Dramatically speeds up order fulfillment.", detail: "Amazon fulfillment robots use greedy logic to pick the closest item on their list before moving to items further down the aisle." },
  { icon: Crosshair, title: "Robot Path Planning", explanation: "Navigating autonomous devices through spaces.", impact: "Ensures quick area coverage.", detail: "Autonomous vacuums and drones often employ greedy nearest-unvisited node strategies to explore and clean open spaces efficiently." },
  { icon: Package, title: "Food Delivery Batching", explanation: "Grouping nearby restaurant orders.", impact: "Keeps food hot and reduces driver trips.", detail: "Platforms like DoorDash use immediate proximity to batch multiple orders together if they lie closely along the current delivery vector." },
  { icon: Network, title: "Network Routing Heuristics", explanation: "Sending data packets to the nearest node.", impact: "Ensures fast internet traffic flow.", detail: "While optimal protocols exist, many internet routers make quick 'greedy' decisions to forward packets to the router with the lowest immediate latency." }
];

// --- Helpers ---

const getDistance = (p1: Point, p2: Point) => {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
};

const getOptimalRoute = (start: Point, stops: Point[]): { distance: number, route: Point[] } => {
  if (stops.length === 0) return { distance: 0, route: [] };
  let min = Infinity;
  let bestRoute: Point[] = [];
  for (let i = 0; i < stops.length; i++) {
    const nextStops = stops.slice();
    const stop = nextStops.splice(i, 1)[0];
    const d = getDistance(start, stop);
    const rest = getOptimalRoute(stop, nextStops);
    if (d + rest.distance < min) {
      min = d + rest.distance;
      bestRoute = [stop, ...rest.route];
    }
  }
  return { distance: min, route: bestRoute };
};

// --- Components ---

const SyntaxHighlightedLine = ({ line, isActive }: { line: string, isActive: boolean }) => {
  const tokens = line.split(/(\s+|\(|\)|\[|\]|\{|\}|===|=>|=|;|,|<|\?|:)/);
  return (
    <div className={`group flex relative px-4 py-0.5 transition-all duration-300 ${isActive ? "bg-blue-500/15 shadow-[inset_2px_0_0_0_#3b82f6]" : "hover:bg-white/5"}`}>
      <div className="flex-1 font-mono text-[11px] whitespace-pre overflow-hidden">
        {tokens.map((token, i) => {
          let color = "text-neutral-500";
          if (["function", "const", "let", "return", "if", "for"].includes(token)) color = "text-purple-500";
          else if (["reduce", "distance", "push", "add"].includes(token)) color = "text-blue-400";
          else if (["planNext", "current", "stops", "nearest", "stop", "nextStop", "route", "visited"].includes(token)) color = "text-neutral-200 font-medium";
          return <span key={i} className={color}>{token}</span>;
        })}
      </div>
    </div>
  );
};

export default function DeliveryRouteExhibit() {
  const exhibitData = exhibits.find(e => e.slug === "delivery-route")!;
  const { markComplete } = useProgression();
  
  const [currentLoc, setCurrentLoc] = useState<Point>(DEPOT);
  const [unvisitedStops, setUnvisitedStops] = useState<Point[]>(INITIAL_STOPS);
  const [visitedRoute, setVisitedRoute] = useState<Point[]>([DEPOT]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [phase, setPhase] = useState<Phase>("dispatch");
  const [evalData, setEvalData] = useState<{stop: Point, dist: number, isWinner: boolean}[]>([]);
  const [activeLines, setActiveLines] = useState<number[]>([]);
  const [optimalDist, setOptimalDist] = useState(0);
  const [nearestTarget, setNearestTarget] = useState<{stop: Point, dist: number} | null>(null);

  useEffect(() => {
    const opt = getOptimalRoute(DEPOT, INITIAL_STOPS);
    setOptimalDist(opt.distance);
  }, []);

  useEffect(() => {
    if (unvisitedStops.length === 0 && phase === "dispatch") {
      markComplete(exhibitData.id);
      setPhase("complete");
    }
  }, [unvisitedStops.length, phase, exhibitData.id, markComplete]);

  const planNextStop = async () => {
    if (unvisitedStops.length === 0 || phase !== "dispatch") return;
    
    // 1. Evaluate Phase
    setPhase("evaluate");
    setActiveLines([3]); // Highlight: distance(current, stop)
    
    const evals = unvisitedStops.map(stop => ({ 
      stop, 
      dist: getDistance(currentLoc, stop), 
      isWinner: false 
    }));
    setEvalData(evals);
    
    // Staggered appearance of labels takes about 150ms * length. Wait a bit longer.
    await new Promise(r => setTimeout(r, 1200));

    // 2. Compare Phase
    setPhase("compare");
    setActiveLines([2, 3, 4, 5]); // Highlight: reduce block
    await new Promise(r => setTimeout(r, 800));

    // 3. Commit Phase
    const nearest = evals.reduce((prev, curr) => curr.dist < prev.dist ? curr : prev);
    setEvalData(evals.map(e => ({ ...e, isWinner: e.stop.id === nearest.stop.id })));
    setNearestTarget(nearest);
    setPhase("commit");
    setActiveLines([8]); // Highlight: return nextStop;
    await new Promise(r => setTimeout(r, 800));

    // 4. Move Phase
    setPhase("move");
    setActiveLines([6]); // Highlight: route.push(nextStop);
    setCurrentLoc(nearest.stop);
    
    // Wait for physical truck movement (spring animation takes ~800ms)
    await new Promise(r => setTimeout(r, 900));

    // 5. Arrived / Cleanup
    setPhase("arrived");
    setActiveLines([7]); // Highlight: visited.add(nextStop);
    setVisitedRoute(prev => [...prev, nearest.stop]);
    setUnvisitedStops(prev => prev.filter(s => s.id !== nearest.stop.id));
    setTotalDistance(prev => prev + nearest.dist);
    setEvalData([]);
    setNearestTarget(null);
    
    await new Promise(r => setTimeout(r, 400));
    
    // Reset to dispatch or complete
    if (unvisitedStops.length === 1) { // 1 because local state closure hasn't updated yet in this function
      setPhase("complete");
      markComplete(exhibitData.id);
    } else {
      setPhase("dispatch");
    }
    setActiveLines([]);
  };

  const handleReset = () => {
    setCurrentLoc(DEPOT);
    setUnvisitedStops(INITIAL_STOPS);
    setVisitedRoute([DEPOT]);
    setTotalDistance(0);
    setPhase("dispatch");
    setEvalData([]);
    setNearestTarget(null);
    setActiveLines([]);
  };

  return (
    <ExhibitShell
      exhibit={exhibitData}
      sidebar={[
        { label: "Dispatch", description: "Ready at depot", isActive: phase === "dispatch", isPast: phase !== "dispatch" && phase !== "complete" },
        { label: "Evaluate", description: "Comparing candidates", isActive: phase === "evaluate" || phase === "compare", isPast: ["commit", "move", "arrived", "complete"].includes(phase) },
        { label: "Commit", description: "Selecting lowest cost", isActive: phase === "commit", isPast: ["move", "arrived", "complete"].includes(phase) },
        { label: "Move", description: "In transit", isActive: phase === "move" || phase === "arrived", isPast: phase === "complete" },
        { label: "Complete", description: "Route finalized", isActive: phase === "complete", isPast: false }
      ]}
      controls={
        <div className="flex items-center gap-4">
          <button 
            onClick={handleReset} 
            disabled={phase !== "dispatch" && phase !== "complete"}
            className="p-2 rounded-lg hover:bg-white/5 text-neutral-500 hover:text-blue-400 transition-colors disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      }
      simulation={
        <div className="bg-[#050505] backdrop-blur-2xl border border-white/5 rounded-[32px] p-8 flex-1 relative flex flex-col items-center justify-center shadow-2xl min-h-[700px] overflow-hidden">
          {/* Map Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]" />
          
          <div className="absolute top-6 left-6 z-20">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-1">Dispatch Map</h3>
            <p className="text-[10px] text-neutral-500 font-mono">SECTOR 7G</p>
          </div>

          <div className="relative w-full max-w-2xl aspect-[4/3] bg-white/[0.015] border border-white/5 rounded-2xl overflow-hidden z-10">
            {/* SVG Routes */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {/* Completed Route Lines */}
              {visitedRoute.map((point, idx) => {
                if (idx === 0) return null;
                const prev = visitedRoute[idx - 1];
                return (
                  <motion.line
                    key={`route-${idx}`}
                    x1={`${prev.x}%`}
                    y1={`${prev.y}%`}
                    x2={`${point.x}%`}
                    y2={`${point.y}%`}
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5 }}
                    className="opacity-70"
                  />
                );
              })}

              {/* Evaluation Lines */}
              <AnimatePresence>
                {evalData.map((ev, i) => (
                  <motion.line
                    key={`eval-line-${ev.stop.id}`}
                    initial={{ opacity: 0, pathLength: 0 }}
                    animate={{ 
                      opacity: phase === "evaluate" || phase === "compare" ? 0.3 : ev.isWinner ? 0.8 : 0.05,
                      pathLength: 1,
                      stroke: ev.isWinner && phase !== "move" ? "#60a5fa" : "#ffffff"
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: phase === "evaluate" ? i * 0.15 : 0, duration: 0.4 }}
                    x1={`${currentLoc.x}%`}
                    y1={`${currentLoc.y}%`}
                    x2={`${ev.stop.x}%`}
                    y2={`${ev.stop.y}%`}
                    strokeWidth={ev.isWinner && phase !== "move" ? "2" : "1.5"}
                    strokeDasharray={ev.isWinner ? "none" : "4 4"}
                  />
                ))}
              </AnimatePresence>
            </svg>

            {/* Evaluation Distances (Labels) */}
            <AnimatePresence>
              {evalData.map((ev, i) => {
                const midX = (currentLoc.x + ev.stop.x) / 2;
                const midY = (currentLoc.y + ev.stop.y) / 2;
                return (
                  <motion.div
                    key={`eval-dist-${ev.stop.id}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                      opacity: phase === "evaluate" || phase === "compare" ? 1 : ev.isWinner ? 1 : 0.2,
                      scale: ev.isWinner && phase === "commit" ? 1.1 : 1
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: phase === "evaluate" ? i * 0.15 : 0, duration: 0.3 }}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-20 px-2 py-0.5 rounded-md font-mono text-[9px] border backdrop-blur-md ${
                      ev.isWinner 
                        ? "bg-blue-500/20 border-blue-400/50 text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.3)]" 
                        : "bg-[#111]/80 border-white/20 text-neutral-300"
                    }`}
                    style={{ left: `${midX}%`, top: `${midY}%` }}
                  >
                    {ev.dist.toFixed(1)}u
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Stops */}
            {INITIAL_STOPS.map(stop => {
              const isVisited = visitedRoute.some(p => p.id === stop.id);
              const ev = evalData.find(e => e.stop.id === stop.id);
              const isTarget = ev?.isWinner;
              
              return (
                <div
                  key={stop.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
                  style={{ left: `${stop.x}%`, top: `${stop.y}%` }}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isVisited 
                      ? "bg-blue-500/10 border-blue-500/30 text-blue-500/50" 
                      : isTarget && (phase === "commit" || phase === "move")
                      ? "bg-blue-500/20 border-blue-400 text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                      : ev && phase === "commit"
                      ? "bg-[#111] border-white/5 text-neutral-600"
                      : "bg-[#111] border-white/20 text-neutral-400 hover:border-white/40"
                  }`}>
                    <span className="text-[10px] font-bold font-mono">{stop.id}</span>
                  </div>
                  
                  {isTarget && phase === "commit" && (
                    <motion.div
                      className="absolute inset-0 rounded-full border border-blue-400"
                      initial={{ opacity: 0, scale: 1 }}
                      animate={{ opacity: [0, 1, 0], scale: [1, 1.5, 2] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                </div>
              );
            })}

            {/* Depot */}
            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
              style={{ left: `${DEPOT.x}%`, top: `${DEPOT.y}%` }}
            >
              <div className="w-12 h-12 bg-neutral-900 border-2 border-neutral-700 rounded-xl flex items-center justify-center shadow-lg">
                <Box className="w-6 h-6 text-neutral-400" />
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 text-[9px] font-bold tracking-widest text-neutral-500 uppercase">
                Depot
              </div>
            </div>

            {/* Current Location Marker (Truck) */}
            <motion.div
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30"
              animate={{ left: `${currentLoc.x}%`, top: `${currentLoc.y}%` }}
              transition={{ type: "spring", stiffness: 45, damping: 16, mass: 1.1 }}
            >
              <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)] border-2 border-[#050505]">
                <Truck className="w-5 h-5" />
              </div>
              {phase === "arrived" && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-blue-400 z-[-1]"
                  initial={{ opacity: 0.8, scale: 1 }}
                  animate={{ opacity: 0, scale: 2 }}
                  transition={{ duration: 0.6 }}
                />
              )}
            </motion.div>
          </div>

          {/* Post-Simulation Insight Panel */}
          <AnimatePresence>
            {phase === "complete" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-[#0a0a0a]/90 backdrop-blur-xl border border-amber-500/20 shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-40 flex items-center gap-8"
              >
                <div className="flex-1">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-500/80 mb-2 block">Greedy Decision Model</span>
                  <h4 className="text-sm font-bold text-white mb-2 leading-tight">Greedy optimizes the next move immediately.</h4>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    It is extremely fast, computing only localized distances. However, because it ignores the global map, it can trap itself into taking a very long final trip back.
                  </p>
                </div>
                <div className="w-px h-16 bg-white/10" />
                <div className="flex items-center gap-6 pr-4">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-500 block mb-1">Greedy Route</span>
                    <span className="text-xl font-mono font-black text-amber-400">{totalDistance.toFixed(1)}<span className="text-[12px] text-amber-600 ml-1">u</span></span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-500 block mb-1">Optimal Route</span>
                    <span className="text-xl font-mono font-black text-emerald-400">{optimalDist.toFixed(1)}<span className="text-[12px] text-emerald-600 ml-1">u</span></span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      }
      hud={undefined}
      logic={
        <div className="bg-[#080808]/80 backdrop-blur-xl border border-white/5 rounded-[32px] overflow-hidden shadow-2xl flex flex-col h-full">
          {/* Header */}
          <div className="bg-white/[0.03] border-b border-white/5 px-6 py-4 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Routing Engine</span>
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                phase === "complete" ? 'bg-emerald-500' : phase !== "dispatch" ? 'bg-blue-500 animate-pulse' : 'bg-neutral-700'
              }`} />
              <span className={`text-[9px] font-mono font-bold uppercase tracking-widest transition-colors duration-300 ${
                phase === "complete" ? 'text-emerald-400' : phase !== "dispatch" ? 'text-blue-400' : 'text-neutral-600'
              }`}>
                {phase === "evaluate" ? "Evaluating" 
                 : phase === "compare" ? "Comparing"
                 : phase === "commit" ? "Locked"
                 : phase === "move" ? "Moving"
                 : phase === "arrived" ? "Arrived"
                 : phase === "complete" ? "Finished" 
                 : "Standby"}
              </span>
            </div>
          </div>
          
          <div className="p-6 space-y-6 flex-1 flex flex-col justify-between">
            {/* Active Dispatch HUD */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 grid grid-cols-2 gap-4">
                 <div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-neutral-600 mb-1 block">Current Node</span>
                    <span className="text-sm font-mono font-bold text-white">{currentLoc.label}</span>
                 </div>
                 <div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-neutral-600 mb-1 block">Total Distance</span>
                    <span className="text-sm font-mono font-bold text-blue-400 transition-all">{totalDistance.toFixed(1)}<span className="text-[10px] text-neutral-500 ml-1">u</span></span>
                 </div>
                 <div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-neutral-600 mb-1 block">Evaluating</span>
                    <span className="text-[11px] font-mono font-bold text-neutral-400">
                      {phase === "complete" ? "—" : unvisitedStops.map(s => s.id).join(", ") || "—"}
                    </span>
                 </div>
                 <div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-neutral-600 mb-1 block">Nearest Candidate</span>
                    <span className={`text-[11px] font-mono font-bold transition-colors ${nearestTarget ? "text-blue-400" : "text-neutral-500"}`}>
                      {nearestTarget ? `${nearestTarget.stop.id} (${nearestTarget.dist.toFixed(1)}u)` : "—"}
                    </span>
                 </div>
              </div>

              {/* Action Button */}
              {phase !== "complete" ? (
                <button 
                  onClick={planNextStop}
                  disabled={unvisitedStops.length === 0 || phase !== "dispatch"}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold uppercase tracking-widest text-[11px] transition-all ${
                    unvisitedStops.length > 0 && phase === "dispatch"
                    ? "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                    : "bg-white/5 text-neutral-600 border border-white/5 cursor-not-allowed"
                  }`}
                >
                  {phase === "evaluate" || phase === "compare" ? 'Scanning Options...' 
                   : phase === "commit" ? 'Locking Target...' 
                   : phase === "move" ? 'Routing...' 
                   : phase === "arrived" ? 'Updating Route...' 
                   : 'Plan Next Stop'}
                  {phase === "dispatch" && <ChevronRight className="w-4 h-4" />}
                </button>
              ) : (
                <div className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold uppercase tracking-widest text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                  <ShieldCheck className="w-4 h-4" />
                  Route Complete
                </div>
              )}
            </div>

            {/* Code Panel */}
            <div className="pt-6 border-t border-white/5 mt-auto">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-4 block">Greedy Logic Execution</span>
              <div className="font-mono text-[11px] bg-black/40 py-4 rounded-xl border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 bottom-0 left-0 w-1 bg-white/5" />
                {[
                  "function planNext(current, stops, route, visited) {",
                  "  const nextStop = stops.reduce((nearest, stop) =>",
                  "    distance(current, stop) < distance(current, nearest)",
                  "      ? stop : nearest",
                  "  );",
                  "  route.push(nextStop);",
                  "  visited.add(nextStop);",
                  "  return nextStop;",
                  "}"
                ].map((line, idx) => (
                  <SyntaxHighlightedLine key={idx} line={line} isActive={activeLines.includes(idx + 1)} />
                ))}
              </div>
            </div>
          </div>
        </div>
      }
      useCases={USE_CASES}
      takeaway="Greedy algorithms are fast because they optimize the next move, not the entire future."
      takeawaySub="By always picking the nearest available option, greedy approaches avoid calculating millions of potential future paths. While this doesn't guarantee the mathematically perfect route (unlike Dijkstra's), it provides extremely fast, 'good enough' decisions for complex logistics. Greedy is efficient, but not always globally optimal."
    />
  );
}
