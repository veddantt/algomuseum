"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Home, ChevronRight, 
  Terminal, ShieldCheck, ArrowRight
} from "lucide-react";
import { Exhibit } from "@/lib/data";
import { GlassPanel } from "./ui/GlassPanel";

interface SidebarItem {
  label: string;
  description?: string;
  isActive: boolean;
  isPast: boolean;
}

interface RealWorldSystem {
  icon: any;
  title: string;
  explanation: string;
  impact: string;
  detail?: string;
}

interface ExhibitShellProps {
  exhibit: Exhibit;
  sidebar?: SidebarItem[];
  simulation: React.ReactNode;
  hud?: React.ReactNode;
  logic?: React.ReactNode;
  useCases?: RealWorldSystem[];
  performanceInsight?: React.ReactNode;
  scaleVisualization?: React.ReactNode;
  takeaway?: string;
  takeawaySub?: string;
  successOverlay?: React.ReactNode;
  resetTrigger?: () => void;
  controls?: React.ReactNode;
}

const DustParticles = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: Math.random() * 100 + "%", y: Math.random() * 100 + "%" }}
          animate={{
            opacity: [0, 0.2, 0],
            y: ["0%", "-10%", "0%"],
            x: ["0%", "2%", "0%"]
          }}
          transition={{
            duration: 10 + Math.random() * 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5
          }}
          className="absolute w-1 h-1 bg-white rounded-full blur-[1px]"
          style={{ willChange: 'transform, opacity' }}
        />
      ))}
    </div>
  );
};

