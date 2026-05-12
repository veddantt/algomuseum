"use client";

import { useState, useEffect } from "react";

export function useProgression() {
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("algomuseum_progress");
    if (saved) {
      try {
        setCompleted(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse progress", e);
      }
    }
  }, []);

  const markComplete = (id: string) => {
    setCompleted(prev => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      localStorage.setItem("algomuseum_progress", JSON.stringify(next));
      return next;
    });
  };

  const isComplete = (id: string) => completed.includes(id);

  return { completed, markComplete, isComplete };
}
