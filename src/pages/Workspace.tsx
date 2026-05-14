import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";

import { detectIntent, enhancePrompt } from "../services/geminiService";
import { PromptHistory, IntentDetectionResult, EnhancementResult } from "../types";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";

// Components
import WorkspaceHeader from "../components/WorkspaceHeader";
import WorkflowVisualizer, { AppState } from "../components/WorkflowVisualizer";
import InspirationGrid from "../components/InspirationGrid";
import HistoryLogs from "../components/HistoryLogs";
import PromptInput from "../components/PromptInput";
import { DetectingState, ConfirmingState, EnhancingState } from "../components/ProcessingStates";
import PromptResult from "../components/PromptResult";

interface WorkspaceProps {
  user: { username: string, email: string };
  onLogout: () => void;
}

export default function Workspace({ user, onLogout }: WorkspaceProps) {
  // Action State
  const [input, setInput] = useState("");
  const [appState, setAppState] = useState<AppState>("idle");
  const [currentIntent, setCurrentIntent] = useState<IntentDetectionResult | null>(null);
  const [currentResult, setCurrentResult] = useState<EnhancementResult | null>(null);
  
  // Data State
  const [history, setHistory] = useState<PromptHistory[]>([]);
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);

  // Hook for speech service
  const { isRecording, interimTranscript, toggleRecording } = useSpeechRecognition((transcript) => {
    setInput((prev) => (prev + " " + transcript).trim());
  });

  useEffect(() => {
    const saved = localStorage.getItem("promptEngineHistory");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleProcess = async () => {
    if (!input.trim() || appState !== "idle") return;
    setAppState("detecting");
    
    try {
      const intent = await detectIntent(input);
      if (intent) {
        setCurrentIntent(intent);
        setAppState("confirming");
      } else {
        setAppState("error");
      }
    } catch {
      setAppState("error");
    }
  };

  const handleConfirm = async (confirm: boolean) => {
    if (!confirm) {
      setAppState("idle");
      return;
    }

    setAppState("enhancing");
    if (currentIntent) {
      try {
        const result = await enhancePrompt(currentIntent);
        if (result) {
          setCurrentResult(result);
          setAppState("result");
          
          const newHistoryItem: PromptHistory = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            original: currentIntent.cleanedInput,
            optimized: result.optimizedPrompt,
            category: currentIntent.category,
          };
          const updated = [newHistoryItem, ...history.slice(0, 49)];
          setHistory(updated);
          localStorage.setItem("promptEngineHistory", JSON.stringify(updated));
        } else {
          setAppState("error");
        }
      } catch {
        setAppState("error");
      }
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(text);
    setTimeout(() => setCopiedPrompt(null), 2000);
  };

  const handleToggleFavorite = (id: string) => {
    const updated = history.map(item => 
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    );
    setHistory(updated);
    localStorage.setItem("promptEngineHistory", JSON.stringify(updated));
  };

  const reset = () => {
    setInput("");
    setCurrentIntent(null);
    setCurrentResult(null);
    setAppState("idle");
  };

  return (
    <>
      <WorkspaceHeader user={user} onLogout={onLogout} />

      <WorkflowVisualizer appState={appState} />

      <main className="flex-1 flex flex-col items-center pt-8 pb-24 px-4 w-full max-w-4xl mx-auto z-10">
        <AnimatePresence mode="wait">
          {appState === "idle" && (
            <div className="w-full flex flex-col items-center gap-12">
              <PromptInput 
                input={input}
                setInput={setInput}
                isRecording={isRecording}
                interimTranscript={interimTranscript}
                onToggleRecording={toggleRecording}
                onProcess={handleProcess}
                disabled={appState !== "idle"}
              />
              <InspirationGrid onSelect={(text) => setInput(text)} />
            </div>
          )}

          {appState === "detecting" && <DetectingState />}

          {appState === "confirming" && currentIntent && (
            <ConfirmingState intent={currentIntent} onConfirm={handleConfirm} />
          )}

          {appState === "enhancing" && <EnhancingState />}

          {appState === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-2xl bg-background border border-border p-8 shadow-2xl text-center space-y-6"
            >
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Connection Error</p>
                <h3 className="text-lg font-bold">Could not reach the AI engine.</h3>
                <p className="text-sm text-muted-foreground">This is usually caused by an invalid API key or a network issue. Please check your <code className="bg-muted px-1">VITE_GEMINI_API_KEY</code> environment variable and try again.</p>
              </div>
              <button
                onClick={reset}
                className="px-6 py-3 border border-foreground bg-foreground text-background uppercase tracking-widest text-xs font-bold hover:bg-background hover:text-foreground transition-all"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {appState === "result" && currentResult && (
            <PromptResult 
              result={currentResult} 
              onCopy={handleCopy} 
              copiedPrompt={copiedPrompt} 
              onReset={reset} 
            />
          )}
        </AnimatePresence>
      </main>

      <HistoryLogs 
        history={history} 
        appState={appState} 
        onCopy={handleCopy} 
        copiedPrompt={copiedPrompt} 
        onToggleFavorite={handleToggleFavorite}
      />
    </>
  );
}
