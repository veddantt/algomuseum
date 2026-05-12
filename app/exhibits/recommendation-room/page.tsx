"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, RotateCcw, Target, 
  Zap, Search, 
  Play, ShoppingBag, Briefcase, Rss,
  User, ChevronRight, Check, X
} from "lucide-react";
import ExhibitShell from "@/app/components/ExhibitShell";
import { exhibits } from "@/lib/data";
import { useProgression } from "@/lib/hooks/useProgression";

// --- Types ---

interface Item {
  id: string;
  title: string;
  tags: string[];
  type: string;
}

interface ScoredItem extends Item {
  score: number;
  matches: string[];
}

type Phase = "profile" | "matching" | "scoring" | "ranking" | "result";

// --- Data ---

const ALL_TAGS = [
  "AI", "Systems", "Design", "Productivity", "Architecture", 
  "Databases", "Backend", "Workflow", "IoT", "Fitness", 
  "Lifestyle", "Travel", "Photography", "Health", "Career"
];

const CANDIDATES: Item[] = [
  { id: "1", title: "System Design Handbook", tags: ["Systems", "Architecture", "Design"], type: "Book" },
  { id: "2", title: "AI Interview Coach", tags: ["AI", "Career", "Systems"], type: "Software" },
  { id: "3", title: "Travel Vlog: Tokyo", tags: ["Lifestyle", "Travel", "Photography"], type: "Video" },
  { id: "4", title: "Database Internals", tags: ["Systems", "Databases", "Backend"], type: "Course" },
  { id: "5", title: "Smart Fitness Tracker", tags: ["Health", "Fitness", "IoT"], type: "Hardware" },
  { id: "6", title: "Productivity Dashboard", tags: ["Productivity", "Design", "Workflow"], type: "Software" }
];

const USE_CASES = [
  { icon: Play, title: "Netflix Recommendations", explanation: "Matching movies to your watch history and genre preferences.", impact: "Responsible for 80% of content discovery.", detail: "Netflix uses complex collaborative filtering and content-based scoring to predict what you'll enjoy next based on thousands of behavioral dimensions." },
  { icon: Target, title: "Spotify Playlists", explanation: "Generating Discover Weekly based on acoustic traits and user taste.", impact: "Drives billions of stream hours monthly.", detail: "Spotify analyzes acoustic attributes like danceability, energy, and key, then compares your listening 'taste profile' against their entire catalog." },
  { icon: ShoppingBag, title: "E-commerce Suggestions", explanation: "Predicting what you'll buy based on viewing patterns and tags.", impact: "Increases conversion rates by over 35%.", detail: "Amazon and Shopify use similarity scoring to find products that are frequently bought together or share high tag overlap with your cart." },
  { icon: Briefcase, title: "Job Matching", explanation: "Connecting candidates to roles based on skill and experience tags.", impact: "Standardizes high-volume recruitment.", detail: "Platforms like LinkedIn use weighted scoring to rank candidates for recruiters, prioritizing direct skill matches and industry overlap." },
  { icon: Rss, title: "Social Media Feeds", explanation: "Ranking posts in your feed based on engagement similarity.", impact: "Maximizes platform retention.", detail: "Algorithms on TikTok and Instagram rank content by calculating the similarity between a video's metadata and the user's historical engagement patterns." },
  { icon: Search, title: "Search Result Ranking", explanation: "Ordering search results by relevance to your query context.", impact: "Core of the modern internet experience.", detail: "Search engines score document relevance by matching query keywords against page metadata, site authority, and semantic similarity." }
];

// --- Syntax Highlighter ---

const SyntaxHighlightedLine = ({ line, isActive }: { line: string, isActive: boolean }) => {
  const tokens = line.split(/(\s+|\(|\)|\[|\]|\{|\}|===|=>|=|;|,|\d+)/);
  return (
    <div className={`group flex relative px-4 py-0.5 transition-all duration-300 ${isActive ? "bg-blue-500/15 shadow-[inset_2px_0_0_0_#3b82f6]" : "hover:bg-white/5"}`}>
      <div className="flex-1 font-mono text-[11px] whitespace-pre overflow-hidden">
        {tokens.map((token, i) => {
          let color = "text-neutral-500";
          if (["function", "const", "let", "return", "if", "for"].includes(token)) color = "text-purple-500";
          else if (["filter", "includes", "map", "sort", "length"].includes(token)) color = "text-blue-400";
          else if (/^\d+$/.test(token)) color = "text-orange-400";
          else if (["score", "userTags", "itemTags", "matches", "tag"].includes(token)) color = "text-neutral-200 font-medium";
          return <span key={i} className={color}>{token}</span>;
        })}
      </div>
    </div>
  );
};

