"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, RotateCcw, ChevronDown, ChevronUp, 
  Terminal, Activity, Search, ShieldCheck, Database, Zap, 
  Globe, Layers, Library, Folder, ShoppingCart, Users, ArrowRight,
  TrendingUp, BarChart3, Scale, Dices
} from "lucide-react";
import ExhibitShell from "@/app/components/ExhibitShell";
import { exhibits } from "@/lib/data";
import { useProgression } from "@/lib/hooks/useProgression";

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
  { label: "Initialize", description: "Kernel status check" },
  { label: "Set Search Range", description: "Defining active sector" },
  { label: "Scan Middle", description: "Analyzing median entry" },
  { label: "Eliminate Half", description: "Discarding irrelevant half" },
  { label: "Located", description: "Protocol complete" }
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

const useCases = [
  {
    title: "Search Engines",
    icon: Globe,
    explanation: "Looking up keywords in a massive pre-sorted index.",
    impact: "Allows billions of pages to be searched in milliseconds.",
    detail: "Google's index is a sorted structure spanning petabytes. Binary search allows the system to locate any keyword within ~40 comparisons, regardless of how many pages exist on the internet."
  },
  {
    title: "Database Indexing",
    icon: Layers,
    explanation: "Finding records based on primary keys or sorted columns.",
    impact: "Reduces server load by avoiding full-table scans.",
    detail: "B-tree indexes in PostgreSQL and MySQL use a generalized form of binary search. Each lookup narrows the search space exponentially, turning a million-row query from seconds into microseconds."
  },
  {
    title: "Digital Libraries",
    icon: Library,
    explanation: "Locating books or documents in organized archives.",
    impact: "Enables instant retrieval in million-item collections.",
    detail: "The Library of Congress catalog, digital journal archives, and e-book platforms all rely on sorted-index lookups. Binary search is how you find one book among 40 million without reading every spine."
  },
  {
    title: "File Systems",
    icon: Folder,
    explanation: "Resolving paths and finding directory entries.",
    impact: "Critical for high-speed disk and cloud storage lookups.",
    detail: "File systems like NTFS and ext4 store directory entries in sorted structures. When you open a file, the OS performs a binary search on the directory index to resolve the path to a physical disk location."
  },
  {
    title: "E-commerce Filtering",
    icon: ShoppingCart,
    explanation: "Narrowing down product ranges by price or rating.",
    impact: "Provides smooth real-time filtering for shoppers.",
    detail: "When you filter products by price range on Amazon or eBay, the backend uses binary search on sorted price indexes to instantly find the boundaries—returning results without scanning every product."
  },
  {
    title: "Contact Lookup",
    icon: Users,
    explanation: "Finding names in address books and identity systems.",
    impact: "Ensures responsive UI even with thousands of contacts.",
    detail: "Your phone's contact list is kept sorted alphabetically. As you type a name, binary search narrows candidates with each keystroke, making autocomplete feel instant even with 10,000+ entries."
  }
];

function generateBinarySearchSteps(targetTitle: string, items: ArchiveItem[]): SearchStep[] {
  const steps: SearchStep[] = [];
  let low = 0;
  let high = items.length - 1;

  // Step 0: Initialize
  steps.push({
    low,
    high,
    mid: null,
    explanation: "System check complete. Preparing binary search protocol.",
    activeLines: [0],
    status: "searching",
    timelineIndex: 0
  });

  // Step 1: Set Initial Range
  steps.push({
    low,
    high,
    mid: null,
    explanation: `Defining initial search boundaries: index 0 to ${high}.`,
    activeLines: [1, 2],
    status: "searching",
    timelineIndex: 1
  });

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const midItem = items[mid];

    // Step 2: Scan Middle
    steps.push({
      low,
      high,
      mid,
      explanation: `Calculating median index: Math.floor((${low} + ${high}) / 2) = ${mid}.`,
      activeLines: [5],
      status: "searching",
      timelineIndex: 2
    });

    // Step: Check Equality
    steps.push({
      low,
      high,
      mid,
      explanation: `Comparing archive[${mid}] ("${midItem.title}") against target "${targetTitle}".`,
      activeLines: [7],
      status: "searching",
      timelineIndex: 2
    });

    if (midItem.title === targetTitle) {
      steps.push({
        low,
        high,
        mid,
        explanation: `Positive match found: "${midItem.title}" secured at index ${mid}.`,
        activeLines: [8],
        status: "found",
        timelineIndex: 4
      });
      return steps;
    }

    if (midItem.title > targetTitle) {
      high = mid - 1;
      // Step 3: Eliminate Half
      steps.push({
        low,
        high,
        mid,
        explanation: `"${midItem.title}" is alphabetically after target. Updating 'end' pointer to ${high}.`,
        activeLines: [11, 12],
        status: "searching",
        timelineIndex: 3
      });
    } else {
      low = mid + 1;
      // Step 3: Eliminate Half
      steps.push({
        low,
        high,
        mid,
        explanation: `"${midItem.title}" is alphabetically before target. Updating 'start' pointer to ${low}.`,
        activeLines: [11, 13, 14],
        status: "searching",
        timelineIndex: 3
      });
    }

    if (low <= high) {
      // Step 1: Set New Search Range
      steps.push({
        low,
        high,
        mid: null,
        explanation: `Restricting search range to indices ${low} through ${high}.`,
        activeLines: [4],
        status: "searching",
        timelineIndex: 1
      });
    }
  }

  steps.push({
    low,
    high,
    mid: null,
    explanation: "Archive search complete. Target entry not identified.",
    activeLines: [18],
    status: "not_found",
    timelineIndex: 4
  });

  return steps;
}

