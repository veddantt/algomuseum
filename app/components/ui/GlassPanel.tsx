import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface GlassPanelProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  intensity?: "light" | "medium" | "heavy";
  interactive?: boolean;
}

export function GlassPanel({ 
  children, 
  className = "", 
  intensity = "medium",
  interactive = false,
  ...props 
}: GlassPanelProps) {
  const intensityClasses = {
    light: "bg-white/[0.01] backdrop-blur-md border border-white/[0.02]",
    medium: "bg-black/40 backdrop-blur-xl border border-white/5",
    heavy: "bg-[#050505]/80 backdrop-blur-2xl border border-white/10"
  };

  const interactiveClasses = interactive 
    ? "transition-all duration-300 hover:bg-white/[0.04] hover:border-white/10 hover:shadow-[0_0_40px_rgba(255,255,255,0.03)]" 
    : "";

  return (
    <motion.div 
      className={`rounded-2xl overflow-hidden ${intensityClasses[intensity]} ${interactiveClasses} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