// --- Main Component ---

export default function RecommendationRoomExhibit() {
  const exhibitData = exhibits.find(e => e.slug === "recommendation-room")!;
  const { markComplete } = useProgression();
  
  const [selectedInterests, setSelectedInterests] = useState<string[]>(["AI", "Systems", "Design", "Productivity"]);
  const [scoredItems, setScoredItems] = useState<ScoredItem[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeLines, setActiveLines] = useState<number[]>([]);
  const [phase, setPhase] = useState<Phase>("profile");
  const [currentEvalIndex, setCurrentEvalIndex] = useState(-1);
  const [completedCount, setCompletedCount] = useState(0);
  const [liveMatchCount, setLiveMatchCount] = useState(0);
  const [liveScore, setLiveScore] = useState("");

  useEffect(() => {
    if (completedCount >= 3) markComplete(exhibitData.id);
  }, [completedCount, exhibitData.id, markComplete]);

  const toggleInterest = (tag: string) => {
    if (isCalculating) return;
    setSelectedInterests(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
    setScoredItems([]);
    setActiveLines([]);
    setPhase("profile");
    setCurrentEvalIndex(-1);
  };

  const calculateRecommendations = useCallback(async () => {
    if (selectedInterests.length === 0 || isCalculating) return;
    
    setIsCalculating(true);
    setScoredItems([]);
    setCurrentEvalIndex(-1);
    setLiveMatchCount(0);
    setLiveScore("");

    // Phase: Matching
    setPhase("matching");
    setActiveLines([0]);
    await new Promise(r => setTimeout(r, 800));

    const results: ScoredItem[] = [];
    
    for (let i = 0; i < CANDIDATES.length; i++) {
      const item = CANDIDATES[i];
      setCurrentEvalIndex(i);
      
      // Phase: Scoring — highlight filter line
      setPhase("scoring");
      setActiveLines([1]);
      await new Promise(r => setTimeout(r, 500));
      
      const matches = item.tags.filter(tag => selectedInterests.includes(tag));
      const score = matches.length / item.tags.length;
      setLiveMatchCount(matches.length);
      setLiveScore(`${matches.length}/${item.tags.length}`);
      
      // Highlight return line
      setActiveLines([2]);
      results.push({ ...item, score, matches });
      setScoredItems([...results]);
      await new Promise(r => setTimeout(r, 500));
    }

    // Phase: Ranking
    setPhase("ranking");
    setActiveLines([]);
    setCurrentEvalIndex(-1);
    await new Promise(r => setTimeout(r, 600));

    // Phase: Result
    setPhase("result");
    setIsCalculating(false);
    setCompletedCount(prev => prev + 1);
  }, [selectedInterests, isCalculating]);

  const handleReset = () => {
    setSelectedInterests(["AI", "Systems", "Design", "Productivity"]);
    setScoredItems([]);
    setIsCalculating(false);
    setActiveLines([]);
    setPhase("profile");
    setCurrentEvalIndex(-1);
    setLiveMatchCount(0);
    setLiveScore("");
  };

  const handleRandomize = () => {
    if (isCalculating) return;
    const shuffled = [...ALL_TAGS].sort(() => 0.5 - Math.random());
    setSelectedInterests(shuffled.slice(0, 3 + Math.floor(Math.random() * 3)));
    setScoredItems([]);
    setActiveLines([]);
    setPhase("profile");
    setCurrentEvalIndex(-1);
  };

  const rankedItems = useMemo(() => {
    if (scoredItems.length === 0) return [];
    return [...scoredItems].sort((a, b) => b.score - a.score);
  }, [scoredItems]);

  const topMatch = rankedItems[0] || null;

  return (
    <ExhibitShell
      exhibit={exhibitData}
      sidebar={[
        { label: "Profile", description: "Select interests", isActive: phase === "profile", isPast: phase !== "profile" },
        { label: "Matching", description: "Comparing tags", isActive: phase === "matching", isPast: ["scoring", "ranking", "result"].includes(phase) },
        { label: "Scoring", description: "Computing weights", isActive: phase === "scoring", isPast: ["ranking", "result"].includes(phase) },
        { label: "Ranking", description: "Ordering results", isActive: phase === "ranking", isPast: phase === "result" },
        { label: "Top Pick", description: "Recommendation", isActive: phase === "result", isPast: false }
      ]}
      controls={
        <div className="flex items-center gap-4">
          <button 
            onClick={handleRandomize} 
            disabled={isCalculating}
            className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-white/5 hover:bg-white/10 text-neutral-300 transition-colors disabled:opacity-50"
          >
            Random Profile
          </button>
          <div className="w-px h-6 bg-white/10" />
          <button 
            onClick={handleReset} 
            disabled={isCalculating}
            className="p-2 rounded-lg hover:bg-white/5 text-neutral-500 hover:text-blue-400 transition-colors disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      }
      simulation={
        <div className="bg-[#050505] backdrop-blur-2xl border border-white/5 rounded-[32px] p-8 flex-1 relative flex flex-col shadow-2xl min-h-[700px] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.04),transparent_70%)]" />
          
          <div className="relative z-10 w-full flex-1 flex flex-col">
            
            {/* Interest Tags Bar */}
            <div className="mb-8">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-4 block">Interest Profile</span>
              <div className="flex flex-wrap gap-2">
                {ALL_TAGS.map(tag => {
                  const isSelected = selectedInterests.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleInterest(tag)}
                      disabled={isCalculating}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all duration-300 ${
                        isSelected
                          ? "bg-blue-500/10 border-blue-500/40 text-blue-400"
                          : "bg-white/[0.02] border-white/5 text-neutral-600 hover:text-neutral-300 hover:border-white/10"
                      } ${isCalculating ? "cursor-default" : "cursor-pointer"}`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Candidate Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
              {CANDIDATES.map((item, idx) => {
                const scored = scoredItems.find(s => s.id === item.id);
                const isBeingEvaluated = currentEvalIndex === idx && isCalculating;
                const isTopResult = phase === "result" && rankedItems[0]?.id === item.id;
                const rank = rankedItems.findIndex(r => r.id === item.id);

                return (
                  <motion.div
                    key={item.id}
                    layout
                    className={`relative rounded-2xl p-5 border transition-all duration-500 flex flex-col justify-between ${
                      isTopResult
                        ? "bg-blue-500/[0.06] border-blue-500/30 shadow-[0_0_40px_rgba(59,130,246,0.1)]"
                        : isBeingEvaluated
                        ? "bg-blue-500/[0.03] border-blue-500/20"
                        : scored
                        ? "bg-[#0a0a0a] border-white/5"
                        : "bg-white/[0.015] border-white/5"
                    }`}
                  >
                    {/* Top match badge */}
                    {isTopResult && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute -top-2 -right-2 bg-blue-500 text-white text-[7px] font-black uppercase px-2.5 py-1 rounded-full tracking-[0.15em] z-20 shadow-lg"
                      >
                        #1 Pick
                      </motion.div>
                    )}

                    {/* Rank badge */}
                    {scored && phase === "result" && rank >= 0 && !isTopResult && (
                      <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#111] border border-white/10 flex items-center justify-center z-20">
                        <span className="text-[9px] font-mono font-black text-neutral-400">#{rank + 1}</span>
                      </div>
                    )}

                    {/* Scanning pulse */}
                    {isBeingEvaluated && (
                      <motion.div
                        className="absolute inset-0 rounded-2xl border-2 border-blue-500/30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[8px] font-mono text-neutral-600 uppercase tracking-[0.15em]">{item.type}</span>
                        {scored ? (
                          <motion.span 
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-lg font-mono font-black text-white"
                          >
                            {Math.round(scored.score * 100)}
                            <span className="text-[10px] text-neutral-500">%</span>
                          </motion.span>
                        ) : (
                          <span className="text-lg font-mono font-black text-neutral-800">—</span>
                        )}
                      </div>

                      <h5 className={`text-base font-bold mb-4 leading-tight transition-colors duration-500 ${
                        isTopResult ? "text-blue-400" : scored ? "text-white" : "text-neutral-500"
                      }`}>{item.title}</h5>
                    </div>

                    {/* Score bar + tags */}
                    <div>
                      {/* Score bar */}
                      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-3">
                        {scored && (
                          <motion.div
                            className={`h-full rounded-full ${isTopResult ? "bg-blue-400" : "bg-blue-500/60"}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${scored.score * 100}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                          />
                        )}
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {item.tags.map(tag => {
                          const isMatch = scored?.matches.includes(tag);
                          return (
                            <span 
                              key={tag} 
                              className={`text-[8px] px-1.5 py-0.5 rounded-md uppercase font-bold tracking-wider transition-all duration-500 ${
                                isMatch
                                  ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                                  : scored
                                  ? "bg-white/[0.02] text-neutral-700 border border-transparent"
                                  : "bg-white/[0.02] text-neutral-700 border border-transparent"
                              }`}
                            >
                              {tag}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Status strip */}
            <div className="mt-8 flex items-center justify-center gap-8 px-6 py-3 rounded-full bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-black uppercase tracking-widest text-neutral-600">Interests</span>
                <span className="text-xs font-mono font-bold text-white">{selectedInterests.length}</span>
              </div>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-black uppercase tracking-widest text-neutral-600">Scored</span>
                <span className="text-xs font-mono font-bold text-blue-400">{scoredItems.length}/{CANDIDATES.length}</span>
              </div>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-black uppercase tracking-widest text-neutral-600">Top</span>
                <span className="text-xs font-mono font-bold text-white">{topMatch ? `${Math.round(topMatch.score * 100)}%` : "—"}</span>
              </div>
            </div>

          </div>
        </div>
      }
      hud={undefined}
      logic={
        <div className="bg-[#080808]/80 backdrop-blur-xl border border-white/5 rounded-[32px] overflow-hidden shadow-2xl flex flex-col">
          {/* Header */}
          <div className="bg-white/[0.03] border-b border-white/5 px-6 py-4 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Scoring Console</span>
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full transition-colors ${isCalculating ? 'bg-blue-500 animate-pulse' : phase === "result" ? 'bg-emerald-500' : 'bg-neutral-700'}`} />
              <span className={`text-[9px] font-mono font-bold uppercase tracking-widest transition-colors ${
                isCalculating ? 'text-blue-400' : phase === "result" ? 'text-emerald-400' : 'text-neutral-600'
              }`}>
                {isCalculating ? 'Processing' : phase === "result" ? 'Complete' : 'Standby'}
              </span>
            </div>
          </div>
          
          <div className="p-6 space-y-6 flex-1 flex flex-col">
            {/* Live Evaluation */}
            <AnimatePresence mode="wait">
              {isCalculating && currentEvalIndex >= 0 && (
                <motion.div
                  key={currentEvalIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10"
                >
                  <span className="text-[8px] font-black uppercase tracking-widest text-blue-400 mb-2 block">Evaluating</span>
                  <h4 className="text-sm font-bold text-white mb-2">{CANDIDATES[currentEvalIndex]?.title}</h4>
                  <div className="flex items-center gap-4 text-[10px] font-mono">
                    <span className="text-neutral-500">Matches: <span className="text-blue-400 font-bold">{liveMatchCount}</span></span>
                    <span className="text-neutral-500">Score: <span className="text-white font-bold">{liveScore}</span></span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Run Button */}
            <button 
              onClick={calculateRecommendations}
              disabled={selectedInterests.length === 0 || isCalculating}
              className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold uppercase tracking-widest text-[11px] transition-all ${
                selectedInterests.length > 0 && !isCalculating
                ? "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                : "bg-white/5 text-neutral-600 border border-white/5 cursor-not-allowed"
              }`}
            >
              {isCalculating ? 'Computing Scores...' : 'Run Simulation'}
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Explainability Panel */}
            <AnimatePresence>
              {phase === "result" && topMatch && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/15 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-5">
                      <Sparkles className="w-14 h-14 text-blue-500" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400 mb-3 block">Why Recommended</span>
                    <h4 className="text-sm font-bold text-white mb-4">{topMatch.title}</h4>
                    
                    <div className="space-y-1.5 mb-4">
                      {topMatch.tags.map(tag => {
                        const isMatch = topMatch.matches.includes(tag);
                        return (
                          <div key={tag} className="flex items-center gap-2">
                            {isMatch ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <X className="w-3 h-3 text-neutral-600" />
                            )}
                            <span className={`text-[11px] font-medium ${isMatch ? "text-emerald-400" : "text-neutral-600"}`}>
                              {tag}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-blue-500/10">
                      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-blue-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${topMatch.score * 100}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                      <span className="text-sm font-mono font-black text-blue-400">{Math.round(topMatch.score * 100)}%</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Code Panel */}
            <div className="pt-6 border-t border-white/5 mt-auto">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-4 block">Similarity Engine</span>
              <div className="font-mono text-[11px] bg-black/40 p-4 rounded-xl border border-white/5">
                {[
                  "function score(userTags, itemTags) {",
                  "  const matches = itemTags.filter(t => userTags.includes(t));",
                  "  return matches.length / itemTags.length;",
                  "}"
                ].map((line, idx) => (
                  <SyntaxHighlightedLine key={idx} line={line} isActive={activeLines.includes(idx)} />
                ))}
              </div>
            </div>
          </div>
        </div>
      }
      useCases={USE_CASES}
      takeaway="Recommendation systems turn user behavior into ranked decisions."
      takeawaySub="By mapping user interests and item attributes into a shared tag space, algorithms can quantify relevance. This simple ratio (matches / total attributes) is the core of content-based filtering used by nearly every modern platform."
    />
  );
}
