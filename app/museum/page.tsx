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
import { GlassPanel } from "../components/ui/GlassPanel";
import { Badge } from "../components/ui/Badge";

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
    <div className="min-h-screen bg-[#020202] text-neutral-200 font-sans selection:bg-blue-500/30 overflow-hidden">
      {/* Cinematic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/[0.03] blur-[140px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/[0.02] blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] opacity-30" />
      </div>

      <header className="relative z-20 border-b border-white/5 bg-[#020202]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center transition-all group-hover:bg-blue-500/10 group-hover:border-blue-500/20 group-hover:text-blue-400">
              <Sparkles className="w-4 h-4 text-neutral-400 group-hover:text-blue-400 transition-colors" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-[0.1em] text-white uppercase group-hover:text-blue-100 transition-colors">AlgoMuseum</h1>
              <p className="text-[9px] font-bold text-neutral-500 tracking-[0.3em] uppercase">Archive Systems</p>
            </div>
          </Link>

          <div className="flex items-center gap-8">
            <div className="hidden md:flex flex-col items-end gap-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500">Progress</span>
                <span className="text-[10px] font-mono font-bold text-blue-400">{completedCount}/{totalExhibits}</span>
              </div>
              <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
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
            <Badge variant="brand" pulse>Interactive Systems Museum</Badge>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-neutral-500 leading-[0.9] uppercase"
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
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-24"
        >
          {[
            { label: "Live Exhibits", value: "05 Active", desc: "Interactive simulations" },
            { label: "Core Domains", value: "04 Fields", desc: "Search, Sort, Graph, DP" },
            { label: "Learning Journey", value: "Guided", desc: "Sequential progression" },
            { label: "Completion", value: `${completedCount}/${totalExhibits} Nodes`, desc: "Archival progress" }
          ].map((stat, i) => (
             <GlassPanel key={i} intensity="light" className="p-6 border-t-2 border-t-white/10">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-2">{stat.label}</p>
                <p className="text-xl font-medium text-white tracking-tight mb-1">{stat.value}</p>
                <p className="text-xs text-neutral-600 font-mono">{stat.desc}</p>
             </GlassPanel>
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
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.1, ease: "easeOut" }}
              >
                <Link 
                  href={exhibit.isAvailable ? `/exhibits/${exhibit.slug}` : "#"}
                  className={`group block w-full outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-[32px] ${
                    isLocked ? "cursor-not-allowed opacity-60" : ""
                  }`}
                  tabIndex={isLocked ? -1 : 0}
                >
                  <GlassPanel 
                    intensity={isCompleted ? "medium" : "light"} 
                    interactive={!isLocked}
                    className={`flex flex-col md:flex-row items-stretch transition-all duration-500 ${
                      isCompleted ? "border-blue-500/20 bg-blue-500/[0.02]" : ""
                    }`}
                  >
                    
                    {/* Node Sequence / Metadata Sidebar */}
                    <div className="md:w-64 p-6 md:p-8 border-b md:border-b-0 md:border-r border-white/5 flex flex-col justify-between bg-white/[0.01]">
                      <div className="flex items-center gap-3 mb-6 md:mb-0">
                        <div className="text-[10px] font-black uppercase tracking-widest text-neutral-600 group-hover:text-neutral-400 transition-colors">NODE</div>
                        <div className="text-lg font-mono font-bold text-white">{(idx + 1).toString().padStart(2, '0')}</div>
                      </div>
                      
                      <div className="space-y-6">
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-600 mb-1 group-hover:text-neutral-500 transition-colors">Algorithm</p>
                          <p className="text-xs font-mono font-bold text-neutral-300">{exhibit.algorithm}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-600 mb-1 group-hover:text-neutral-500 transition-colors">Category</p>
                          <p className="text-xs text-neutral-400 font-medium">{exhibit.category}</p>
                        </div>
                      </div>
                    </div>

                    {/* Exhibit Identity & Content */}
                    <div className="flex-1 p-6 md:p-12 relative flex flex-col justify-center overflow-hidden">
                      <div className="absolute top-1/2 -right-20 -translate-y-1/2 w-96 h-96 bg-blue-500/5 blur-[100px] rounded-full group-hover:bg-blue-500/10 transition-colors pointer-events-none" />
                      
                      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="max-w-xl">
                          <div className="flex items-center gap-4 mb-6">
                            <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                              isCompleted 
                                ? "bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.2)]" 
                                : "bg-white/5 text-neutral-400 border border-white/10 group-hover:bg-white/10 group-hover:text-white group-hover:border-white/20"
                            }`}>
                              <Icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
                              {exhibit.title}
                            </h3>
                          </div>
                          
                          <p className="text-neutral-400 text-base leading-relaxed mb-8 font-light group-hover:text-neutral-300 transition-colors">
                            {exhibit.description}
                          </p>

                          <div className="flex items-center gap-4">
                            {isCompleted ? (
                              <Badge variant="brand"><CheckCircle2 className="w-3 h-3 inline-block mr-1" /> Verified Complete</Badge>
                            ) : isLocked ? (
                              <Badge variant="default"><Lock className="w-3 h-3 inline-block mr-1" /> Encrypted Area</Badge>
                            ) : (
                              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-black uppercase tracking-widest text-[10px] group-hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                                Enter Archive
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Visual abstract representation */}
                        <div className="hidden lg:flex items-center justify-center w-48 h-48 rounded-[32px] bg-[#020202] border border-white/5 relative overflow-hidden group-hover:border-white/10 transition-colors shadow-inner">
                            <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(255,255,255,0.02)_3px,rgba(255,255,255,0.02)_4px)]" />
                            <Icon className="w-16 h-16 text-white/5 group-hover:text-white/10 transition-colors relative z-10" />
                        </div>
                      </div>
                    </div>

                  </GlassPanel>
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
             <GlassPanel intensity="medium" className="p-8 w-full max-w-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <Layers className="w-4 h-4 text-neutral-400" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">System Architecture</span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                    <span className="text-neutral-500 font-mono">Build</span>
                    <span className="text-white font-mono">v2.0.0</span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                    <span className="text-neutral-500 font-mono">Engine</span>
                    <span className="text-white font-mono">React/Motion/API</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-500 font-mono">Status</span>
                    <span className="text-emerald-400 font-mono flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_currentColor]"/> Online</span>
                  </div>
                </div>
             </GlassPanel>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
