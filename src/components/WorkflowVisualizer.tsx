import { motion } from "motion/react";
import { Check } from "lucide-react";
import { cn } from "../lib/utils";

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
  return (
    <div className="w-full max-w-6xl mx-auto px-4 pt-28 pb-8 z-10 flex flex-col items-center overflow-x-auto">
      <div className="flex w-full min-w-[800px] items-start justify-between relative">
        <div className="absolute top-4 left-0 right-0 h-px bg-border -z-20" />
        <motion.div 
          className="absolute top-4 left-0 h-px bg-foreground -z-10" 
          initial={{ width: "0%" }}
          animate={{ 
            width: `${(
              WORKFLOW_STEPS.findIndex(s => 
                (appState === "idle" && s.id === "input") ||
                (appState === "detecting" && s.id === "intent") ||
                (appState === "confirming" && s.id === "confirmation") ||
                (appState === "enhancing" && s.id === "enhancement") ||
                (appState === "result" && s.id === "final")
              ) / (WORKFLOW_STEPS.length - 1)
            ) * 100}%` 
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
            <div key={step.id} className="flex flex-col items-center gap-3 relative bg-background px-2">
              <motion.div 
                className={cn(
                  "w-8 h-8 flex items-center justify-center border",
                  isActive ? "border-foreground bg-foreground text-background" : "border-border bg-background text-muted-foreground",
                  isCurrent && "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                )}
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                 {isActive && !isCurrent ? <Check className="w-4 h-4" /> : <span className="text-xs font-bold">{idx + 1}</span>}
              </motion.div>
              <span className={cn(
                "text-[10px] uppercase tracking-widest text-center w-24 leading-tight font-bold",
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
