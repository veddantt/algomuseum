"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Library, Map, ArrowUpDown, Truck, ThumbsUp, 
  ArrowRight, CheckCircle2, Lock,
  Layers, Compass, Sparkles, Trophy
} from "lucide-react";
import { exhibits } from "@/lib/data";
import { useProgression } from "@/lib/hooks/useProgression";

const iconMap: Record<string, any> = {
  Library,
  Map,
  ArrowUpDown,
  Truck,
  ThumbsUp,
};

export default function MuseumDirectory() {
  const { completed } = useProgression();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalExhibits = exhibits.length;
  const completedCount = completed.length;
  const progressPercent = (completedCount / totalExhibits) * 100;

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#030303] text-neutral-200 selection:bg-blue-500/30 font-sans">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/[0.03] blur-[140px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/[0.02] blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-grid opacity-[0.02]" />
      </div>

      <header className="relative z-20 border-b border-white/5 bg-[#030303]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-8 h-8 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-[0.1em] text-white uppercase">AlgoMuseum</h1>
              <p className="text-[9px] font-bold text-neutral-500 tracking-[0.3em] uppercase">Archive Systems</p>
            </div>
          </Link>

          <div className="flex items-center gap-8">
            <div className="hidden md:flex flex-col items-end gap-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500">Progress</span>
                <span className="text-[10px] font-mono font-bold text-blue-400">{completedCount}/{totalExhibits}</span>
              </div>
              <div className="w-32 h-0.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  className="h-full bg-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-32">
        {/* HERO SECTION */}
        <div className="flex flex-col gap-6 mb-20 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500">Interactive Systems Museum</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-[0.9] uppercase"
          >
            Engineering <br/> <span className="text-neutral-600 italic font-medium">Infrastructure</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-neutral-400 text-base md:text-lg leading-relaxed font-light mt-4"
          >
            Explore the invisible logic powering the modern world. This archive dissects real-world algorithms—from city routing to data processing—through interactive, high-fidelity simulations.
          </motion.p>
        </div>

        {/* MUSEUM METADATA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col md:flex-row gap-8 mb-24 border-y border-white/5 py-8"
        >
          {[
            { label: "Live Exhibits", value: "05 Active", desc: "Interactive simulations" },
            { label: "Core Domains", value: "04 Fields", desc: "Search, Sort, Graph, DP" },
            { label: "Learning Journey", value: "Guided", desc: "Sequential progression" },
            { label: "Completion", value: `${completedCount}/${totalExhibits} Nodes`, desc: "Archival progress" }
          ].map((stat, i) => (
             <div key={i} className="flex-1 md:border-l border-white/5 md:pl-8 first:border-0 first:pl-0">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-600 mb-2">{stat.label}</p>
                <p className="text-xl font-medium text-white tracking-tight mb-1">{stat.value}</p>
                <p className="text-xs text-neutral-500 font-mono">{stat.desc}</p>
             </div>
          ))}
        </motion.div>

        {/* EXHIBIT SEQUENCE */}
        <div className="space-y-6">
          {exhibits.map((exhibit, idx) => {
            const isCompleted = completed.includes(exhibit.id);
            const Icon = iconMap[exhibit.iconName] || Library;
            const isLocked = !exhibit.isAvailable;

            return (
              <motion.div
                key={exhibit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.1 }}
              >
                <Link 
                  href={exhibit.isAvailable ? `/exhibits/${exhibit.slug}` : "#"}
                  className={`group block w-full rounded-[32px] overflow-hidden transition-all duration-500 ${
                    isLocked ? "cursor-not-allowed opacity-60" : "hover:scale-[1.01]"
                  }`}
                >
                  <div className={`flex flex-col md:flex-row items-stretch border transition-all duration-500 ${
                    isCompleted 
                      ? "bg-blue-500/[0.02] border-blue-500/20" 
                      : "bg-[#050505] border-white/5 group-hover:border-white/10"
                  }`}>
                    
                    {/* Node Sequence / Metadata Sidebar */}
                    <div className="md:w-64 p-8 border-b md:border-b-0 md:border-r border-white/5 flex flex-col justify-between bg-white/[0.01]">
                      <div className="flex items-center gap-3 mb-8 md:mb-0">
                        <div className="text-[10px] font-black uppercase tracking-widest text-neutral-600">NODE</div>
                        <div className="text-lg font-mono font-bold text-white">{(idx + 1).toString().padStart(2, '0')}</div>
                      </div>
                      
                      <div className="space-y-6">
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-600 mb-1">Algorithm</p>
                          <p className="text-xs font-mono font-bold text-neutral-300">{exhibit.algorithm}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-600 mb-1">Category</p>
                          <p className="text-xs text-neutral-400 font-medium">{exhibit.category}</p>
                        </div>
                      </div>
                    </div>

                    {/* Exhibit Identity & Content */}
                    <div className="flex-1 p-8 md:p-12 relative flex flex-col justify-center">
                      <div className="absolute top-0 right-0 p-32 bg-blue-500/5 blur-[120px] rounded-full group-hover:bg-blue-500/10 transition-colors pointer-events-none" />
                      
                      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="max-w-xl">
                          <div className="flex items-center gap-4 mb-6">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                              isCompleted ? "bg-blue-500 text-white" : "bg-white/5 text-neutral-400 group-hover:bg-white/10 group-hover:text-white"
                            }`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
                              {exhibit.title}
                            </h3>
                          </div>
                          
                          <p className="text-neutral-400 text-base leading-relaxed mb-8 font-light">
                            {exhibit.description}
                          </p>

                          <div className="flex items-center gap-4">
                            {isCompleted ? (
                              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                                <CheckCircle2 className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Verified Complete</span>
                              </div>
                            ) : isLocked ? (
                              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#080808] border border-white/5 text-neutral-500">
                                <Lock className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Encrypted Area</span>
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white group-hover:bg-white/10 transition-colors">
                                <span className="text-[10px] font-black uppercase tracking-widest">Enter Archive</span>
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Visual abstract representation */}
                        <div className="hidden lg:flex items-center justify-center w-40 h-40 rounded-[24px] bg-[#030303] border border-white/5 relative overflow-hidden group-hover:border-white/10 transition-colors shadow-inner">
                            <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(255,255,255,0.02)_3px,rgba(255,255,255,0.02)_4px)]" />
                            <Icon className="w-12 h-12 text-white/5 group-hover:text-white/10 transition-colors relative z-10" />
                        </div>
                      </div>
                    </div>

                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* NARRATIVE FOOTER */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-32 pt-16 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-12"
        >
          <div>
            <h3 className="text-[10px] font-black tracking-[0.3em] text-neutral-500 uppercase mb-6">Infrastructure Narrative</h3>
            <p className="text-2xl md:text-3xl font-light text-white leading-snug tracking-tight mb-6">
              Algorithms are not abstract mathematics—they are the physical infrastructure of the modern world.
            </p>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-md font-light">
              From the invisible routing protocols directing global internet traffic to the heuristic engines predicting consumer behavior, every system we interact with is governed by specific logical models. This museum makes the invisible visible.
            </p>
          </div>
          <div className="flex flex-col justify-end md:items-end">
             <div className="p-8 rounded-[24px] bg-[#050505] border border-white/5 w-full max-w-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <Layers className="w-4 h-4 text-neutral-400" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">System Architecture</span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-500 font-mono">Build</span>
                    <span className="text-white font-mono">v1.2.0</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-500 font-mono">Engine</span>
                    <span className="text-white font-mono">React/Motion</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-500 font-mono">Status</span>
                    <span className="text-emerald-400 font-mono flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/> Active</span>
                  </div>
                </div>
             </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
