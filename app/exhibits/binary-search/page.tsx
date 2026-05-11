"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Play, RotateCcw, CheckCircle2, ChevronDown, ChevronUp, 
  Terminal, Activity, Search, ShieldCheck, Database, Zap, 
  Globe, Layers, Library, Folder, ShoppingCart, Users, ArrowRight,
  TrendingUp, BarChart3, Scale
} from "lucide-react";

// --- Types & Data ---

interface ArchiveItem {
  title: string;
  category: string;
  id: string;
}

interface SearchStep {
  low: number;
  high: number;
  mid: number | null;
  explanation: string;
  activeLines: number[];
  status: "searching" | "found" | "not_found";
  timelineIndex: number;
}

const timelineItems = [
  { label: "Initialize", description: "Loading archive parameters" },
  { label: "Sectioning", description: "Defining scan region" },
  { label: "Scanning", description: "Analyzing median entry" },
  { label: "Elimination", description: "Discarding irrelevant sectors" },
  { label: "Located", description: "Entry secured" }
];

const archiveItems: ArchiveItem[] = [
  { title: "AI Basics", category: "Intelligence", id: "LB-001" },
  { title: "Cloud Systems", category: "Infrastructure", id: "LB-002" },
  { title: "Data Structures", category: "Fundamentals", id: "LB-003" },
  { title: "Machine Learning", category: "Intelligence", id: "LB-004" },
  { title: "Networks", category: "Connectivity", id: "LB-005" },
  { title: "Operating Systems", category: "Systems", id: "LB-006" },
  { title: "Security Engineering", category: "Protection", id: "LB-007" },
  { title: "System Design", category: "Architecture", id: "LB-008" }
];

const targetTitle = "Machine Learning";

const steps: SearchStep[] = [
  { low: 0, high: 7, mid: null, explanation: "The archive system initiates a sweep of the entire digital shelf.", activeLines: [1, 2], status: "searching", timelineIndex: 0 },
  { low: 0, high: 7, mid: 3, explanation: "Scanning median entry to divide the archive search space.", activeLines: [4], status: "searching", timelineIndex: 2 },
  { low: 3, high: 3, mid: 3, explanation: "Positive identification: The median entry matches the target parameters.", activeLines: [5], status: "found", timelineIndex: 4 }
];

const useCases = [
  {
    title: "Search Engines",
    icon: Globe,
    explanation: "Looking up keywords in a massive pre-sorted index.",
    impact: "Allows billions of pages to be searched in milliseconds."
  },
  {
    title: "Database Indexing",
    icon: Layers,
    explanation: "Finding records based on primary keys or sorted columns.",
    impact: "Reduces server load by avoiding full-table scans."
  },
  {
    title: "Digital Libraries",
    icon: Library,
    explanation: "Locating books or documents in organized archives.",
    impact: "Enables instant retrieval in million-item collections."
  },
  {
    title: "File Systems",
    icon: Folder,
    explanation: "Resolving paths and finding directory entries.",
    impact: "Critical for high-speed disk and cloud storage lookups."
  },
  {
    title: "E-commerce Filtering",
    icon: ShoppingCart,
    explanation: "Narrowing down product ranges by price or rating.",
    impact: "Provides smooth real-time filtering for shoppers."
  },
  {
    title: "Contact Lookup",
    icon: Users,
    explanation: "Finding names in address books and identity systems.",
    impact: "Ensures responsive UI even with thousands of contacts."
  }
];

// --- Sub-components ---

const DustParticles = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: Math.random() * 100 + "%", y: Math.random() * 100 + "%" }}
          animate={{
            opacity: [0, 0.3, 0],
            y: ["0%", "-5%", "0%"],
            x: ["0%", "2%", "0%"]
          }}
          transition={{
            duration: 5 + Math.random() * 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5
          }}
          className="absolute w-1 h-1 bg-white rounded-full blur-[1px]"
        />
      ))}
    </div>
  );
};

const ScanningLine = ({ inRange }: { inRange: boolean }) => (
  <motion.div 
    animate={{ y: ["0%", "100%"] }}
    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
    className={`absolute left-0 right-0 h-0.5 z-20 pointer-events-none bg-gradient-to-r from-transparent via-blue-400/30 to-transparent ${!inRange && "opacity-0"}`}
  />
);

