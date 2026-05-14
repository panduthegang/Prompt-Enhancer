import { motion } from "motion/react";
import { IntentDetectionResult } from "../types";

const SkeletonBlock = ({ className }: { className?: string }) => (
  <div className={`relative overflow-hidden bg-muted/60 ${className}`}>
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent"
      animate={{
        x: ['-100%', '100%'],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  </div>
);

interface DetectingStateProps {}
export function DetectingState({}: DetectingStateProps) {
  return (
    <motion.div
      key="detecting"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-2xl bg-background border border-border p-6 shadow-2xl relative overflow-hidden group"
    >
      <motion.div 
        className="absolute top-0 left-0 w-full h-px bg-foreground/20 z-20"
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
      
      <div className="absolute top-0 right-0 p-2 border-b border-l border-border bg-muted/30 w-32 h-8">
        <SkeletonBlock className="w-full h-full" />
      </div>
      <div className="mb-6 mt-4 space-y-4">
        <SkeletonBlock className="w-48 h-4" />
        <SkeletonBlock className="w-full h-16 border border-border/50" />
        <SkeletonBlock className="w-3/4 h-6" />
      </div>
      <div className="flex gap-4">
        <SkeletonBlock className="flex-1 h-12 border border-border" />
        <SkeletonBlock className="flex-1 h-12 border border-border" />
      </div>
    </motion.div>
  );
}

interface ConfirmingStateProps {
  intent: IntentDetectionResult;
  onConfirm: (confirm: boolean) => void;
}
export function ConfirmingState({ intent, onConfirm }: ConfirmingStateProps) {
  return (
    <motion.div
      key="confirming"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-2xl bg-background border border-border p-6 shadow-2xl relative"
    >
      <div className="absolute top-0 right-0 p-2 border-b border-l border-border bg-muted/30">
        <span className="text-[10px] uppercase tracking-widest font-bold">Intent Detected</span>
      </div>
      <div className="mb-6 mt-4">
        <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2 font-bold flex gap-2">
           Category <span className="text-foreground">{intent.category}</span>
        </p>
        <div className="p-4 bg-muted/30 border border-border/50 italic mb-4 text-sm">
          "{intent.cleanedInput}"
        </div>
        <h3 className="text-lg font-bold">I assume you want to {intent.intent}?</h3>
      </div>
      
      <div className="flex gap-4">
        <button
          onClick={() => onConfirm(true)}
          className="flex-1 py-3 border border-foreground bg-foreground text-background uppercase tracking-widest text-xs font-bold hover:bg-background hover:text-foreground transition-all"
        >
          Enhance It
        </button>
        <button
          onClick={() => onConfirm(false)}
          className="flex-1 py-3 border border-border hover:bg-muted uppercase tracking-widest text-xs font-bold transition-colors"
        >
          Refine Input
        </button>
      </div>
    </motion.div>
  );
}

interface EnhancingStateProps {}
export function EnhancingState({}: EnhancingStateProps) {
  return (
    <motion.div
      key="enhancing"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl"
    >
       <div className="bg-background border border-border shadow-2xl relative overflow-hidden">
         <motion.div 
            className="absolute top-0 left-0 w-full h-px bg-foreground/20 z-20"
            animate={{ top: ['0%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
         />

         <div className="flex items-center justify-between border-b border-border bg-muted/20 p-4">
            <SkeletonBlock className="w-32 h-4" />
            <div className="flex items-center gap-3">
              <SkeletonBlock className="w-24 h-4" />
              <SkeletonBlock className="w-16 h-8" />
            </div>
         </div>
         
         <div className="p-8 space-y-6">
           <SkeletonBlock className="w-1/3 h-6" />
           <div className="space-y-3">
             <SkeletonBlock className="w-full h-4" />
             <SkeletonBlock className="w-5/6 h-4" />
             <SkeletonBlock className="w-4/6 h-4" />
           </div>
           <SkeletonBlock className="w-1/4 h-6 mt-8" />
           <div className="space-y-3">
             <SkeletonBlock className="w-full h-4" />
             <SkeletonBlock className="w-full h-4" />
           </div>
         </div>
         
         <div className="p-4 border-t border-border flex justify-end bg-muted/10">
           <SkeletonBlock className="w-32 h-8" />
         </div>
       </div>
    </motion.div>
  );
}
