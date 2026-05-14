import { Mic, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

interface PromptInputProps {
  input: string;
  setInput: (value: string) => void;
  isRecording: boolean;
  interimTranscript: string;
  onToggleRecording: () => void;
  onProcess: () => void;
  disabled: boolean;
}

export default function PromptInput({
  input,
  setInput,
  isRecording,
  interimTranscript,
  onToggleRecording,
  onProcess,
  disabled
}: PromptInputProps) {
  // The displayed value combines the committed input with real-time interim words
  const displayValue = isRecording && interimTranscript
    ? (input ? input + " " + interimTranscript : interimTranscript)
    : input;

  return (
    <motion.div
      key="input-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full flex flex-col items-center gap-12"
    >
      <div className="relative w-full max-w-2xl bg-background border border-border p-1 group focus-within:border-foreground transition-colors shadow-2xl">
        <textarea
          value={displayValue}
          onChange={(e) => {
            // Only update committed input when user types (not interim)
            if (!isRecording) setInput(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onProcess();
            }
          }}
          placeholder="Type or speak the raw fragments of your idea..."
          className={cn(
            "w-full min-h-[160px] resize-none bg-transparent outline-none p-4 placeholder:text-muted-foreground/50 transition-colors",
            // Interim words shown in a muted tone to indicate they're not yet committed
            isRecording && interimTranscript ? "text-muted-foreground" : "text-foreground"
          )}
          readOnly={isRecording}
        />
        
        <div className="flex justify-between items-center p-2 border-t border-border/50">
          <button
            onClick={onToggleRecording}
            className={cn(
              "p-3 border border-border flex items-center gap-2 transition-colors uppercase tracking-widest text-xs",
              isRecording ? "bg-foreground text-background border-foreground animate-pulse" : "hover:bg-muted"
            )}
          >
            <Mic className="w-4 h-4" />
            {isRecording ? "Recording..." : "Voice Input"}
          </button>
          
          <button
            onClick={onProcess}
            disabled={disabled || !input.trim()}
            className="p-3 border border-foreground bg-foreground text-background flex items-center gap-2 hover:bg-background hover:text-foreground transition-all disabled:opacity-50 uppercase tracking-widest text-xs"
          >
            Enhance <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
