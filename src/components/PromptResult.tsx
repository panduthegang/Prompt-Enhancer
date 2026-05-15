import { motion } from "motion/react";
import { ArrowRight, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { EnhancementResult } from "../types";

interface PromptResultProps {
  result: EnhancementResult;
  onCopy: (text: string) => void;
  copiedPrompt: string | null;
  onReset: () => void;
}

export default function PromptResult({ result, onCopy, copiedPrompt, onReset }: PromptResultProps) {
  return (
    <motion.div
      key="result"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl"
    >
       <div className="bg-background border border-border shadow-2xl relative">
         <div className="flex items-center justify-between border-b border-border bg-muted/20 p-4">
            <span className="text-xs font-bold uppercase tracking-widest">Optimized Output</span>
            <div className="flex items-center gap-3">
              
              <button 
                onClick={() => onCopy(result.optimizedPrompt)}
                className="min-w-[80px] px-3 py-1.5 border border-foreground bg-foreground text-background hover:bg-background hover:text-foreground transition-all flex justify-center items-center gap-2 text-xs uppercase"
              >
                 {copiedPrompt === result.optimizedPrompt ? (
                    <><Check className="w-3 h-3" /> Copied</>
                 ) : (
                    <><Copy className="w-3 h-3" /> Copy</>
                 )}
              </button>
            </div>
         </div>
         
         <div className="p-8">
           <div className="markdown-body">
              <ReactMarkdown>{result.optimizedPrompt}</ReactMarkdown>
           </div>
         </div>
         
         <div className="p-4 border-t border-border flex justify-end bg-muted/10">
           <button
             onClick={onReset}
             className="px-6 py-2 border border-border hover:bg-muted text-xs uppercase tracking-widest font-bold transition-colors"
           >
             Process Another
           </button>
         </div>
       </div>
    </motion.div>
  );
}
