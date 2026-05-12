"use client";

import { motion } from "framer-motion";
import { Zap, BarChart3, TrendingUp, Scale } from "lucide-react";

const stats = [
  { label: "10 Nodes", value: "~1ms", note: "Local neighborhood" },
  { label: "1,000 Nodes", value: "~12ms", note: "Metropolitan district" },
  { label: "1,000,000 Nodes", value: "~220ms", note: "Intercontinental grid" },
];

export function ScaleInsight() {
  return (
    <div className="mt-16 space-y-12">
      {/* Scale Visualization */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ delay: i * 0.1 }} 
            className="bg-white/[0.02] border border-white/5 rounded-3xl p-7 flex flex-col gap-4 hover:bg-white/[0.04] transition-all group"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest text-neutral-600">Network Size</span>
                <p className="text-lg font-black text-white mt-0.5">{stat.label}</p>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-black uppercase tracking-widest text-blue-500/70">Latency</span>
                <p className="text-2xl font-black text-blue-400 mt-0.5">{stat.value}</p>
              </div>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }} 
                 whileInView={{ width: i === 0 ? "10%" : i === 1 ? "40%" : "90%" }} 
                 transition={{ duration: 1, delay: 0.5 + i * 0.1 }} 
                 className="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] rounded-full" 
               />
            </div>
            <p className="text-[10px] text-neutral-600 font-medium">{stat.note}</p>
          </motion.div>
        ))}
      </div>

      {/* Engineering Takeaway */}
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative overflow-hidden">
         <div className="absolute inset-0 rounded-[32px] pointer-events-none" style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(59,130,246,0.08) 0%, transparent 70%)" }} />
         <div className="relative rounded-[32px] border border-white/[0.07] bg-white/[0.02] backdrop-blur-xl p-10 md:p-14">
           <div className="absolute left-0 top-8 bottom-8 w-[3px] rounded-full bg-blue-500/40" />
           <div className="pl-6">
             <div className="flex items-center gap-2 mb-6">
               <Scale className="w-4 h-4 text-blue-400" />
               <span className="text-[9px] font-black uppercase tracking-[0.25em] text-blue-400/70">Engineering Takeaway</span>
             </div>
             <blockquote className="text-xl md:text-2xl font-bold text-white leading-snug tracking-tight mb-5">
               &ldquo;Dijkstra is powerful because it ignores paths that are already longer than the best known route.&rdquo;
             </blockquote>
             <p className="text-sm text-neutral-500 leading-relaxed">
               Efficiency in routing is about early pruning. By maintaining a priority queue, the algorithm ensures that the first time it reaches a node, it has found the shortest possible path, eliminating billions of redundant calculations.
             </p>
           </div>
         </div>
      </motion.div>
    </div>
  );
}