export default function ExhibitShell({
  exhibit,
  sidebar,
  simulation,
  hud,
  logic,
  useCases,
  performanceInsight,
  scaleVisualization,
  takeaway,
  takeawaySub,
  successOverlay,
  resetTrigger,
  controls
}: ExhibitShellProps) {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#020202] text-neutral-200 relative overflow-x-hidden font-sans scroll-smooth">
      {/* Shared Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,2,2,1)_80%)]" />
        <DustParticles />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/[0.04] blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/[0.03] blur-[120px] rounded-full" />
      </div>

      {/* Header / Breadcrumbs */}
      <header className="border-b border-white/5 bg-[#020202]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/museum" className="p-2 -ml-2 rounded-lg hover:bg-white/5 transition-colors text-neutral-500 hover:text-white">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="w-px h-4 bg-white/10" />
            <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
              <Link href="/" className="text-neutral-500 hover:text-white transition-colors">Archive</Link>
              <ChevronRight className="w-3 h-3 text-neutral-700" />
              <span className="text-neutral-500">{exhibit.category}</span>
              <ChevronRight className="w-3 h-3 text-neutral-700" />
              <span className="text-blue-400">{exhibit.title}</span>
            </nav>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[8px] uppercase tracking-[0.2em] text-neutral-500 font-black">Algorithm</span>
              <span className="text-[10px] font-mono text-blue-400 font-bold tracking-tight">{exhibit.algorithm}</span>
            </div>
            {controls && (
              <div className="flex items-center gap-2 pl-6 border-l border-white/10">
                {controls}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-10 relative z-10 flex flex-col gap-24">
        
        {/* Top Section: Sidebar + Simulation + HUD/Logic */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Sidebar / Timeline */}
          {sidebar && (
            <div className="hidden lg:flex lg:col-span-2 flex-col gap-8 sticky top-24">
              <div className="space-y-6">
                {sidebar.map((item, i) => (
                  <div key={i} className="group flex items-start gap-4">
                    <div className="relative flex flex-col items-center">
                      <div className={`w-5 h-5 rounded-md border transition-all duration-500 flex items-center justify-center ${
                        item.isActive ? "border-blue-500 bg-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.3)]" : 
                        item.isPast ? "border-blue-500/30 bg-blue-500/10" : "border-white/5 bg-transparent"
                      }`}>
                        {item.isPast ? (
                          <ShieldCheck className="w-3 h-3 text-blue-500" />
                        ) : (
                          <div className={`w-1 h-1 rounded-full ${item.isActive ? "bg-blue-400 animate-pulse" : "bg-neutral-800"}`} />
                        )}
                      </div>
                      {i < sidebar.length - 1 && (
                        <div className={`w-px h-8 my-1 transition-colors duration-500 ${item.isPast ? "bg-blue-500/20" : "bg-white/5"}`} />
                      )}
                    </div>
                    <div className={`transition-opacity duration-500 ${item.isActive ? "opacity-100" : "opacity-30"}`}>
                      <h3 className="text-[9px] font-black uppercase tracking-widest text-white">{item.label}</h3>
                      {item.description && (
                        <p className="text-[8px] text-neutral-500 font-medium leading-tight mt-0.5">{item.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Main Visualization Area */}
          <div className={`${sidebar ? "lg:col-span-10 xl:col-span-7" : "lg:col-span-8"} flex flex-col gap-10`}>
            {simulation}
          </div>

          {/* HUD / Logic Area */}
          <div className={`${sidebar ? "lg:col-span-12 xl:col-span-3" : "lg:col-span-4"} flex flex-col`}>
            {hud}
            {logic}
          </div>
        </section>

        {/* Real World Systems Section */}
        {useCases && (
          <section className="flex flex-col gap-12 pt-12 border-t border-white/5">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col items-center text-center gap-4">
              <h2 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-neutral-500 uppercase">Real World Systems</h2>
              <p className="text-neutral-500 max-w-xl">How {exhibit.algorithm} powers {exhibit.realWorldSystem.toLowerCase()} in production environments.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {useCases.map((useCase, i) => {
                const isExpanded = expandedCard === i;
                return (
                  <motion.div
                    key={i}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, layout: { type: "spring", stiffness: 300, damping: 30 } }}
                    onClick={() => setExpandedCard(isExpanded ? null : i)}
                    className={`cursor-pointer rounded-[24px] p-8 transition-all duration-300 group border ${
                      isExpanded
                        ? "bg-blue-500/[0.04] border-blue-500/20 shadow-[0_0_40px_rgba(59,130,246,0.06)]"
                        : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10"
                    }`}
                  >
                    <motion.div layout="position">
                      <div className="flex items-start justify-between mb-6">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                          isExpanded ? "bg-blue-500/20 border-blue-500/30 text-blue-400" : "bg-white/5 border-white/10 text-neutral-400 group-hover:text-blue-400 group-hover:bg-blue-500/10 group-hover:border-blue-500/20"
                        } border`}>
                          <useCase.icon className="w-6 h-6" />
                        </div>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isExpanded ? "bg-blue-500/20 rotate-45" : "bg-white/5 rotate-0"
                        }`}>
                          <span className="text-xs text-neutral-400 select-none">+</span>
                        </div>
                      </div>
                      <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 ${
                        isExpanded ? "text-blue-400" : "text-white group-hover:text-neutral-300"
                      }`}>{useCase.title}</h3>
                      <p className="text-sm text-neutral-400 leading-relaxed mb-4">{useCase.explanation}</p>
                    </motion.div>

                    <AnimatePresence mode="wait">
                      {isExpanded && useCase.detail && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4 pb-2 mb-4 border-t border-blue-500/10">
                            <p className="text-sm text-neutral-300 leading-relaxed font-light">
                              {useCase.detail}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.div layout="position" className="pt-4 border-t border-white/5 flex items-start gap-2">
                      <ArrowRight className={`w-3 h-3 mt-1 shrink-0 transition-colors duration-300 ${
                        isExpanded ? "text-blue-400" : "text-neutral-600 group-hover:text-blue-500"
                      }`} />
                      <p className={`text-[11px] font-bold uppercase tracking-tight transition-colors ${
                         isExpanded ? "text-blue-400" : "text-neutral-500 group-hover:text-blue-400"
                      }`}>{useCase.impact}</p>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>

            {performanceInsight}
            {scaleVisualization}

            {takeaway && (
              <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative overflow-hidden mt-8">
                <GlassPanel intensity="medium" className="p-10 md:p-14">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(59,130,246,0.08)_0%,transparent_70%)] pointer-events-none" />
                  <div className="absolute left-0 top-8 bottom-8 w-1 rounded-full bg-blue-500/40" />
                  <div className="pl-6 relative z-10">
                    <div className="flex items-center gap-2 mb-6 text-blue-400">
                      <ShieldCheck className="w-4 h-4" />
                      <span className="text-[9px] font-black uppercase tracking-[0.25em] opacity-80">Engineering Takeaway</span>
                    </div>
                    <blockquote className="text-xl md:text-2xl font-bold text-white leading-snug tracking-tight mb-5">
                      &ldquo;{takeaway}&rdquo;
                    </blockquote>
                    {takeawaySub && (
                      <p className="text-sm text-neutral-400 leading-relaxed max-w-2xl font-light">
                        {takeawaySub}
                      </p>
                    )}
                  </div>
                </GlassPanel>
              </motion.div>
            )}
          </section>
        )}
      </main>

      <AnimatePresence>
        {successOverlay}
      </AnimatePresence>
    </div>
  );
}