const SyntaxHighlightedLine = ({ line, isActive }: { line: string, isActive: boolean }) => {
  const tokens = line.split(/(\s+|\(|\)|\[|\]|\{|\}|===|>|=|;|,|\d+)/);
  return (
    <div className={`flex group relative px-4 py-0.5 transition-colors duration-300 ${isActive ? "bg-blue-500/10" : "hover:bg-white/5"}`}>
      <div className={`w-8 shrink-0 select-none text-right mr-4 font-mono text-[10px] ${isActive ? "text-blue-400" : "text-neutral-700"}`}>
      </div>
      <div className="flex-1 font-mono text-[11px] whitespace-pre overflow-hidden">
        {tokens.map((token, i) => {
          let color = "text-neutral-500";
          if (["function", "let", "while", "if", "else", "return"].includes(token)) color = "text-purple-500";
          else if (["search", "floor"].includes(token)) color = "text-blue-400";
          else if (/^\d+$/.test(token)) color = "text-orange-400";
          else if (["arr", "target", "low", "high", "mid"].includes(token)) color = "text-neutral-300";
          return <span key={i} className={color}>{token}</span>;
        })}
      </div>
    </div>
  );
};

export default function BinarySearchExhibit() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isCodeCollapsed, setIsCodeCollapsed] = useState(false);
  const step = steps[currentStepIndex];
  const isComplete = step.status === "found" || step.status === "not_found";

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(i => i + 1);
    }
  };

  const reset = () => setCurrentStepIndex(0);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#050505] text-neutral-200 relative overflow-x-hidden font-sans scroll-smooth">
      {/* Immersive FX */}
      <div className="absolute inset-0 bg-grid opacity-[0.07] pointer-events-none" />
      <div className="absolute inset-0 bg-noise pointer-events-none" />
      <DustParticles />

      {/* Header */}
      <header className="border-b border-white/5 bg-black/60 backdrop-blur-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="p-2 rounded-lg hover:bg-white/5 transition-colors text-neutral-500 hover:text-white">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-blue-500">Archive Node: 04</span>
              <span className="text-xs font-semibold text-neutral-200">Digital Library Simulation</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[8px] uppercase tracking-widest text-neutral-500 font-bold">Priority Scan</span>
              <span className="text-xs font-mono text-blue-400 font-bold">{targetTitle}</span>
            </div>
            <div className="w-px h-6 bg-white/10" />
            <button onClick={reset} className="p-2 rounded-lg hover:bg-blue-500/10 text-neutral-500 hover:text-blue-400 transition-all">
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-10 relative z-10 flex flex-col gap-24">
        
        {/* Simulation Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Timeline */}
          <div className="hidden lg:flex lg:col-span-2 flex-col gap-8 sticky top-24">
            <div className="space-y-6">
                {timelineItems.map((item, i) => {
                  const isActive = step.timelineIndex === i;
                  const isPast = step.timelineIndex > i;
                  return (
                    <div key={i} className="group flex items-start gap-4">
                      <div className="relative flex flex-col items-center">
                        <div className={`w-5 h-5 rounded-md border transition-all duration-500 flex items-center justify-center ${
                          isActive ? "border-blue-500 bg-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.3)]" : 
                          isPast ? "border-blue-500/30 bg-blue-500/10" : "border-white/5 bg-transparent"
                        }`}>
                          {isPast ? <CheckCircle2 className="w-3 h-3 text-blue-500" /> : <div className={`w-1 h-1 rounded-full ${isActive ? "bg-blue-400 animate-pulse" : "bg-neutral-800"}`} />}
                        </div>
                        {i < timelineItems.length - 1 && (
                          <div className={`w-px h-8 my-1 transition-colors duration-500 ${isPast ? "bg-blue-500/20" : "bg-white/5"}`} />
                        )}
                      </div>
                      <div className={`transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-30"}`}>
                        <h3 className="text-[9px] font-black uppercase tracking-widest text-white">{item.label}</h3>
                        <p className="text-[8px] text-neutral-500 font-medium leading-tight mt-0.5">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Visualization */}
          <div className="lg:col-span-10 xl:col-span-7 flex flex-col gap-10">
            <div className="bg-gradient-to-b from-white/[0.04] to-transparent border border-white/5 rounded-2xl p-6 relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-500">System Protocol</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.p key={currentStepIndex} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-lg text-white font-light tracking-wide leading-relaxed min-h-[3rem]">
                  {step.explanation}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="bg-white/[0.01] border border-white/5 rounded-[40px] p-8 md:p-14 relative">
              <div className="relative flex flex-col items-center">
                <div className="w-full max-w-[500px] mb-16 relative">
                  <div className="h-0.5 bg-white/[0.03] w-full rounded-full" />
                  <motion.div animate={{ left: `${(step.low / archiveItems.length) * 100}%`, width: `${((step.high - step.low + 1) / archiveItems.length) * 100}%` }} className="absolute top-0 h-0.5 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
                  <div className="flex justify-between mt-3 text-[7px] uppercase tracking-tighter text-neutral-600 font-bold">
                    <span>Sector Start</span>
                    <span>Sector End</span>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-3 relative min-h-[160px]">
                  {archiveItems.map((item, idx) => (
                    <motion.div key={idx} layout animate={{ opacity: (idx >= step.low && idx <= step.high) ? 1 : 0.15, scale: idx === step.mid ? 1.05 : 1, y: idx === step.mid ? -8 : 0 }} className={`relative w-28 h-40 rounded-xl overflow-hidden border transition-all duration-700 flex flex-col p-3 ${idx === step.mid && idx === 3 && isComplete ? "bg-green-500/20 border-green-400" : idx === step.mid ? "bg-blue-500/20 border-blue-400" : "bg-white/[0.03] border-white/5"}`}>
                      <ScanningLine inRange={idx === step.mid} />
                      <div className="flex justify-between items-start mb-4">
                        <div className={`w-1.5 h-1.5 rounded-full ${idx === step.mid ? "bg-blue-400 animate-pulse" : "bg-neutral-800"}`} />
                        <span className="text-[7px] font-mono text-neutral-600">{item.id}</span>
                      </div>
                      <div className="flex-1 flex flex-col justify-end">
                        <span className="text-[7px] uppercase tracking-widest text-blue-500 font-bold mb-1 opacity-60">{item.category}</span>
                        <h3 className="text-[10px] font-bold leading-tight text-white">{item.title}</h3>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
              <button onClick={nextStep} disabled={isComplete} className="flex-1 group h-14 rounded-xl bg-white text-black font-black uppercase tracking-tighter disabled:opacity-20 transition-all active:scale-[0.98] flex items-center justify-center gap-3">
                {isComplete ? <ShieldCheck className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                <span>{isComplete ? "Archive Secure" : "Execute Next Scan"}</span>
              </button>
              <button onClick={reset} className="p-4 rounded-xl bg-white/5 text-neutral-500 hover:text-white transition-all"><RotateCcw className="w-4 h-4" /></button>
            </div>
          </div>

          {/* HUD */}
          <div className="lg:col-span-12 xl:col-span-3 flex flex-col gap-6">
            <div className="bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
              <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-6 flex items-center gap-2"><Terminal className="w-3 h-3 text-blue-500" /> Archive HUD</h3>
              <div className="space-y-5">
                {[
                  { label: "Entities Remaining", value: (step.high - step.low + 1) },
                  { label: "Sectors Eliminated", value: archiveItems.length - (step.high - step.low + 1) },
                  { label: "Scan Count", value: currentStepIndex },
                  { label: "Efficiency Rating", value: "Log N" }
                ].map((stat, i) => (
                  <div key={i} className="flex justify-between items-end border-b border-white/5 pb-2">
                    <span className="text-[8px] font-bold uppercase text-neutral-600">{stat.label}</span>
                    <span className="text-sm font-mono font-bold text-white">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#080808] border border-white/5 rounded-2xl overflow-hidden p-2 py-4">
               {[
                 "function search(archive, target) {",
                 "  let start = 0, end = archive.len - 1;",
                 "  while (start <= end) {",
                 "    let med = floor((start + end) / 2);",
                 "    if (archive[med] === target) return med;",
                 "    if (archive[med] > target) end = med - 1;",
                 "    else start = med + 1;",
                 "  }",
                 "  return null;",
                 "}"
               ].map((line, idx) => (
                 <SyntaxHighlightedLine key={idx} line={line} isActive={step.activeLines.includes(idx)} />
               ))}
            </div>
          </div>
        </section>

        {/* --- REAL WORLD SYSTEMS SECTION --- */}
        <section className="flex flex-col gap-20 pt-12 border-t border-white/5">
          
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col items-center text-center gap-4">
            <h2 className="text-4xl font-black tracking-tighter text-white uppercase">Real World Systems</h2>
            <p className="text-neutral-500 max-w-xl">From search engines to global database indexes, binary search is the silent engine of modern infrastructure.</p>
          </motion.div>

          {/* Use Cases Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((useCase, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.04] transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <useCase.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{useCase.title}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed mb-4">{useCase.explanation}</p>
                <div className="pt-4 border-t border-white/5 flex items-start gap-2">
                   <ArrowRight className="w-3 h-3 text-blue-500 mt-1 shrink-0" />
                   <p className="text-[11px] font-bold text-blue-400/80 uppercase tracking-tight">{useCase.impact}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Performance Comparison */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="bg-white/[0.02] border border-white/5 rounded-[48px] p-10 md:p-16">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                   <h3 className="text-3xl font-bold text-white leading-tight">Why it matters: <br/><span className="text-blue-500">Logarithmic vs Linear</span></h3>
                   <div className="space-y-6">
                      <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                         <h4 className="text-xs font-black uppercase text-neutral-500 mb-4">Linear Search (Brute Force)</h4>
                         <div className="flex gap-2 text-neutral-600 font-mono text-sm">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                              <div key={n} className="flex items-center gap-1">
                                 <span className={n <= 8 ? "text-red-500/50" : ""}>{n}</span>
                                 {n < 8 && <span>→</span>}
                              </div>
                            ))}
                         </div>
                         <p className="text-[10px] text-neutral-600 mt-3 uppercase font-bold">Checks every item in sequence</p>
                      </div>
                      <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                         <h4 className="text-xs font-black uppercase text-blue-400 mb-4">Binary Search (Optimized)</h4>
                         <div className="flex gap-2 text-neutral-600 font-mono text-sm">
                            {[4, 6, 7].map((n, i) => (
                              <div key={n} className="flex items-center gap-1">
                                 <span className="text-blue-400 font-bold">{n}</span>
                                 {i < 2 && <span>→</span>}
                              </div>
                            ))}
                         </div>
                         <p className="text-[10px] text-blue-400 mt-3 uppercase font-bold">Instantly eliminates half at each step</p>
                      </div>
                   </div>
                </div>
                <div className="space-y-8">
                   <div className="p-8 rounded-3xl bg-neutral-900/50 border border-white/5 backdrop-blur-md">
                      <div className="flex items-center gap-3 mb-4">
                         <TrendingUp className="w-5 h-5 text-blue-400" />
                         <span className="text-xs font-black uppercase text-white tracking-widest">Efficiency Insight</span>
                      </div>
                      <p className="text-neutral-400 leading-relaxed mb-6">In a system with <span className="text-white font-bold">O(log n)</span> complexity, as the data grows exponentially, the work required only grows linearly. This is the foundation of high-performance software engineering.</p>
                      <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-tighter">
                         <span className="px-3 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">Scalable</span>
                         <span className="px-3 py-1 rounded bg-white/5 text-neutral-500">Predictable</span>
                      </div>
                   </div>
                </div>
             </div>
          </motion.div>

          {/* Scale Visualization */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[
               { items: "10", checks: "4", percent: "40%" },
               { items: "1,000", checks: "10", percent: "1%" },
               { items: "1,000,000", checks: "20", percent: "0.002%" }
             ].map((scale, i) => (
               <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }} className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 flex flex-col items-center text-center">
                  <span className="text-[10px] font-black uppercase text-neutral-600 mb-2">Shelf Size</span>
                  <p className="text-3xl font-black text-white mb-6">{scale.items}</p>
                  <div className="w-full h-2 bg-white/5 rounded-full mb-6 overflow-hidden">
                     <motion.div initial={{ width: 0 }} whileInView={{ width: scale.percent }} transition={{ duration: 1, delay: 0.5 }} className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                  </div>
                  <span className="text-[10px] font-black uppercase text-blue-400">Max Operations</span>
                  <p className="text-4xl font-black text-blue-400">~{scale.checks}</p>
               </motion.div>
             ))}
          </div>

          {/* Engineering Takeaway */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative">
             <div className="absolute inset-0 bg-blue-600/10 blur-[100px] rounded-full opacity-50" />
             <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 rounded-[40px] p-12 md:p-20 text-center shadow-2xl">
                <div className="max-w-3xl mx-auto space-y-8">
                   <div className="inline-flex p-4 rounded-3xl bg-white/10 backdrop-blur-md mb-4"><Scale className="w-8 h-8 text-white" /></div>
                   <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-tight">"Binary search is powerful because every operation removes half of the remaining possibilities."</h2>
                   <p className="text-blue-100 text-lg font-medium opacity-80 italic">The true mark of systems thinking is choosing the right tool for the scale of the problem.</p>
                </div>
             </div>
          </motion.div>

        </section>

      </main>

      {/* Success Celebration Overlay */}
      <AnimatePresence>
        {isComplete && steps[currentStepIndex].status === "found" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center p-12 rounded-[60px] border border-blue-500/20 bg-black/80 relative">
              <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 2, opacity: 0 }} transition={{ duration: 1.5, repeat: Infinity }} className="absolute inset-0 border-2 border-blue-500 rounded-full" />
              <div className="relative">
                 <div className="mb-6 inline-flex p-4 rounded-2xl bg-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.5)]"><ShieldCheck className="w-10 h-10 text-white" /></div>
                 <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">Entry Located</h2>
                 <p className="text-blue-400 font-bold font-mono text-sm tracking-widest mb-8">ARCHIVE PATH: LB-004 SECURED</p>
                 <button onClick={reset} className="px-10 py-4 rounded-xl bg-white text-black font-black uppercase tracking-tighter hover:scale-105 transition-transform active:scale-95">Return to Lobby</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Scroll to Top Hint */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="fixed bottom-8 right-8 z-40 hidden md:block">
         <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-full p-2 animate-bounce">
            <ChevronDown className="w-4 h-4 text-neutral-500" />
         </div>
      </motion.div>
    </div>
  );
}
