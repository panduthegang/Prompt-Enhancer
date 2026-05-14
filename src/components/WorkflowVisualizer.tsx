import { motion } from "motion/react";
import { Check } from "lucide-react";
import { cn } from "../lib/utils";
import { useMemo, useRef, useEffect } from "react";

export type AppState = "idle" | "detecting" | "confirming" | "enhancing" | "result" | "error";

export const WORKFLOW_STEPS = [
  { id: "input", label: "Input", states: ["idle", "detecting", "confirming", "enhancing", "result"] },
  { id: "cleaning", label: "Cleaning", states: ["detecting", "confirming", "enhancing", "result"] },
  { id: "intent", label: "Intent Detection", states: ["confirming", "enhancing", "result"] },
  { id: "confirmation", label: "Confirmation", states: ["enhancing", "result"] },
  { id: "enhancement", label: "Prompt Enhancement", states: ["enhancing", "result"] },
  { id: "validation", label: "Validation", states: ["result"] },
  { id: "final", label: "Final Optimized Prompt", states: ["result"] },
];

interface WorkflowVisualizerProps {
  appState: AppState;
}

export default function WorkflowVisualizer({ appState }: WorkflowVisualizerProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const stepsRefs = useRef<(HTMLDivElement | null)[]>([]);

  const currentIndex = useMemo(() => {
    const idx = WORKFLOW_STEPS.findIndex(s => 
      (appState === "idle" && s.id === "input") ||
      (appState === "detecting" && s.id === "intent") ||
      (appState === "confirming" && s.id === "confirmation") ||
      (appState === "enhancing" && s.id === "enhancement") ||
      (appState === "result" && s.id === "final")
    );
    return idx === -1 ? 0 : idx;
  }, [appState]);

  // Auto-scroll to active step on mobile
  useEffect(() => {
    if (window.innerWidth < 768 && stepsRefs.current[currentIndex]) {
      stepsRefs.current[currentIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center"
      });
    }
  }, [currentIndex]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 pt-28 pb-8 z-10 flex flex-col items-center">
      <div 
        ref={scrollContainerRef}
        className="flex w-full overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory items-start md:justify-between relative px-4 py-2"
      >
        {/* Connection Lines */}
        <div className="absolute top-6 left-0 right-0 h-px bg-border -z-20 min-w-[1000px] md:min-w-0 mx-8" />
        <motion.div 
          className="absolute top-6 left-0 h-px bg-foreground -z-10 ml-8" 
          initial={{ width: "0%" }}
          animate={{ 
            width: `calc(${(currentIndex / (WORKFLOW_STEPS.length - 1)) * 100}% - 48px)` 
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {WORKFLOW_STEPS.map((step, idx) => {
          const isActive = step.states.includes(appState);
          const isCurrent = (appState === "idle" && step.id === "input") ||
                            (appState === "detecting" && (step.id === "cleaning" || step.id === "intent")) ||
                            (appState === "confirming" && step.id === "confirmation") ||
                            (appState === "enhancing" && (step.id === "enhancement" || step.id === "validation")) ||
                            (appState === "result" && step.id === "final");
          
          return (
            <div 
              key={step.id} 
              ref={el => stepsRefs.current[idx] = el}
              className={cn(
                "flex flex-col items-center gap-3 relative bg-background px-4 snap-center shrink-0 md:shrink transition-opacity duration-300",
                !isCurrent && !isActive && "opacity-40 md:opacity-100"
              )}
              style={{ minWidth: "140px" }}
            >
              <motion.div 
                className={cn(
                  "w-8 h-8 flex items-center justify-center border transition-all duration-300",
                  isActive ? "border-foreground bg-foreground text-background" : "border-border bg-background text-muted-foreground",
                  isCurrent && "ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110"
                )}
              >
                 {isActive && !isCurrent ? <Check className="w-4 h-4" /> : <span className="text-xs font-bold">{idx + 1}</span>}
              </motion.div>
              <span className={cn(
                "text-[10px] uppercase tracking-widest text-center w-28 leading-tight font-bold transition-colors duration-300",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
