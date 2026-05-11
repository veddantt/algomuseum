"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Play, RotateCcw, CheckCircle2 } from "lucide-react";

const codeLines = [
  "function binarySearch(arr, target) {",
  "  let low = 0;",
  "  let high = arr.length - 1;",
  "  while (low <= high) {",
  "    let mid = Math.floor((low + high) / 2);",
  "    if (arr[mid] === target) return mid;",
  "    if (arr[mid] > target) high = mid - 1;",
  "    else low = mid + 1;",
  "  }",
  "  return -1;",
  "}"
];

const items = [12, 24, 31, 45, 59, 63, 78, 84, 91, 102];
const target = 78;

interface SearchStep {
  low: number;
  high: number;
  mid: number | null;
  explanation: string;
  activeLines: number[];
  status: "searching" | "found" | "not_found";
}

const steps: SearchStep[] = [
  { low: 0, high: 9, mid: null, explanation: "Initialize the 'low' and 'high' pointers to the ends of the sorted array.", activeLines: [1, 2], status: "searching" },
  { low: 0, high: 9, mid: 4, explanation: "Calculate the 'mid' index. The value at index 4 is 59.", activeLines: [4], status: "searching" },
  { low: 5, high: 9, mid: 4, explanation: "59 is less than our target (78). The target must be in the right half. Move 'low' to mid + 1.", activeLines: [7], status: "searching" },
  { low: 5, high: 9, mid: 7, explanation: "Calculate the new 'mid' index. The value at index 7 is 84.", activeLines: [4], status: "searching" },
  { low: 5, high: 6, mid: 7, explanation: "84 is greater than our target (78). The target must be in the left half. Move 'high' to mid - 1.", activeLines: [6], status: "searching" },
  { low: 5, high: 6, mid: 5, explanation: "Calculate the new 'mid' index. The value at index 5 is 63.", activeLines: [4], status: "searching" },
  { low: 6, high: 6, mid: 5, explanation: "63 is less than our target (78). Move 'low' to mid + 1.", activeLines: [7], status: "searching" },
  { low: 6, high: 6, mid: 6, explanation: "Calculate the new 'mid' index. The value at index 6 is 78.", activeLines: [4], status: "searching" },
  { low: 6, high: 6, mid: 6, explanation: "Target found! 78 equals our target. The search successfully completes.", activeLines: [5], status: "found" }
];

export default function BinarySearchExhibit() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const step = steps[currentStepIndex];
  const isComplete = step.status === "found" || step.status === "not_found";

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(i => i + 1);
    }
  };

  const reset = () => {
    setCurrentStepIndex(0);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-neutral-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-sm font-semibold text-white">Smart Search Shelf</h1>
              <p className="text-xs text-neutral-500 font-mono">Binary Search Algorithm</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500 hidden sm:inline-block">Target:</span>
            <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 font-mono text-sm font-bold">{target}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Visualization & Controls */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          
          {/* Explanation Panel */}
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 relative overflow-hidden min-h-[140px] flex flex-col justify-center">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
            <h2 className="text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-2">Current Operation</h2>
            <AnimatePresence mode="wait">
              <motion.p
                key={currentStepIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-lg text-neutral-200"
              >
                {step.explanation}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Shelf Visualization */}
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 overflow-x-auto">
            <div className="min-w-[600px] py-8">
              <div className="flex items-end justify-center gap-2 relative">
                {items.map((val, idx) => {
                  const isLow = idx === step.low;
                  const isHigh = idx === step.high;
                  const isMid = idx === step.mid;
                  const inRange = idx >= step.low && idx <= step.high;
                  const isFound = isComplete && isMid;

                  return (
                    <div key={idx} className="flex flex-col items-center relative">
                      {/* Pointers Top */}
                      <div className="h-8 mb-2 flex flex-col justify-end items-center">
                        {isMid && (
                          <motion.div layoutId="mid-pointer" className="text-blue-400 text-xs font-mono font-bold flex flex-col items-center">
                            <span>mid</span>
                            <span className="text-[10px]">▼</span>
                          </motion.div>
                        )}
                      </div>

                      {/* Card */}
                      <motion.div
                        layout
                        className={\`w-14 h-20 rounded-xl flex items-center justify-center font-mono text-lg font-bold border-2 transition-colors duration-300 \${
                          isFound
                            ? "bg-green-500/20 border-green-500 text-green-400"
                            : isMid
                            ? "bg-blue-500/20 border-blue-500 text-blue-100"
                            : inRange
                            ? "bg-white/10 border-white/20 text-white"
                            : "bg-white/5 border-transparent text-neutral-600 opacity-50"
                        }\`}
                      >
                        {val}
                      </motion.div>

                      {/* Pointers Bottom */}
                      <div className="h-10 mt-2 flex justify-center w-full relative">
                        {isLow && (
                          <motion.div layoutId="low-pointer" className="absolute text-purple-400 text-xs font-mono font-bold flex flex-col items-center" style={{ left: isLow && isHigh ? '-1rem' : 'auto' }}>
                            <span className="text-[10px]">▲</span>
                            <span>low</span>
                          </motion.div>
                        )}
                        {isHigh && (
                          <motion.div layoutId="high-pointer" className="absolute text-orange-400 text-xs font-mono font-bold flex flex-col items-center" style={{ right: isLow && isHigh ? '-1rem' : 'auto' }}>
                            <span className="text-[10px]">▲</span>
                            <span>high</span>
                          </motion.div>
                        )}
                      </div>
                      
                      <div className="text-[10px] text-neutral-600 font-mono mt-1 absolute -bottom-6">
                        idx:{idx}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={nextStep}
              disabled={isComplete}
              className="flex-1 bg-white text-black hover:bg-neutral-200 disabled:bg-white/10 disabled:text-white/30 disabled:cursor-not-allowed transition-all py-3 px-6 rounded-xl font-medium flex items-center justify-center gap-2"
            >
              {isComplete ? (
                <>
                  <CheckCircle2 className="w-5 h-5" /> Search Complete
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" /> Next Step
                </>
              )}
            </button>
            <button
              onClick={reset}
              className="px-6 py-3 rounded-xl bg-white/5 text-white hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-2 font-medium"
            >
              <RotateCcw className="w-5 h-5" /> Reset
            </button>
          </div>

        </div>

        {/* Right Column: Code Panel */}
        <div className="lg:col-span-5 h-full">
          <div className="bg-[#0D0D0D] border border-white/10 rounded-2xl overflow-hidden sticky top-24 shadow-2xl">
            <div className="bg-white/5 border-b border-white/10 px-4 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-2 text-xs font-mono text-neutral-400">binarySearch.js</span>
            </div>
            <div className="p-4 overflow-x-auto text-sm font-mono leading-relaxed">
              {codeLines.map((line, idx) => {
                const isActive = step.activeLines.includes(idx);
                return (
                  <div
                    key={idx}
                    className={\`flex px-2 rounded transition-colors duration-300 \${
                      isActive ? "bg-blue-500/20 text-blue-200" : "text-neutral-400 hover:bg-white/5"
                    }\`}
                  >
                    <span className={\`w-6 shrink-0 select-none text-right mr-4 \${isActive ? "text-blue-400/50" : "text-neutral-600"}\`}>
                      {idx + 1}
                    </span>
                    <span className="whitespace-pre">{line}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
