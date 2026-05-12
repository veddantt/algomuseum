import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "brand";
  pulse?: boolean;
  className?: string;
}

export function Badge({ 
  children, 
  variant = "default", 
  pulse = false,
  className = "" 
}: BadgeProps) {
  const variants = {
    default: "bg-white/5 text-neutral-400 border border-white/10",
    success: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    error: "bg-red-500/10 text-red-400 border border-red-500/20",
    brand: "bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]"
  };

  const dotColors = {
    default: "bg-neutral-500",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    error: "bg-red-500",
    brand: "bg-blue-500"
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md ${variants[variant]} ${className}`}>
      {pulse && (
        <div className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]} ${pulse ? 'animate-pulse' : ''} shadow-[0_0_10px_currentColor] opacity-80`} />
      )}
      <span className="text-[9px] font-black uppercase tracking-widest leading-none mt-[1px]">
        {children}
      </span>
    </div>
  );
}
