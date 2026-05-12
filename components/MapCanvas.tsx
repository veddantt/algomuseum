"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Node, Edge, DijkstraStep } from "@/lib/dijkstra";

interface MapCanvasProps {
  nodes: Node[];
  edges: Edge[];
  step: DijkstraStep;
  startNode: string;
  endNode: string;
}

// ─── helpers ────────────────────────────────────────────────────────────────

function getEdgeLength(
  source: Node,
  target: Node,
  w: number,
  h: number
): number {
  const dx = ((target.x - source.x) / 100) * w;
  const dy = ((target.y - source.y) / 100) * h;
  return Math.sqrt(dx * dx + dy * dy);
}

// ─── sub-components ──────────────────────────────────────────────────────────

interface EdgeLineProps {
  edge: Edge;
  source: Node;
  target: Node;
  isHighlighted: boolean;
  isCandidate: boolean;
  isOnFinalPath: boolean;
  isDimmed: boolean;
  finalPathIndex: number; // -1 if not on final path
  svgSize: { w: number; h: number };
}

const EdgeLine: React.FC<EdgeLineProps> = ({
  edge,
  source,
  target,
  isHighlighted,
  isCandidate,
  isOnFinalPath,
  isDimmed,
  finalPathIndex,
  svgSize,
}) => {
  const len = svgSize.w > 0 ? getEdgeLength(source, target, svgSize.w, svgSize.h) : 200;

  const x1 = `${source.x}%`;
  const y1 = `${source.y}%`;
  const x2 = `${target.x}%`;
  const y2 = `${target.y}%`;
  const mx = (source.x + target.x) / 2;
  const my = (source.y + target.y) / 2;

  // colours
  let baseStroke = isDimmed ? "rgba(255,255,255,0.025)" : "rgba(255,255,255,0.07)";
  let activeStroke = baseStroke;
  let activeWidth = 1.5;

  if (isOnFinalPath) {
    activeStroke = "rgba(74,222,128,0.9)";
    activeWidth = 3.5;
  } else if (isHighlighted) {
    activeStroke = "rgba(74,222,128,0.7)";
    activeWidth = 3;
  } else if (isCandidate) {
    activeStroke = "rgba(96,165,250,0.75)";
    activeWidth = 2.5;
  }

  return (
    <g>
      {/* Ghost base road */}
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={baseStroke}
        strokeWidth={1.5}
        strokeLinecap="round"
      />

      {/* Animated active layer */}
      {(isCandidate || isHighlighted || isOnFinalPath) && (
        <motion.line
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={activeStroke}
          strokeWidth={activeWidth}
          strokeLinecap="round"
          strokeDasharray={len}
          initial={{ strokeDashoffset: len, opacity: 0 }}
          animate={{
            strokeDashoffset: 0,
            opacity: 1,
          }}
          transition={{
            strokeDashoffset: {
              duration: isOnFinalPath ? 0.55 : 0.35,
              delay: isOnFinalPath ? finalPathIndex * 0.15 : 0,
              ease: [0.22, 1, 0.36, 1],
            },
            opacity: { duration: 0.15 },
          }}
          style={{ filter: isOnFinalPath ? "drop-shadow(0 0 4px rgba(74,222,128,0.6))" : isCandidate ? "drop-shadow(0 0 3px rgba(96,165,250,0.5))" : "none" }}
        />
      )}

      {/* Energy pulse dot along candidate edges */}
      {isCandidate && (
        <motion.circle r={3} fill="rgba(147,197,253,0.9)"
          style={{ filter: "drop-shadow(0 0 4px rgba(147,197,253,0.8))" }}
          initial={{ offsetDistance: "0%" } as any}
          animate={{ offsetDistance: "100%" } as any}
        >
          <animateMotion
            dur="1.2s"
            repeatCount="indefinite"
            path={`M ${(source.x / 100) * svgSize.w} ${(source.y / 100) * svgSize.h} L ${(target.x / 100) * svgSize.w} ${(target.y / 100) * svgSize.h}`}
          />
        </motion.circle>
      )}

      {/* Weight label */}
      <AnimatePresence>
        <motion.g
          key={`label-${edge.id}-${isCandidate}-${isOnFinalPath}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Label pill background */}
          <rect
            x={`${mx}%`}
            y={`${my}%`}
            width={22}
            height={13}
            rx={4}
            transform={`translate(-11, -13)`}
            fill={isOnFinalPath ? "rgba(20,50,30,0.9)" : isCandidate ? "rgba(15,30,60,0.9)" : "rgba(0,0,0,0.55)"}
            stroke={isOnFinalPath ? "rgba(74,222,128,0.3)" : isCandidate ? "rgba(96,165,250,0.25)" : "rgba(255,255,255,0.06)"}
            strokeWidth={0.5}
          />
          <text
            x={`${mx}%`}
            y={`${my}%`}
            fill={isOnFinalPath ? "rgba(134,239,172,1)" : isCandidate ? "rgba(147,197,253,1)" : "rgba(255,255,255,0.35)"}
            fontSize={8}
            fontFamily="ui-monospace,monospace"
            fontWeight={isCandidate || isOnFinalPath ? "700" : "500"}
            textAnchor="middle"
            dominantBaseline="middle"
            dy={-6}
          >
            {edge.weight}m
          </text>
        </motion.g>
      </AnimatePresence>
    </g>
  );
};

// ─── NodeDot ─────────────────────────────────────────────────────────────────

interface NodeDotProps {
  node: Node;
  isStart: boolean;
  isEnd: boolean;
  isCurrent: boolean;
  isVisited: boolean;
  isOnFinalPath: boolean;
  isComplete: boolean;
  distance: number;
}

const NodeDot: React.FC<NodeDotProps> = ({
  node, isStart, isEnd, isCurrent, isVisited, isOnFinalPath, isComplete, distance,
}) => {
  const hasDistance = distance !== Infinity;

  // Derive state bucket
  const state: "current" | "final-end" | "final-path" | "visited" | "start" | "end" | "idle" =
    isCurrent ? "current"
    : isComplete && isEnd ? "final-end"
    : isOnFinalPath ? "final-path"
    : isVisited ? "visited"
    : isStart ? "start"
    : isEnd ? "end"
    : "idle";

  const ringColor = {
    current:     "border-blue-400",
    "final-end": "border-green-400",
    "final-path":"border-green-500/60",
    visited:     "border-blue-500/40",
    start:       "border-blue-500/50",
    end:         "border-green-500/40",
    idle:        "border-white/10",
  }[state];

  const bgColor = {
    current:     "bg-blue-500/20",
    "final-end": "bg-green-500/25",
    "final-path":"bg-green-500/10",
    visited:     "bg-blue-500/10",
    start:       "bg-blue-900/30",
    end:         "bg-green-900/20",
    idle:        "bg-neutral-900/80",
  }[state];

  const iconColor = {
    current:     "text-blue-300",
    "final-end": "text-green-300",
    "final-path":"text-green-400/80",
    visited:     "text-blue-400/70",
    start:       "text-blue-400",
    end:         "text-green-400/60",
    idle:        "text-neutral-600",
  }[state];

  const glowStyle: React.CSSProperties = {
    current:     { filter: "drop-shadow(0 0 12px rgba(59,130,246,0.6))" },
    "final-end": { filter: "drop-shadow(0 0 20px rgba(74,222,128,0.7))" },
    "final-path":{ filter: "drop-shadow(0 0 8px rgba(74,222,128,0.4))" },
    visited:     { filter: "drop-shadow(0 0 5px rgba(59,130,246,0.25))" },
    start:       { filter: "drop-shadow(0 0 6px rgba(59,130,246,0.2))" },
    end:         { filter: "drop-shadow(0 0 6px rgba(74,222,128,0.15))" },
    idle:        {},
  }[state];

  return (
    <motion.div
      className="absolute flex flex-col items-center gap-1"
      style={{ left: `${node.x}%`, top: `${node.y}%`, translateX: "-50%", translateY: "-50%", zIndex: isCurrent ? 30 : isOnFinalPath ? 20 : 10 }}
      whileHover={{ scale: 1.15, zIndex: 40 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Outer pulse ring — current node only */}
      {isCurrent && (
        <motion.div
          className="absolute rounded-full border border-blue-400/40"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [1, 1.8, 1.8], opacity: [0.6, 0, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
          style={{ width: 36, height: 36, marginTop: -2 }}
        />
      )}

      {/* Distance update ripple */}
      <AnimatePresence>
        {hasDistance && (
          <motion.div
            key={`ripple-${node.id}-${distance}`}
            className="absolute rounded-full border border-blue-400/40"
            initial={{ scale: 0.8, opacity: 0.8 }}
            animate={{ scale: 2.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ width: 36, height: 36, marginTop: -2 }}
          />
        )}
      </AnimatePresence>

      {/* Outer beacon ring — destination when complete */}
      {isComplete && isEnd && (
        <motion.div
          className="absolute rounded-full border-2 border-green-400/50"
          initial={{ scale: 1, opacity: 0.7 }}
          animate={{ scale: [1, 1.6, 1.6], opacity: [0.5, 0, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          style={{ width: 38, height: 38, marginTop: -2 }}
        />
      )}

      {/* Distance badge */}
      <AnimatePresence mode="wait">
        {hasDistance && (
          <motion.div
            key={`dist-${node.id}-${distance}`}
            initial={{ opacity: 0, y: 3, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -3, scale: 0.85 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -top-7 whitespace-nowrap px-1.5 py-0.5 rounded-md text-[8px] font-mono font-bold"
            style={{
              background: isOnFinalPath ? "rgba(20,50,30,0.95)" : "rgba(0,0,0,0.8)",
              border: `0.5px solid ${isOnFinalPath ? "rgba(74,222,128,0.35)" : "rgba(255,255,255,0.1)"}`,
              color: isOnFinalPath ? "rgba(134,239,172,1)" : isCurrent ? "rgba(147,197,253,1)" : "rgba(255,255,255,0.65)",
              backdropFilter: "blur(8px)",
              filter: isOnFinalPath ? "drop-shadow(0 0 4px rgba(74,222,128,0.4))" : "none",
            }}
          >
            {distance}<span style={{ opacity: 0.5, marginLeft: 1 }}>m</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Node circle */}
      <motion.div
        layout
        className={`w-9 h-9 rounded-full border-2 flex items-center justify-center ${bgColor} ${ringColor}`}
        style={glowStyle}
        animate={{ scale: isCurrent ? 1.12 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <node.icon className={`w-4 h-4 ${iconColor}`} />
      </motion.div>

      {/* Label */}
      <motion.span
        className="text-[7px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-sm"
        animate={{
          color: state === "current" ? "rgba(147,197,253,1)" : state.startsWith("final") ? "rgba(134,239,172,1)" : "rgba(163,163,163,0.7)",
          backgroundColor: state === "current" ? "rgba(30,58,138,0.7)" : state.startsWith("final") ? "rgba(20,83,45,0.7)" : "rgba(0,0,0,0.5)",
        }}
        transition={{ duration: 0.3 }}
      >
        {node.label}
      </motion.span>
    </motion.div>
  );
};

// ─── Main Canvas ─────────────────────────────────────────────────────────────

export const MapCanvas: React.FC<MapCanvasProps> = ({ nodes, edges, step, startNode, endNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgSize, setSvgSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setSvgSize({ w: el.offsetWidth, h: el.offsetHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const isComplete = step.status === "found" || step.status === "not_found";
  const finalPathSet = new Set(step.highlightedEdges);

  // Build final-path node set from previous map
  const finalPathNodes = new Set<string>();
  if (isComplete && step.status === "found") {
    let curr = endNode;
    finalPathNodes.add(curr);
    while (step.previous[curr]) {
      curr = step.previous[curr]!;
      finalPathNodes.add(curr);
    }
  }

  // Active node's position for the radial ambient glow
  const activeNode = step.currentNode ? nodes.find(n => n.id === step.currentNode) : null;

  return (
    <div className="relative rounded-[32px] overflow-hidden border border-white/[0.07] bg-[#050810]">
      {/* ── Depth layers ── */}
      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.65) 100%)",
        }}
      />
      {/* Ambient glow following current node */}
      <AnimatePresence>
        {activeNode && (
          <motion.div
            key={activeNode.id}
            className="absolute pointer-events-none rounded-full"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.12, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: 200,
              height: 200,
              left: `${activeNode.x}%`,
              top: `${activeNode.y}%`,
              transform: "translate(-50%, -50%)",
              background: "radial-gradient(circle, rgba(59,130,246,1) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
        )}
      </AnimatePresence>
      {/* Final path completion glow */}
      {isComplete && step.status === "found" && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{
            background: "radial-gradient(ellipse at 75% 60%, rgba(74,222,128,0.06) 0%, transparent 60%)",
          }}
        />
      )}

      {/* ── Map area ── */}
      <div ref={containerRef} className="aspect-[4/3] relative w-full">

        {/* ── SVG roads ── */}
        <svg className="absolute inset-0 w-full h-full" style={{ overflow: "visible" }}>
          <defs>
            <filter id="glow-green">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="glow-blue">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {edges.map((edge, idx) => {
            const source = nodes.find(n => n.id === edge.source)!;
            const target = nodes.find(n => n.id === edge.target)!;
            const isHighlighted = step.highlightedEdges.includes(edge.id);
            const isCandidate = step.candidateEdges.includes(edge.id);
            const isOnFinalPath = finalPathSet.has(edge.id);

            // dim non-final edges when complete
            const isDimmed = isComplete && step.status === "found" && !isOnFinalPath;

            // index in final path for sequential animation
            const finalPathArr = Array.from(finalPathSet);
            const finalPathIndex = isOnFinalPath ? finalPathArr.indexOf(edge.id) : -1;

            return (
              <EdgeLine
                key={edge.id}
                edge={edge}
                source={source}
                target={target}
                isHighlighted={isHighlighted}
                isCandidate={isCandidate}
                isOnFinalPath={isOnFinalPath}
                isDimmed={isDimmed}
                finalPathIndex={finalPathIndex}
                svgSize={svgSize}
              />
            );
          })}
        </svg>

        {/* ── Nodes ── */}
        {nodes.map(node => {
          const isCurrent = node.id === step.currentNode;
          const isVisited = step.visited.includes(node.id);
          const isOnFinalPath = finalPathNodes.has(node.id);
          const distance = step.distances[node.id] ?? Infinity;

          return (
            <NodeDot
              key={node.id}
              node={node}
              isStart={node.id === startNode}
              isEnd={node.id === endNode}
              isCurrent={isCurrent}
              isVisited={isVisited}
              isOnFinalPath={isOnFinalPath}
              isComplete={isComplete}
              distance={distance}
            />
          );
        })}
      </div>
    </div>
  );
};
