"use client";

import { useState, useEffect } from "react";
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

// --- Sub-components ---

const SyntaxHighlightedLine = ({ line, isActive }: { line: string, isActive: boolean }) => {
  const tokens = line.split(/(\s+|\(|\)|\[|\]|\{|\}|===|>|=|;|,|\d+)/);
  
  return (
    <div className={`group flex relative px-4 py-0.5 transition-all duration-300 ${isActive ? "bg-blue-500/15 shadow-[inset_2px_0_0_0_#3b82f6]" : "hover:bg-white/5"}`}>
      <div className="flex-1 font-mono text-[11px] whitespace-pre overflow-hidden">
        {tokens.map((token, i) => {
          let color = "text-neutral-500";
          if (["function", "const", "let", "return", "if"].includes(token)) color = "text-purple-500";
          else if (["push", "shift", "moveTo"].includes(token)) color = "text-blue-400";
          else if (/^\d+$/.test(token)) color = "text-orange-400";
          else if (["queue", "floor", "nextFloor", "elevator", "length"].includes(token)) color = "text-neutral-200 font-medium";
          
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
  { icon: Building, title: "Elevator Systems", explanation: "Serving floor requests fairly in the order they were received.", impact: "Foundation of vertical transportation.", detail: "Basic dispatch systems process requests sequentially. In most residential and commercial buildings, a single-car elevator uses a simple FIFO queue to serve each floor call in the exact order it was pressed—ensuring no request is starved." },
  { icon: Users, title: "Customer Support", explanation: "Handling support tickets sequentially to ensure fairness.", impact: "Critical for SLA compliance.", detail: "Ticket systems preserve fairness through arrival-order processing. When a customer submits a request, it enters the back of the queue. Agents pull from the front, guaranteeing that the longest-waiting customer is always served next." },
  { icon: Printer, title: "Printer Jobs", explanation: "Printing documents in the order they arrive at the server.", impact: "Standard in shared office systems.", detail: "Print spoolers queue documents for orderly execution. The operating system maintains a FIFO buffer of print jobs, ensuring that a 200-page report submitted first won't be delayed by a single-page memo submitted later." },
  { icon: MessageSquare, title: "Message Queues", explanation: "Decoupling microservices with Kafka or RabbitMQ.", impact: "Powers distributed systems.", detail: "FIFO ordering is critical in distributed systems. Kafka partitions and RabbitMQ channels rely on ordered message processing to ensure that events like payments, inventory updates, and notifications are handled in the correct causal sequence." },
  { icon: ListOrdered, title: "Restaurant Orders", explanation: "Processing tickets as they arrive to the kitchen.", impact: "Maintains service predictability.", detail: "Kitchen workflows follow queue ordering to maintain fairness and throughput. A ticket printed at 7:01 PM is prepared before one printed at 7:03 PM, preventing chaos and ensuring consistent service times across the dining room." },
  { icon: Terminal, title: "OS Tasks", explanation: "Scheduling CPU execution for sequential processes.", impact: "Core operating system scheduling.", detail: "Operating systems use scheduling queues to decide execution order. In a basic round-robin scheduler, each process enters a ready queue and receives CPU time in the order it arrived—the simplest form of fair multitasking." }
];

export default function ElevatorDispatchExhibit() {
  const exhibitData = exhibits.find(e => e.slug === "elevator-dispatch")!;
  const { markComplete } = useProgression();
  const [queue, setQueue] = useState<number[]>([]);
  const [currentFloor, setCurrentFloor] = useState(1);
  const [targetFloor, setTargetFloor] = useState<number | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [completedFloors, setCompletedFloors] = useState<number[]>([]);
  const [activeLines, setActiveLines] = useState<number[]>([]);
  const [logs, setLogs] = useState<{ id: number, text: string, type: 'info'|'success'|'warn' }[]>([
    { id: Date.now(), text: "SYSTEM IDLE", type: 'info' }
  ]);
  const [completedRequests, setCompletedRequests] = useState<number>(0);
  
  const FLOORS = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

  const addLog = (text: string, type: 'info'|'success'|'warn' = 'info') => {
    setLogs(prev => {
      const newLogs = [{ id: Date.now(), text, type }, ...prev].slice(0, 3);
      return newLogs;
    });
  };

  useEffect(() => {
    if (completedRequests >= 5) {
      markComplete(exhibitData.id);
    }
  }, [completedRequests, exhibitData.id, markComplete]);

  const handleFloorClick = (floor: number) => {
    if (queue.includes(floor)) {
      addLog(`REJECTED: FLR ${floor} ALREADY QUEUED`, 'warn');
      setActiveLines([]);
      return;
    }
    if (floor === targetFloor || (floor === currentFloor && !isMoving && !targetFloor)) {
      addLog(`REJECTED: ALREADY AT FLR ${floor}`, 'warn');
      setActiveLines([]);
      return;
    }

    setQueue(prev => [...prev, floor]);
    addLog(`RECEIVED: QUEUED FLR ${floor}`, 'info');
    setActiveLines([3]); // Highlight queue.push(floor);
    setCompletedFloors(prev => prev.filter(f => f !== floor));
  };

  const handleStep = () => {
    if (queue.length === 0 || isMoving) return;

    const nextFloor = queue[0];
    setQueue(prev => prev.slice(1));
    setTargetFloor(nextFloor);
    setIsMoving(true);
    addLog(`DISPATCHING: MOVING TO FLR ${nextFloor}`, 'info');
    setActiveLines([8, 9]); // queue.shift() and elevator.moveTo()
    
    setCurrentFloor(nextFloor);
  };

  const handleReset = () => {
    setQueue([]);
    setCurrentFloor(1);
    setTargetFloor(null);
    setIsMoving(false);
    setCompletedFloors([]);
    setActiveLines([]);
    setLogs([{ id: Date.now(), text: "SYSTEM RESET", type: 'warn' }]);
    setCompletedRequests(0);
  };

  const addRandomRequest = () => {
    const availableFloors = FLOORS.filter(f => f !== currentFloor && f !== targetFloor && !queue.includes(f));
    if (availableFloors.length > 0) {
      const randomFloor = availableFloors[Math.floor(Math.random() * availableFloors.length)];
      handleFloorClick(randomFloor);
    }
  };

  return (
    <ExhibitShell
      exhibit={exhibitData}
      sidebar={[
        { label: "Initialize", description: "System standby", isActive: queue.length === 0 && !isMoving, isPast: false },
        { label: "Queueing", description: "Buffering requests", isActive: queue.length > 0 && !isMoving, isPast: queue.length === 0 && isMoving },
        { label: "Dispatching", description: "In transit", isActive: isMoving, isPast: false },
        { label: "Arrival", description: "Job complete", isActive: false, isPast: false }
      ]}
      controls={
        <div className="flex items-center gap-4">
          <button onClick={addRandomRequest} className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-white/5 hover:bg-white/10 text-neutral-300 transition-colors">
            Random Request
          </button>
          <div className="w-px h-6 bg-white/10" />
          <button onClick={handleReset} className="p-2 rounded-lg hover:bg-white/5 text-neutral-500 hover:text-blue-400 transition-colors">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      }
      simulation={
        <div className="bg-[#050505] backdrop-blur-2xl border border-white/5 rounded-[32px] p-8 flex-1 relative flex flex-col items-center justify-center shadow-2xl min-h-[700px] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.05),transparent_70%)]" />
          
          {/* Shaft visualization hero */}
          <div className="relative w-72 h-[500px] border-x border-white/10 flex flex-col justify-between py-6 bg-[#020202] rounded-xl group/shaft shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]">
            {/* Rails */}
            <div className="absolute left-6 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#111] via-[#222] to-[#111] shadow-inner rounded-sm" />
            <div className="absolute right-6 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#111] via-[#222] to-[#111] shadow-inner rounded-sm" />

            <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
              <motion.div 
                className="absolute left-0 w-full h-48 bg-blue-500/10 blur-[60px] z-0"
                animate={{ bottom: `${((currentFloor - 1) / 9) * 100}%`, marginBottom: '-96px' }}
                transition={{ type: "spring", stiffness: 45, damping: 25 }}
              />
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0">
                {FLOORS.map(floor => (
                  <div key={floor} className={`w-full h-[2px] transition-colors duration-700 ${currentFloor === floor ? 'bg-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-white/[0.02]'}`} />
                ))}
              </div>
              {isMoving && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ bottom: `${((currentFloor - 1) / 9) * 100}%`, marginBottom: '-64px' }}
                  className="absolute left-0 right-0 h-32 bg-gradient-to-t from-transparent to-blue-500/20 blur-xl pointer-events-none z-0"
                />
              )}
            </div>

            <div className="absolute right-12 inset-y-0 flex flex-col justify-between py-6 pointer-events-none z-10">
              {FLOORS.map(floor => (
                <span key={floor} className={`text-[10px] font-mono font-bold transition-colors duration-500 ${currentFloor === floor ? 'text-blue-400' : 'text-neutral-700'}`}>
                  {floor.toString().padStart(2, '0')}
                </span>
              ))}
            </div>

            <motion.div 
              className={`absolute left-1/2 w-48 h-16 rounded-xl backdrop-blur-md flex items-center justify-between px-4 z-20 transition-all duration-700 ${isMoving ? 'bg-blue-500/10 border-blue-400/50 shadow-[0_0_50px_rgba(59,130,246,0.2)]' : 'bg-[#111]/80 border-white/10 shadow-lg'} border pointer-events-none`}
              style={{ translateX: "-50%" }}
              animate={{ bottom: `${((currentFloor - 1) / 9) * 100}%`, marginBottom: currentFloor === 1 ? '24px' : currentFloor === 10 ? '-24px' : '0px' }}
              transition={{ type: "spring", stiffness: 40, damping: 25, mass: 1.5 }}
              onAnimationComplete={() => {
                if (isMoving && targetFloor) {
                  setIsMoving(false);
                  setCompletedFloors(prev => [...prev, targetFloor]);
                  setCompletedRequests(prev => prev + 1);
                  addLog(`ARRIVED: COMPLETED FLR ${targetFloor}`, 'success');
                  setTargetFloor(null);
                }
              }}
            >
              <div className="w-2 h-10 rounded-full bg-blue-500/20 border border-blue-500/50 flex flex-col justify-between p-0.5">
                 <div className="w-full h-1 bg-blue-400 rounded-full animate-pulse" />
                 <div className="w-full h-1 bg-blue-400 rounded-full animate-pulse" />
              </div>
              <div className="flex-1 flex justify-center items-center">
                 <div className={`w-16 h-10 rounded-md border ${isMoving ? 'border-blue-400/30 bg-blue-500/10' : 'border-white/5 bg-white/5'} flex items-center justify-center font-mono text-xl font-black ${isMoving ? 'text-blue-400 shadow-[inset_0_0_10px_rgba(59,130,246,0.2)]' : 'text-white'}`}>
                    {currentFloor}
                 </div>
              </div>
              <div className="w-2 h-10 rounded-full bg-blue-500/20 border border-blue-500/50 flex flex-col justify-between p-0.5">
                 <div className="w-full h-1 bg-blue-400 rounded-full animate-pulse" />
                 <div className="w-full h-1 bg-blue-400 rounded-full animate-pulse" />
              </div>
            </motion.div>

            {/* Buttons positioned attached to the left edge of the shaft */}
            <div className="absolute -left-6 top-0 bottom-0 flex flex-col justify-between py-6 z-50 pointer-events-auto">
              {FLOORS.map(floor => {
                const isCurrentTarget = floor === targetFloor;
                const isCurrentIdle = floor === currentFloor && !isMoving && !targetFloor;
                const isQueued = queue.includes(floor);
                const isDisabled = isQueued || isCurrentTarget || isCurrentIdle;

                return (
                  <button
                    key={floor}
                    onClick={() => handleFloorClick(floor)}
                    disabled={isDisabled}
                    className={`w-12 h-12 rounded-xl border flex flex-col items-center justify-center transition-all transform hover:scale-105 active:scale-95 relative group/btn pointer-events-auto ${
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

          {/* Mini status strip under shaft */}
          <div className="mt-12 flex items-center justify-center gap-8 px-6 py-3 rounded-full bg-white/[0.02] border border-white/5">
             <div className="flex items-center gap-3">
               <span className="text-[9px] font-black uppercase tracking-widest text-neutral-600">Current</span>
               <span className="text-xs font-mono font-bold text-white">{currentFloor}</span>
             </div>
             <div className="w-px h-4 bg-white/10" />
             <div className="flex items-center gap-3">
               <span className="text-[9px] font-black uppercase tracking-widest text-neutral-600">Target</span>
               <span className="text-xs font-mono font-bold text-blue-400">{targetFloor || '--'}</span>
             </div>
             <div className="w-px h-4 bg-white/10" />
             <div className="flex items-center gap-3">
               <span className="text-[9px] font-black uppercase tracking-widest text-neutral-600">Queue</span>
               <span className="text-xs font-mono font-bold text-white">{queue.length}</span>
             </div>
          </div>
        </div>
      }
      hud={undefined}
      logic={
        <div className="bg-[#080808]/80 backdrop-blur-xl border border-white/5 rounded-[32px] overflow-hidden shadow-2xl flex flex-col">
          {/* Header */}
          <div className="bg-white/[0.03] border-b border-white/5 px-6 py-4 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Dispatch Console</span>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[9px] font-mono font-bold text-blue-400 uppercase tracking-widest">Live</span>
            </div>
          </div>
          
          <div className="p-6 space-y-8 flex-1 flex flex-col justify-between">
            {/* System HUD */}
            <div className="space-y-6">
              <div className="flex flex-col gap-1 w-full p-4 rounded-xl bg-white/[0.02] border border-white/5">
                {logs.map((log, idx) => (
                  <motion.div 
                    key={log.id} 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: idx === 0 ? 1 : 0.5, x: 0 }}
                    className={`text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-2 ${
                      idx === 0 
                        ? (log.type === 'warn' ? 'text-orange-400' : log.type === 'success' ? 'text-emerald-400' : 'text-blue-400') 
                        : 'text-neutral-600'
                    }`}
                  >
                    <span className="opacity-50">{'>'}</span>{log.text}
                  </motion.div>
                ))}
              </div>
              
              <button 
                onClick={handleStep}
                disabled={queue.length === 0 || isMoving}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold uppercase tracking-widest text-[11px] transition-all ${
                  queue.length > 0 && !isMoving
                  ? "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                  : "bg-white/5 text-neutral-600 border border-white/5 cursor-not-allowed"
                }`}
              >
                Step Elevator
                <ChevronRight className="w-4 h-4" />
              </button>
              
              <div className="pt-6 border-t border-white/5">
                 <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Queue Buffer</span>
                    <span className="text-[10px] font-mono text-blue-500 font-bold">{queue.length} Pending</span>
                 </div>
                 <div className="space-y-2">
                    {queue.map((f, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                        <span className="text-xs font-bold text-white tracking-wide">Floor {f}</span>
                        <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">Job #{i+1}</span>
                      </div>
                    ))}
                    {queue.length === 0 && <div className="text-center py-6 rounded-lg bg-white/[0.01] border border-white/5 text-[9px] font-mono text-neutral-600 uppercase tracking-widest">Buffer Empty</div>}
                 </div>
              </div>
            </div>

            {/* Code Panel */}
            <div className="pt-8 border-t border-white/5 mt-auto">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-4 block">Engine Logic</span>
              <div className="font-mono text-[11px] bg-black/40 p-4 rounded-xl border border-white/5">
                {[
                  `const queue = [${queue.join(', ')}];`,
                  "",
                  "function requestElevator(floor) {",
                  "  queue.push(floor);",
                  "}",
                  "",
                  "function processNext() {",
                  "  if (queue.length === 0) return;",
                  "  const nextFloor = queue.shift();",
                  "  elevator.moveTo(nextFloor);",
                  "}"
                ].map((line, idx) => (
                  <SyntaxHighlightedLine key={idx} line={line} isActive={activeLines.includes(idx)} />
                ))}
              </div>
            </div>
          </div>
        </div>
      }
      useCases={useCases}
      takeaway="Queues are predictable because the first request added is the first one served."
      takeawaySub="In scheduling systems, FIFO (First-In, First-Out) ensures fairness by preventing new requests from 'jumping the line'. It is the simplest and most honest way to process a sequence of demands."
    />
  );
}
