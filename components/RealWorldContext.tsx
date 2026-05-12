"use client";

import { motion } from "framer-motion";
import { Smartphone, Database, Server, Cpu, Globe, Train } from "lucide-react";

const examples = [
  {
    icon: Smartphone,
    title: "GPS Navigation",
    description: "Calculates the fastest route between your location and destination using real-time traffic data.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    icon: Server,
    title: "Network Routing",
    description: "Data packets travel across the internet by finding the shortest path between interconnected servers.",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    icon: Train,
    title: "Logistics",
    description: "Airlines and shipping companies optimize delivery routes to save time and reduce fuel consumption.",
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
];

export function RealWorldContext() {
  return (
    <section className="mt-16 space-y-12">
      <div className="flex flex-col items-center text-center gap-4">
        <h3 className="text-3xl font-black tracking-tighter text-white uppercase">Real World Routing</h3>
        <p className="text-neutral-500 max-w-xl">Dijkstra's algorithm is the silent engine beneath global infrastructure, resolving optimal paths in milliseconds.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {examples.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group"
          >
            <div className={`w-12 h-12 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <item.icon className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-3">{item.title}</h4>
            <p className="text-sm leading-relaxed text-neutral-500">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
