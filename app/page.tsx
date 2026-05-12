"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Layers, Cpu, Globe, Activity } from "lucide-react";
import { GlassPanel } from "./components/ui/GlassPanel";
import { Badge } from "./components/ui/Badge";

const ParticleField = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ willChange: 'transform' }}>
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-500/20 rounded-full blur-[1px]"
          style={{ willChange: "transform, opacity" }}
          initial={{
            x: Math.random() * 100 + "vw",
            y: Math.random() * 100 + "vh",
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            y: [null, Math.random() * -100 - 50],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

export default function Home() {
  const [bootPhase, setBootPhase] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    // Skip boot sequence for bots/crawlers and users who prefer reduced motion
    const isBot = /bot|googlebot|crawler|spider|robot|crawling|vercel|vercelbot|lighthouse|headless|puppeteer/i.test(navigator.userAgent);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isBot || prefersReducedMotion) {
      setBootPhase(2);
      return;
    }

    // 0 -> 1: "INITIALIZING ALGORITHM ARCHIVE..." -> "SYSTEMS ONLINE"
    const timer1 = setTimeout(() => setBootPhase(1), 400);
    // 1 -> 2: "SYSTEMS ONLINE" -> main hero
    const timer2 = setTimeout(() => setBootPhase(2), 800);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <main className="flex-1 flex flex-col items-center justify-center min-h-screen relative bg-transparent text-neutral-200 overflow-hidden">
      
      {/* Immersive Background */}
      <div className="absolute inset-0 pointer-events-none" style={{ willChange: 'transform, opacity' }}>
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-600/[0.04] blur-[140px] rounded-full animate-pulse" style={{ willChange: 'opacity' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-indigo-600/[0.03] blur-[140px] rounded-full animate-pulse delay-1000" style={{ willChange: 'opacity' }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,2,2,1)_80%)]" />
        <ParticleField />
      </div>

      <AnimatePresence>
        {bootPhase < 2 && (
          <motion.div 
            key="boot"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(10px)", scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-[#020202] pointer-events-none"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full border border-blue-500/30 border-t-blue-400 animate-spin" />
              <div className="h-6 overflow-hidden flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {bootPhase === 0 && (
                    <motion.span 
                      key="init"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-xs font-mono font-bold tracking-[0.3em] text-neutral-500 uppercase"
                    >
                      INITIALIZING ALGORITHM ARCHIVE...
                    </motion.span>
                  )}
                  {bootPhase === 1 && (
                    <motion.span 
                      key="online"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-xs font-mono font-bold tracking-[0.3em] text-blue-400 uppercase flex items-center gap-2"
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                      SYSTEMS ONLINE
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        key="hero"
        initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
        animate={{ 
          opacity: bootPhase === 2 ? 1 : 0, 
          filter: bootPhase === 2 ? "blur(0px)" : "blur(10px)",
          y: bootPhase === 2 ? 0 : 20
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-6xl px-6 flex flex-col items-center text-center"
      >
        <div className="mb-10 flex flex-col items-center">
          <Badge variant="brand" pulse className="mb-8">
            Systems Engineering Archive
          </Badge>
          
          <h1 className="text-6xl md:text-[8rem] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 uppercase leading-[0.85] mb-8">
            Algo<br className="md:hidden" /><span className="text-white/10 tracking-[-0.05em]">Museum</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-neutral-400 max-w-3xl mx-auto font-light leading-relaxed tracking-tight">
            The invisible logic powering the modern world. <br className="hidden md:block"/> 
            <span className="text-white font-medium">Dissected through production-grade simulation.</span>
          </p>
        </div>

        <div className="flex justify-center w-full mb-24">
          <Link 
            href="/museum" 
            className="group relative px-10 py-5 rounded-2xl bg-white text-black font-black uppercase tracking-tighter transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.15)] overflow-hidden pointer-events-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" style={{ willChange: 'transform' }} />
            <div className="relative flex items-center gap-3">
              Enter The Museum
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: "Interactive Algorithms", icon: Activity, desc: "Tactile learning models" },
            { label: "Backend Engine", icon: Cpu, desc: "True state-machine logic" },
            { label: "Real-World Systems", icon: Globe, desc: "Production case studies" },
            { label: "Visual Learning", icon: Layers, desc: "Cinematic data flows" }
          ].map((item, i) => (
            <GlassPanel key={i} intensity="light" interactive className="p-6 text-left flex flex-col gap-4 group pointer-events-auto">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 group-hover:text-blue-400 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-all duration-300">
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-white mb-1">{item.label}</h3>
                <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider">{item.desc}</p>
              </div>
            </GlassPanel>
          ))}
        </div>
      </motion.div>
    </main>
  );
}
