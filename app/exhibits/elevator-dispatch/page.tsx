"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, RotateCcw, Building, ListOrdered, 
  Terminal, ShieldCheck, Printer, Users, MessageSquare, 
  Scale, ChevronRight, Hash, ArrowDown, Zap, Globe
} from "lucide-react";
import ExhibitShell from "@/app/components/ExhibitShell";
import { exhibits } from "@/lib/data";
import { useProgression } from "@/lib/hooks/useProgression";
import { ElevatorState, ElevatorAction, ElevatorAlgorithm, ElevatorStepResponse } from "@/lib/simulations/elevator/types";
import { defaultState } from "@/lib/simulations/elevator/defaultState";
import { GlassPanel } from "@/app/components/ui/GlassPanel";
import { Badge } from "@/app/components/ui/Badge";

// --- Sub-components ---

const SyntaxHighlightedLine = ({ line, isActive }: { line: string, isActive: boolean }) => {
  const tokens = line.split(/(\s+|\(|\)|\[|\]|\{|\}|===|>|=|;|,|\d+|'|")/);
  
  return (
    <div className={`group flex relative px-4 py-0.5 transition-all duration-300 ${isActive ? "bg-blue-500/15 shadow-[inset_2px_0_0_0_#3b82f6]" : "hover:bg-white/5"}`}>
      <div className="flex-1 font-mono text-[11px] whitespace-pre overflow-hidden">
        {tokens.map((token, i) => {
          let color = "text-neutral-500";
          if (["function", "const", "let", "return", "if", "async", "await"].includes(token)) color = "text-purple-500";
          else if (["api", "post", "animateElevator"].includes(token)) color = "text-blue-400";
          else if (/^\d+$/.test(token)) color = "text-orange-400";
          else if (["REQUEST_FLOOR", "STEP", "ARRIVE_AT_TARGET", "targetFloor", "floor", "algorithm"].includes(token)) color = "text-neutral-200 font-medium";
          else if (["'", '"'].includes(token)) color = "text-green-400";
          
          return (
            <span key={i} className={`${color} relative group/token`}>
              {token}
            </span>
          );
        })}
      </div>
    </div>
  );
};

const useCases = [
  { icon: Building, title: "Elevator Systems", explanation: "Serving floor requests based on specialized algorithms.", impact: "Foundation of vertical transportation.", detail: "Advanced dispatch systems use SSTF or SCAN algorithms to prioritize nearby requests, avoiding the inefficiency of strict FIFO ordering when serving dozens of floors." },
  { icon: Users, title: "Customer Support", explanation: "Handling support tickets sequentially to ensure fairness.", impact: "Critical for SLA compliance.", detail: "Ticket systems preserve fairness through arrival-order processing (FCFS). Agents pull from the front, guaranteeing that the longest-waiting customer is always served next." },
  { icon: Printer, title: "Printer Jobs", explanation: "Printing documents in the order they arrive at the server.", impact: "Standard in shared office systems.", detail: "Print spoolers queue documents for orderly execution. The operating system maintains a FIFO buffer of print jobs, ensuring fairness across network users." },
  { icon: MessageSquare, title: "Message Queues", explanation: "Decoupling microservices with Kafka or RabbitMQ.", impact: "Powers distributed systems.", detail: "FIFO ordering is critical in distributed systems. Kafka partitions rely on ordered message processing to ensure that events like payments are handled in the correct causal sequence." },
  { icon: ListOrdered, title: "Hard Drive Scheduling", explanation: "Moving disk read/write heads efficiently.", impact: "Maximizes I/O throughput.", detail: "Operating systems use SCAN (Elevator Algorithm) to schedule disk arm movements, sweeping across the disk surface to process localized read/write requests efficiently." },
  { icon: Terminal, title: "OS Tasks", explanation: "Scheduling CPU execution for sequential processes.", impact: "Core operating system scheduling.", detail: "Operating systems use scheduling queues to decide execution order. Basic schedulers use FCFS, while advanced ones prioritize based on shortest-job-first principles." }
];

export default function ElevatorDispatchExhibit() {
  const exhibitData = exhibits.find(e => e.slug === "elevator-dispatch")!;
  const { markComplete } = useProgression();
  
  // Backend State
  const [engineState, setEngineState] = useState<ElevatorState>(defaultState);
  const engineStateRef = useRef<ElevatorState>(defaultState);
  
  // Frontend State
  const [isProcessing, setIsProcessing] = useState(false);
  const isProcessingRef = useRef(false);
  const [isMoving, setIsMoving] = useState(false);
  
  const [activeLines, setActiveLines] = useState<number[]>([]);
  const [logs, setLogs] = useState<{ id: number, text: string, type: 'info'|'success'|'warn'|'system'|'action' }[]>([
    { id: Date.now(), text: "SYSTEM IDLE", type: 'system' }
  ]);
  
  const FLOORS = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

  // Keep ref synced for closures
  useEffect(() => {
    engineStateRef.current = engineState;
  }, [engineState]);

  // Completion check
  useEffect(() => {
    if (engineState.completedRequests >= 5) {
      markComplete(exhibitData.id);
    }
  }, [engineState.completedRequests, exhibitData.id, markComplete]);

  // Helpers
  const appendLogs = (newLogs: { timestamp: number, message: string, type: string }[]) => {
    if (newLogs.length === 0) return;
    setLogs(prev => {
      const mapped = newLogs.map(l => ({ id: l.timestamp + Math.random(), text: l.message, type: l.type as any }));
      return [...mapped.reverse(), ...prev].slice(0, 5);
    });
  };

  const addLocalLog = (text: string, type: 'info'|'success'|'warn'|'system'|'action' = 'system') => {
    setLogs(prev => [{ id: Date.now() + Math.random(), text, type }, ...prev].slice(0, 5));
  };

  // API Interaction
  const sendAction = async (action: ElevatorAction): Promise<ElevatorState | null> => {
    if (isProcessingRef.current) return null;
    
    isProcessingRef.current = true;
    setIsProcessing(true);
    
    try {
      const res = await fetch("/api/exhibits/elevator-dispatch/step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state: engineStateRef.current, action })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        addLocalLog(`API ERROR: ${errorData.error || res.statusText}`, 'warn');
        return null;
      }
      
      const data: ElevatorStepResponse = await res.json();
      setEngineState(data.state);
      appendLogs(data.logs);
      return data.state;
      
    } catch (e) {
      addLocalLog(`NETWORK ERROR: COULD NOT CONNECT TO ENGINE`, 'warn');
      return null;
    } finally {
      isProcessingRef.current = false;
      setIsProcessing(false);
    }
  };

  // Automatic Dispatcher
  const continueDispatch = async (currentState: ElevatorState) => {
    if (isProcessingRef.current || currentState.queue.length === 0 || currentState.targetFloor !== null) return;
    
    const newState = await sendAction({ type: "STEP" });
    if (newState && newState.targetFloor !== null) {
      setIsMoving(true);
      setActiveLines([7, 8]); // highlight step
    }
  };

  // Event Handlers
  const handleFloorClick = async (floor: number) => {
    if (engineState.queue.some(r => r.floor === floor)) return;
    if (engineState.currentFloor === floor && !isMoving && !engineState.targetFloor) return;
    if (engineState.targetFloor === floor) return;

    setActiveLines([3]); // highlight requestFloor
    const newState = await sendAction({ type: "REQUEST_FLOOR", payload: { floor } });
    
    if (newState && newState.targetFloor === null && newState.queue.length > 0) {
      continueDispatch(newState);
    }
  };

  const handleArrival = async () => {
    setIsMoving(false);
    setActiveLines([12]); // highlight arrive
    const newState = await sendAction({ type: "ARRIVE_AT_TARGET" });
    
    if (newState && newState.queue.length > 0) {
      setTimeout(() => {
        continueDispatch(newState);
      }, 300);
    }
  };

  const handleSetAlgorithm = async (algo: ElevatorAlgorithm) => {
    const newState = await sendAction({ type: "SET_ALGORITHM", payload: { algorithm: algo } });
    if (newState && newState.targetFloor === null && newState.queue.length > 0) {
      continueDispatch(newState);
    }
  };

  const handleReset = async () => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;
    setIsProcessing(true);
    try {
      const res = await fetch("/api/exhibits/elevator-dispatch/reset", { method: "POST" });
      const data = await res.json();
      setEngineState(data);
      setIsMoving(false);
      setLogs([{ id: Date.now(), text: "SYSTEM RESET", type: 'warn' }]);
      setActiveLines([]);
    } finally {
      isProcessingRef.current = false;
      setIsProcessing(false);
    }
  };

  const addRandomRequest = () => {
    const availableFloors = FLOORS.filter(f => f !== engineState.currentFloor && f !== engineState.targetFloor && !engineState.queue.some(r => r.floor === f));
    if (availableFloors.length > 0) {
      const randomFloor = availableFloors[Math.floor(Math.random() * availableFloors.length)];
      handleFloorClick(randomFloor);
    }
  };

  return (
    <ExhibitShell
      exhibit={exhibitData}
      sidebar={[
        { label: "Initialize", description: "System standby", isActive: engineState.queue.length === 0 && !isMoving, isPast: false },
        { label: "Queueing", description: "Buffering requests", isActive: engineState.queue.length > 0 && !isMoving, isPast: engineState.queue.length === 0 && isMoving },
        { label: "Dispatching", description: "In transit", isActive: isMoving, isPast: false },
        { label: "Arrival", description: "Job complete", isActive: false, isPast: false }
      ]}
      controls={
        <div className="flex items-center gap-4">
          <div className="flex gap-1 bg-white/5 p-1 rounded-lg">
            {(["fcfs", "sstf", "scan"] as ElevatorAlgorithm[]).map(algo => (
              <button
                key={algo}
                onClick={() => handleSetAlgorithm(algo)}
                disabled={isProcessing}
                className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-colors disabled:opacity-50 ${
                  engineState.algorithm === algo ? 'bg-blue-500 text-white shadow-md' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {algo}
              </button>
            ))}
          </div>
          <div className="w-px h-6 bg-white/10" />
          <button onClick={addRandomRequest} disabled={isProcessing} className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-white/5 hover:bg-white/10 text-neutral-300 transition-colors disabled:opacity-50">
            Random
          </button>
          <div className="w-px h-6 bg-white/10" />
          <button onClick={handleReset} disabled={isProcessing} className="p-2 rounded-lg hover:bg-white/5 text-neutral-500 hover:text-blue-400 transition-colors disabled:opacity-50">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      }
      simulation={
        <GlassPanel intensity="heavy" className="p-8 flex-1 relative flex flex-col items-center justify-center min-h-[700px] shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.05),transparent_70%)] pointer-events-none" />
          
          {/* Cinematic Shaft visualization */}
          <div className="relative w-80 h-[500px] border-x border-white/10 flex flex-col justify-between py-6 bg-[#010101] rounded-2xl group/shaft shadow-[inset_0_0_120px_rgba(0,0,0,0.9)] overflow-hidden">
            {/* Ambient inner glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.02),transparent)]" />
            
            {/* Rails */}
            <div className="absolute left-6 top-0 bottom-0 w-2 bg-gradient-to-b from-[#080808] via-[#1a1a1a] to-[#080808] shadow-inner rounded-sm border-x border-white/5" />
            <div className="absolute right-6 top-0 bottom-0 w-2 bg-gradient-to-b from-[#080808] via-[#1a1a1a] to-[#080808] shadow-inner rounded-sm border-x border-white/5" />

            <div className="absolute inset-0 rounded-2xl pointer-events-none z-0">
              <motion.div 
                className="absolute left-0 w-full h-48 bg-blue-500/15 blur-[60px]"
                animate={{ bottom: `${((engineState.targetFloor || engineState.currentFloor) - 1) / 9 * 100}%`, marginBottom: '-96px' }}
                transition={{ type: "spring", stiffness: 45, damping: 25 }}
              />
              <div className="absolute inset-0 flex flex-col justify-between">
                {FLOORS.map(floor => (
                  <div key={floor} className={`w-full h-[1px] transition-colors duration-700 ${engineState.currentFloor === floor ? 'bg-blue-500/40 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-white/[0.03]'}`} />
                ))}
              </div>
              {isMoving && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ bottom: `${((engineState.currentFloor) - 1) / 9 * 100}%`, marginBottom: '-64px' }}
                  className="absolute left-0 right-0 h-32 bg-gradient-to-t from-transparent to-blue-500/30 blur-xl"
                />
              )}
            </div>

            <div className="absolute right-12 inset-y-0 flex flex-col justify-between py-6 pointer-events-none z-10">
              {FLOORS.map(floor => (
                <span key={floor} className={`text-[10px] font-mono font-bold transition-colors duration-500 ${(isMoving ? engineState.targetFloor === floor : engineState.currentFloor === floor) ? 'text-blue-400' : 'text-neutral-700'}`}>
                  {floor.toString().padStart(2, '0')}
                </span>
              ))}
            </div>

            <motion.div 
              className={`absolute left-1/2 w-48 h-16 rounded-xl backdrop-blur-md flex items-center justify-between px-4 z-20 transition-all duration-700 ${isMoving ? 'bg-blue-500/15 border-blue-400/40 shadow-[0_0_50px_rgba(59,130,246,0.25)]' : 'bg-[#0a0a0a]/90 border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)]'} border pointer-events-none`}
              style={{ translateX: "-50%" }}
              animate={{ bottom: `${((engineState.targetFloor || engineState.currentFloor) - 1) / 9 * 100}%`, marginBottom: (engineState.targetFloor || engineState.currentFloor) === 1 ? '24px' : (engineState.targetFloor || engineState.currentFloor) === 10 ? '-24px' : '0px' }}
              transition={{ type: "spring", stiffness: 40, damping: 25, mass: 1.5 }}
              onAnimationComplete={() => {
                if (isMoving && engineState.targetFloor) {
                  handleArrival();
                }
              }}
            >
              <div className="w-2 h-10 rounded-full bg-blue-500/20 border border-blue-500/50 flex flex-col justify-between p-0.5">
                 <div className={`w-full h-1 bg-blue-400 rounded-full ${isMoving ? 'animate-pulse' : ''}`} />
                 <div className={`w-full h-1 bg-blue-400 rounded-full ${isMoving ? 'animate-pulse' : ''}`} />
              </div>
              <div className="flex-1 flex justify-center items-center">
                 <div className={`w-16 h-10 rounded-lg border ${isMoving ? 'border-blue-400/40 bg-blue-500/20' : 'border-white/10 bg-white/5'} flex items-center justify-center font-mono text-xl font-black ${isMoving ? 'text-blue-400 shadow-[inset_0_0_15px_rgba(59,130,246,0.3)]' : 'text-white'}`}>
                    {isMoving ? engineState.targetFloor : engineState.currentFloor}
                 </div>
              </div>
              <div className="w-2 h-10 rounded-full bg-blue-500/20 border border-blue-500/50 flex flex-col justify-between p-0.5">
                 <div className={`w-full h-1 bg-blue-400 rounded-full ${isMoving ? 'animate-pulse' : ''}`} />
                 <div className={`w-full h-1 bg-blue-400 rounded-full ${isMoving ? 'animate-pulse' : ''}`} />
              </div>
            </motion.div>

            {/* Buttons attached to shaft */}
            <div className="absolute -left-7 top-0 bottom-0 flex flex-col justify-between py-6 z-50 pointer-events-auto">
              {FLOORS.map(floor => {
                const isCurrentTarget = floor === engineState.targetFloor;
                const isCurrentIdle = floor === engineState.currentFloor && !isMoving && !engineState.targetFloor;
                const isQueued = engineState.queue.some(r => r.floor === floor);
                const isDisabled = isQueued || isCurrentTarget || isCurrentIdle || isProcessing;

                return (
                  <button
                    key={floor}
                    onClick={() => handleFloorClick(floor)}
                    disabled={isDisabled}
                    className={`w-14 h-12 rounded-xl border flex flex-col items-center justify-center transition-all transform hover:scale-105 active:scale-95 relative group/btn pointer-events-auto shadow-md ${
                      isCurrentTarget ? "bg-blue-600 text-white border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.5)]" :
                      isCurrentIdle ? "bg-blue-500/10 text-blue-400 border-blue-500/30" :
                      isQueued ? "bg-white/10 text-white border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]" :
                      "bg-[#0a0a0a] text-neutral-500 border-white/5 hover:border-white/20 hover:text-white"
                    } ${isDisabled ? "cursor-default opacity-80 hover:scale-100" : "cursor-pointer"}`}
                  >
                    <span className="text-xs font-mono font-black">{floor}</span>
                    {isQueued && (
                      <motion.div layoutId={`ripple-${floor}`} className="absolute inset-0 rounded-xl border border-white/30 animate-pulse pointer-events-none" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mini status strip */}
          <div className="mt-12 flex items-center justify-center gap-8 px-8 py-3.5 rounded-full bg-white/[0.02] border border-white/5 backdrop-blur-md">
             <div className="flex items-center gap-3">
               <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500">Current</span>
               <span className="text-xs font-mono font-bold text-white">{engineState.currentFloor}</span>
             </div>
             <div className="w-px h-4 bg-white/10" />
             <div className="flex items-center gap-3">
               <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500">Target</span>
               <span className="text-xs font-mono font-bold text-blue-400">{engineState.targetFloor || '--'}</span>
             </div>
             <div className="w-px h-4 bg-white/10" />
             <div className="flex items-center gap-3">
               <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500">Queue</span>
               <span className="text-xs font-mono font-bold text-white">{engineState.queue.length}</span>
             </div>
             <div className="w-px h-4 bg-white/10" />
             <div className="flex items-center gap-3">
               <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500">Completed</span>
               <span className="text-xs font-mono font-bold text-emerald-400">{engineState.completedRequests}</span>
             </div>
          </div>
        </GlassPanel>
      }
      hud={
        <GlassPanel intensity="medium" className="p-6 mt-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Simulation Brain</span>
            <Badge variant="success" pulse>Engine Online</Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
             <div className="bg-white/[0.02] border border-white/5 rounded-lg p-3">
                <span className="text-[9px] font-black uppercase tracking-widest text-neutral-600 block mb-1">Algorithm</span>
                <span className="text-xs font-mono font-bold text-blue-400 uppercase">{engineState.algorithm}</span>
             </div>
             <div className="bg-white/[0.02] border border-white/5 rounded-lg p-3">
                <span className="text-[9px] font-black uppercase tracking-widest text-neutral-600 block mb-1">System State</span>
                <span className="text-xs font-mono font-bold text-white uppercase">{isMoving ? 'In Transit' : isProcessing ? 'Computing' : engineState.direction !== 'idle' ? 'Dispatching' : 'Idle'}</span>
             </div>
          </div>

          <div className="space-y-4">
             <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">API Trace Timeline</span>
                <div className="flex flex-col gap-2 border-l border-white/10 pl-4 ml-1.5 py-1">
                   {[
                     { label: 'REQUEST_FLOOR', active: activeLines.includes(3) },
                     { label: 'STEP', active: activeLines.includes(7) || activeLines.includes(8) },
                     { label: 'TARGET_LOCKED', active: isMoving && engineState.targetFloor !== null },
                     { label: 'ARRIVE_AT_TARGET', active: activeLines.includes(12) }
                   ].map((step, i) => (
                     <div key={i} className="flex items-center gap-3 relative">
                        <div className={`absolute -left-[21px] w-2 h-2 rounded-full border border-[#080808] transition-colors duration-300 flex items-center justify-center ${step.active ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-neutral-800'}`}>
                          <AnimatePresence>
                            {step.active && (
                              <motion.div 
                                initial={{ opacity: 0, scale: 1 }}
                                animate={{ opacity: [0, 0.8, 0], scale: [1, 2.5, 3.5] }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.6 }}
                                className="absolute inset-0 rounded-full bg-blue-400 pointer-events-none"
                              />
                            )}
                          </AnimatePresence>
                        </div>
                        <span className={`text-[10px] font-mono font-bold tracking-widest transition-colors duration-300 ${step.active ? 'text-blue-400' : 'text-neutral-600'}`}>
                          {step.label}
                        </span>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </GlassPanel>
      }
      logic={
        <GlassPanel intensity="medium" className="flex flex-col flex-1 h-full min-h-[500px]">
          {/* Header */}
          <div className="bg-white/[0.03] border-b border-white/5 px-6 py-4 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Dispatch Console</span>
            {isProcessing ? (
               <Badge variant="warning" pulse>Syncing API</Badge>
            ) : (
               <Badge variant="brand" pulse>Live System</Badge>
            )}
          </div>
          
          <div className="p-6 space-y-8 flex-1 flex flex-col justify-between">
            {/* System HUD */}
            <div className="space-y-6">
              <div className="flex flex-col gap-1 w-full p-4 rounded-xl bg-[#020202] border border-white/5 h-[104px] overflow-hidden shadow-inner">
                {logs.map((log, idx) => (
                  <motion.div 
                    key={log.id} 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: Math.max(0.2, 1 - (idx * 0.2)), x: 0 }}
                    className={`text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-2 ${
                      idx === 0 
                        ? (log.type === 'warn' ? 'text-orange-400' : log.type === 'success' || log.type === 'action' ? 'text-emerald-400' : 'text-blue-400') 
                        : 'text-neutral-600'
                    }`}
                  >
                    <span className="opacity-50">{'>'}</span>
                    <span className="truncate">{log.text}</span>
                  </motion.div>
                ))}
              </div>
              
              <div className="pt-2 border-t border-white/5">
                 <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">API Queue Buffer</span>
                    <span className="text-[10px] font-mono text-blue-500 font-bold">{engineState.queue.length} Pending</span>
                 </div>
                 <div className="space-y-2 max-h-[140px] overflow-y-auto pr-2">
                    <AnimatePresence>
                      {engineState.queue.map((req, i) => (
                        <motion.div 
                          key={req.floor}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5 mb-2"
                        >
                          <span className="text-xs font-bold text-white tracking-wide">Floor {req.floor}</span>
                          <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">Wait: {Math.floor((Date.now() - req.timestamp)/1000)}s</span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {engineState.queue.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-6 rounded-lg bg-white/[0.01] border border-white/5 border-dashed">
                        <div className="w-6 h-6 rounded-full bg-white/[0.02] flex items-center justify-center mb-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-neutral-600 animate-pulse" />
                        </div>
                        <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">System Idle</span>
                        <span className="text-[8px] text-neutral-600 mt-1">Awaiting dispatch requests</span>
                      </div>
                    )}
                 </div>
              </div>
            </div>

            {/* Code Panel */}
            <div className="pt-8 border-t border-white/5 mt-auto">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-4 block">Engine Logic Integration</span>
              <div className="font-mono text-[11px] bg-[#020202] p-4 rounded-xl border border-white/5 shadow-inner">
                {[
                  `const algorithm = '${engineState.algorithm}';`,
                  "",
                  "async function requestFloor(floor) {",
                  "  await api.post('/step', { type: 'REQUEST_FLOOR', floor });",
                  "}",
                  "",
                  "async function dispatchNext() {",
                  "  const { targetFloor } = await api.post('/step', { type: 'STEP' });",
                  "  if (targetFloor) animateElevator(targetFloor);",
                  "}",
                  "",
                  "async function onArrival() {",
                  "  await api.post('/step', { type: 'ARRIVE_AT_TARGET' });",
                  "}"
                ].map((line, idx) => (
                  <SyntaxHighlightedLine key={idx} line={line} isActive={activeLines.includes(idx)} />
                ))}
              </div>
            </div>
          </div>
        </GlassPanel>
      }
      useCases={useCases}
      takeaway="Queues are predictable because the first request added is the first one served."
      takeawaySub="In scheduling systems, FIFO (First-In, First-Out) ensures fairness by preventing new requests from 'jumping the line'. It is the simplest and most honest way to process a sequence of demands. Advanced algorithms like SSTF optimize speed over strict fairness."
    />
  );
}