// --- Sub-components ---

const ScanningLine = ({ inRange }: { inRange: boolean }) => (
  <motion.div 
    animate={{ y: ["0%", "100%"] }}
    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
    className={`absolute left-0 right-0 h-0.5 z-20 pointer-events-none bg-gradient-to-r from-transparent via-blue-400/30 to-transparent ${!inRange && "opacity-0"}`}
  />
);

const SyntaxHighlightedLine = ({ line, isActive }: { line: string, isActive: boolean }) => {
  const tokens = line.split(/(\s+|\(|\)|\[|\]|\{|\}|===|>|=|;|,|\d+)/);
  
  const getTooltip = (token: string) => {
    if (token === "start") return "First possible location in search range";
    if (token === "end") return "Last possible location in search range";
    if (token === "mid") return "Center entry being checked";
    return null;
  };

  return (
    <div className={`group flex relative px-4 py-0.5 transition-all duration-300 ${isActive ? "bg-blue-500/15 shadow-[inset_2px_0_0_0_#3b82f6]" : "hover:bg-white/5"}`}>
      <div className="flex-1 font-mono text-[11px] whitespace-pre overflow-hidden">
        {tokens.map((token, i) => {
          let color = "text-neutral-500";
          if (["function", "let", "while", "if", "else", "return"].includes(token)) color = "text-purple-500";
          else if (["search", "floor", "Math"].includes(token)) color = "text-blue-400";
          else if (/^\d+$/.test(token)) color = "text-orange-400";
          else if (["archive", "target", "start", "end", "mid"].includes(token)) color = "text-neutral-200 font-medium";
          
          const tooltip = getTooltip(token);
          
          return (
            <span key={i} className={`${color} relative group/token`}>
              {token}
              {tooltip && (
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black border border-white/10 rounded text-[9px] text-neutral-400 opacity-0 group-hover/token:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                  {tooltip}
                </span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default function BinarySearchExhibit() {
  const exhibitData = exhibits.find(e => e.slug === "binary-search")!;
  const { markComplete } = useProgression();
  const [targetTitle, setTargetTitle] = useState("Machine Learning");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = useMemo(() => generateBinarySearchSteps(targetTitle, archiveItems), [targetTitle]);
  const step = steps[currentStepIndex];
  const isComplete = step.status === "found" || step.status === "not_found";

  useEffect(() => {
    if (isComplete && step.status === "found") {
      markComplete(exhibitData.id);
    }
  }, [isComplete, step.status, exhibitData.id, markComplete]);

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(i => i + 1);
    }
  };

  const reset = () => setCurrentStepIndex(0);

  useEffect(() => {
    reset();
  }, [targetTitle]);

  const handleRandom = () => {
    const available = archiveItems.filter(item => item.title !== targetTitle);
    const randomItem = available[Math.floor(Math.random() * available.length)];
    setTargetTitle(randomItem.title);
  };

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
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[8px] uppercase tracking-widest text-neutral-500 font-bold">Priority Scan</span>
            <select 
              value={targetTitle}
              onChange={(e) => setTargetTitle(e.target.value)}
              className="bg-transparent text-xs font-mono text-blue-400 font-bold outline-none cursor-pointer text-right appearance-none hover:text-blue-300 transition-colors"
            >
              {archiveItems.map(item => (
                <option key={item.id} value={item.title} className="bg-neutral-900 text-white">
                  {item.title}
                </option>
              ))}
            </select>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div className="flex items-center gap-1">
            <button onClick={handleRandom} title="Random Target" className="p-2 rounded-lg hover:bg-blue-500/10 text-neutral-500 hover:text-blue-400 transition-all">
              <Dices className="w-4 h-4" />
            </button>
            <button onClick={reset} title="Reset Scan" className="p-2 rounded-lg hover:bg-blue-500/10 text-neutral-500 hover:text-blue-400 transition-all">
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      }
      simulation={
        <>
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
        </>
      }
      hud={
        <div className="space-y-5">
          {[
            { label: "Entities Remaining", value: (step.high - step.low + 1), hint: "Total searchable items" },
            { label: "Sectors Eliminated", value: archiveItems.length - (step.high - step.low + 1), hint: "Space discarded" },
            { label: "Scan Count", value: currentStepIndex, hint: "Total operations" },
            { label: "Efficiency Rating", value: "Log N", hint: "Theoretical limit" }
          ].map((stat, i) => (
            <div key={i} className="group flex justify-between items-end border-b border-white/5 pb-2 relative">
              <div className="flex flex-col">
                <span className="text-[8px] font-bold uppercase text-neutral-600 group-hover:text-neutral-400 transition-colors">{stat.label}</span>
                <span className="text-[7px] text-neutral-700 opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-4">{stat.hint}</span>
              </div>
              <span className="text-sm font-mono font-bold text-white">{stat.value}</span>
            </div>
          ))}
        </div>
      }
      logic={
        <div className="bg-[#080808]/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
           <div className="bg-white/[0.03] border-b border-white/5 px-4 py-2 flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-500">System Kernel // Core Logic</span>
           </div>
           <div className="p-2 py-4">
              {[
                "function search(archive, target) {",
                "  let start = 0;",
                "  let end = archive.length - 1;",
                "",
                "  while (start <= end) {",
                "    let mid = Math.floor((start + end) / 2);",
                "",
                "    if (archive[mid] === target) {",
                "      return mid;",
                "    }",
                "",
                "    if (archive[mid] > target) {",
                "      end = mid - 1;",
                "    } else {",
                "      start = mid + 1;",
                "    }",
                "  }",
                "",
                "  return null;",
                "}"
              ].map((line, idx) => (
                <SyntaxHighlightedLine key={idx} line={line} isActive={step.activeLines.includes(idx)} />
              ))}
           </div>
           <div className="bg-white/[0.01] border-t border-white/5 p-4 flex flex-col gap-3">
              <span className="text-[9px] font-black uppercase tracking-widest text-neutral-600">Live Variables</span>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "start", value: step.low, color: "text-neutral-400" },
                  { label: "end", value: step.high, color: "text-neutral-400" },
                  { label: "mid", value: step.mid ?? "null", color: "text-blue-400" },
                  { label: "target", value: `"${targetTitle}"`, color: "text-purple-400" }
                ].map((v, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-[7px] uppercase font-bold text-neutral-700">{v.label}</span>
                    <span className={`text-[10px] font-mono font-bold ${v.color} truncate`}>{v.value}</span>
                  </div>
                ))}
              </div>
           </div>
        </div>
      }
      useCases={useCases}
      performanceInsight={
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8 md:p-12">
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
      }
      scaleVisualization={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[
             { items: "10 items", checks: "~4", label: "checks", bar: "40%", note: "Small in-memory array" },
             { items: "1,000 items", checks: "~10", label: "checks", bar: "1%", note: "Typical database table" },
             { items: "1,000,000 items", checks: "~20", label: "checks", bar: "0.002%", note: "Enterprise-scale index" }
           ].map((scale, i) => (
             <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="bg-white/[0.02] border border-white/5 rounded-3xl p-7 flex flex-col gap-4 hover:bg-white/[0.04] transition-all group">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-neutral-600">Shelf Size</span>
                    <p className="text-lg font-black text-white mt-0.5">{scale.items}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-black uppercase tracking-widest text-blue-500/70">Max Ops</span>
                    <p className="text-2xl font-black text-blue-400 mt-0.5">{scale.checks}</p>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                   <motion.div initial={{ width: 0 }} whileInView={{ width: scale.bar }} transition={{ duration: 1, delay: 0.5 + i * 0.15 }} className="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] rounded-full" />
                </div>
                <p className="text-[10px] text-neutral-600 font-medium">{scale.note}</p>
             </motion.div>
           ))}
        </div>
      }
      takeaway="Binary search is powerful because every operation removes half of the remaining possibilities."
      takeawaySub="The true mark of systems thinking is choosing the right tool for the scale of the problem. Logarithmic algorithms compound — one correct architectural choice yields exponential gains at scale."
      successOverlay={
        isComplete && step.status === "found" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center p-12 rounded-[60px] border border-blue-500/20 bg-black/80 relative">
              <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 2, opacity: 0 }} transition={{ duration: 1.5, repeat: Infinity }} className="absolute inset-0 border-2 border-blue-500 rounded-full" />
              <div className="relative">
                 <div className="mb-6 inline-flex p-4 rounded-2xl bg-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.5)]"><ShieldCheck className="w-10 h-10 text-white" /></div>
                 <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">Entry Located</h2>
                 <p className="text-blue-400 font-bold font-mono text-sm tracking-widest mb-8">ARCHIVE PATH: LB-004 SECURED</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={reset} className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold uppercase tracking-tighter hover:bg-white/10 transition-all">Re-Scan Archive</button>
                    <Link href="/museum" className="px-8 py-4 rounded-xl bg-white text-black font-black uppercase tracking-tighter hover:scale-105 transition-transform active:scale-95 flex items-center justify-center">Return to Gallery</Link>
                  </div>
              </div>
            </motion.div>
          </motion.div>
        )
      }
    />
  );
}
