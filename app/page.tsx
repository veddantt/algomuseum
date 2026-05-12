"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Layers, Cpu, Globe, Compass } from "lucide-react";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center min-h-screen relative overflow-hidden bg-[#030303]">
      {/* Cinematic Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[60%] h-[60%] bg-blue-600/[0.07] blur-[160px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] right-[10%] w-[60%] h-[60%] bg-purple-600/[0.07] blur-[160px] rounded-full animate-pulse delay-700" />
        <div className="absolute inset-0 bg-grid opacity-[0.04]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(3,3,3,1)_80%)]" />
      </div>

      <div className="relative z-10 max-w-5xl w-full px-6 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md mb-8">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Exhibition Open</span>
          </div>
          
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-white uppercase italic leading-[0.8] mb-6">
            ALGO<span className="text-neutral-700 not-italic tracking-[-0.1em] px-2">MUSEUM</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-neutral-500 max-w-2xl mx-auto font-medium leading-relaxed tracking-tight">
            An architectural deep-dive into the <br/> <span className="text-white">algorithms that run our world.</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-6"
        >
          <Link 
            href="/museum" 
            className="group relative px-10 py-5 rounded-2xl bg-white text-black font-black uppercase tracking-tighter transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
          >
            <div className="flex items-center gap-3">
              Enter The Museum
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
          
          <Link 
            href="#about" 
            className="px-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-tighter transition-all hover:bg-white/10"
          >
            Platform Specs
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-white/5 pt-12"
        >
          {[
            { label: "Interactive Nodes", value: "05", icon: Layers },
            { label: "Real-time Simulation", value: "Engine 1.0", icon: Cpu },
            { label: "Global Reach", value: "Distributed", icon: Globe },
            { label: "Design System", value: "Titanium", icon: Compass }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <item.icon className="w-5 h-5 text-neutral-700" />
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-600">{item.label}</p>
              <p className="text-sm font-bold text-neutral-400">{item.value}</p>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
        <span className="text-[8px] font-black uppercase tracking-[0.5em] text-neutral-500">Scroll to Explore</span>
        <div className="w-px h-12 bg-gradient-to-b from-neutral-500 to-transparent" />
      </div>
    </main>
  );
}
