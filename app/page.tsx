"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Library, Map, ArrowUpDown, Truck, ThumbsUp, ArrowRight } from "lucide-react";
import { exhibits } from "@/lib/data";

const iconMap: Record<string, React.ReactNode> = {
  Library: <Library className="w-6 h-6 text-neutral-400 group-hover:text-white transition-colors" />,
  Map: <Map className="w-6 h-6 text-neutral-400 group-hover:text-white transition-colors" />,
  ArrowUpDown: <ArrowUpDown className="w-6 h-6 text-neutral-400 group-hover:text-white transition-colors" />,
  Truck: <Truck className="w-6 h-6 text-neutral-400 group-hover:text-white transition-colors" />,
  ThumbsUp: <ThumbsUp className="w-6 h-6 text-neutral-400 group-hover:text-white transition-colors" />,
};

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-8 md:p-24 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16 space-y-4"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-neutral-500">
            AlgoMuseum
          </h1>
          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto font-light">
            Algorithms explained through everyday systems.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exhibits.map((exhibit, idx) => (
            <motion.div
              key={exhibit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
            >
              <Link href={`/exhibits/${exhibit.slug}`} className="group block h-full">
                <div className="h-full border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:border-white/10 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/0 to-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div>
                    <div className="mb-4 inline-flex items-center justify-center p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">
                      {iconMap[exhibit.iconName]}
                    </div>
                    <h2 className="text-xl font-medium mb-1 group-hover:text-white text-neutral-200 transition-colors">
                      {exhibit.title}
                    </h2>
                    <h3 className="text-sm text-neutral-400 font-mono mb-4">
                      {exhibit.algorithm}
                    </h3>
                    <p className="text-sm text-neutral-500 leading-relaxed mb-6">
                      {exhibit.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${exhibit.isAvailable ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-neutral-800 text-neutral-400 border border-white/5'}`}>
                      {exhibit.isAvailable ? 'Explore' : 'Coming Soon'}
                    </span>
                    <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-white transition-colors transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
