import { useState, useRef, useEffect } from "react";
import { Mic, Moon, Sun, ArrowRight, Copy, Check, Info, Sparkles, CheckCircle2, Circle, Search, Filter, ChevronDown, LogOut, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";

import { detectIntent, enhancePrompt } from "./services/geminiService";
import { IntentDetectionResult, EnhancementResult, PromptHistory, PromptCategory } from "./types";
import { cn } from "./lib/utils";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";


import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./components/ui/Dialog";

type AppState = "idle" | "detecting" | "confirming" | "enhancing" | "result";

const WORKFLOW_STEPS = [
  { id: "input", label: "Input", states: ["idle", "detecting", "confirming", "enhancing", "result"] },
  { id: "cleaning", label: "Cleaning", states: ["detecting", "confirming", "enhancing", "result"] },
  { id: "intent", label: "Intent Detection", states: ["confirming", "enhancing", "result"] },
  { id: "confirmation", label: "Confirmation", states: ["enhancing", "result"] },
  { id: "enhancement", label: "Prompt Enhancement", states: ["enhancing", "result"] },
  { id: "validation", label: "Validation", states: ["result"] },
  { id: "final", label: "Final Optimized Prompt", states: ["result"] },
];

const CATEGORIES: (PromptCategory | "All")[] = [
  "All", "image generation", "video generation", "coding/web app", "marketing", "content writing", "UI/UX", "business", "research", "other"
];

const EXAMPLES: { category: PromptCategory, text: string }[] = [
  { category: "image generation", text: "A futuristic city skyline at sunset with flying cars, cyberpunk style" },
  { category: "coding/web app", text: "Create a functional React to-do list app with Tailwind CSS and local storage" },
  { category: "marketing", text: "High-converting Facebook ad copy for a new eco-friendly water bottle" },
  { category: "UI/UX", text: "landing page wireframe for a SaaS dashboard focusing on data analytics" },
];

export default function App() {
  const [user, setUser] = useState<{ username: string, email: string } | null>(null);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [appState, setAppState] = useState<AppState>("idle");
  const [currentIntent, setCurrentIntent] = useState<IntentDetectionResult | null>(null);
  const [currentResult, setCurrentResult] = useState<EnhancementResult | null>(null);
  
  const [history, setHistory] = useState<PromptHistory[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<PromptHistory | null>(null);
  
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<PromptCategory | "All">("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    const saved = localStorage.getItem("promptEngineHistory");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }

    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setInput((prev) => prev + " " + finalTranscript.trim());
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleProcess = async () => {
    if (!input.trim() || appState !== "idle") return;
    setAppState("detecting");
    
    const intent = await detectIntent(input);
    if (intent) {
      setCurrentIntent(intent);
      setAppState("confirming");
    } else {
      setAppState("idle");
    }
  };

  const handleConfirm = async (confirm: boolean) => {
    if (!confirm) {
      setAppState("idle");
      return;
    }

    setAppState("enhancing");
    if (currentIntent) {
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
        setAppState("idle");
      }
    }
  };

  const reset = () => {
    setInput("");
    setCurrentIntent(null);
    setCurrentResult(null);
    setAppState("idle");
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(text);
    setTimeout(() => {
      setCopiedPrompt(null);
    }, 2000);
  };
  
  const filteredHistory = history.filter(item => {
    const matchesSearch = item.original.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.optimized.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "All" || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="relative min-h-screen font-mono text-foreground overflow-x-hidden selection:bg-foreground selection:text-background flex flex-col">
      {/* Background with Fade */}
      <div className="fixed inset-0 z-[-2] bg-background" />
      <div className="fixed inset-0 z-[-1] bg-grid-pattern" />
      <div className="fixed inset-0 z-[-1] bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />

      <AnimatePresence mode="wait">
        {!user ? (
          <motion.div
            key="auth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <AnimatePresence mode="wait">
              {authMode === "signin" ? (
                <motion.div
                  key="signin"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  <SignIn onLogin={(u) => setUser(u)} onSwitchToSignUp={() => setAuthMode("signup")} />
                </motion.div>
              ) : (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  <SignUp onLogin={(u) => setUser(u)} onSwitchToSignIn={() => setAuthMode("signin")} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="app-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col w-full"
          >
            {/* Header */}
            <header className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50">

        <div className="flex flex-col">
           <h1 className="text-xl font-bold tracking-widest uppercase flex items-center gap-2">
             <Sparkles className="w-5 h-5 fill-current" /> P.E.E
           </h1>
           <span className="text-[10px] tracking-widest text-muted-foreground uppercase">Prompt Enhancement Engine</span>
        </div>
        
        <div className="flex items-center gap-4">
          {/* User Profile area */}
          <div className="hidden sm:flex items-center gap-3 pr-4 border-r border-border">
             <div className="w-8 h-8 bg-muted border border-border flex items-center justify-center">
                <User className="w-4 h-4 text-muted-foreground" />
             </div>
             <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest">{user.username}</span>
                <span className="text-[9px] uppercase tracking-widest text-muted-foreground">{user.email}</span>
             </div>
          </div>
          
          <button
            onClick={() => setUser(null)}
            className="p-2 border border-border hover:bg-foreground hover:text-background transition-colors rounded-none outline-none group"
            title="Disconnect"
          >
             <LogOut className="w-4 h-4 text-muted-foreground group-hover:text-background transition-colors" />
          </button>

          {/* Modern Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative flex items-center w-16 h-8 bg-background border border-border outline-none overflow-hidden group hover:border-foreground transition-colors"
            aria-label="Toggle theme"
          >
            <div className="absolute inset-0 flex items-center justify-between px-2 w-full">
              <Moon className="w-3.5 h-3.5 text-muted-foreground transition-colors group-hover:text-foreground" />
              <Sun className="w-3.5 h-3.5 text-muted-foreground transition-colors group-hover:text-foreground" />
            </div>
            <motion.div
              className="absolute top-0.5 bottom-0.5 w-[26px] bg-foreground flex items-center justify-center z-10 shadow-sm"
              animate={{ left: theme === "dark" ? "2px" : "34px" }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {theme === "dark" ? <Moon className="w-3 h-3 text-background" /> : <Sun className="w-3 h-3 text-background" />}
            </motion.div>
          </button>
        </div>
      </header>

      {/* Workflow Visualizer */}
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

      {/* Main Action Area */}
      <main className="flex-1 flex flex-col items-center pt-8 pb-24 px-4 w-full max-w-4xl mx-auto z-10">
        
        <AnimatePresence mode="wait">
          {appState === "idle" && (
            <motion.div
              key="input-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full flex flex-col items-center gap-12"
            >
              <div className="relative w-full max-w-2xl bg-background border border-border p-1 group focus-within:border-foreground transition-colors shadow-2xl">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleProcess();
                    }
                  }}
                  placeholder="Type or speak the raw fragments of your idea..."
                  className="w-full min-h-[160px] resize-none bg-transparent outline-none p-4 placeholder:text-muted-foreground/50"
                />
                
                <div className="flex justify-between items-center p-2 border-t border-border/50">
                  <button
                    onClick={toggleRecording}
                    className={cn(
                      "p-3 border border-border flex items-center gap-2 transition-colors uppercase tracking-widest text-xs",
                      isRecording ? "bg-destructive text-destructive-foreground border-destructive animate-pulse" : "hover:bg-muted"
                    )}
                  >
                    <Mic className="w-4 h-4" />
                    {isRecording ? "Recording..." : "Voice Input"}
                  </button>
                  
                  <button
                    onClick={handleProcess}
                    disabled={!input.trim()}
                    className="p-3 border border-foreground bg-foreground text-background flex items-center gap-2 hover:bg-background hover:text-foreground transition-all disabled:opacity-50 uppercase tracking-widest text-xs"
                  >
                    Enhance <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Inspiration Section */}
              <div className="w-full max-w-4xl opacity-80">
                <h3 className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-4 text-center">Inspiration</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {EXAMPLES.map((example, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(example.text)}
                      className="text-left border border-border p-4 bg-background hover:border-foreground transition-colors group relative h-32 flex flex-col items-start gap-2"
                    >
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground group-hover:text-foreground transition-colors">{example.category}</span>
                      <p className="text-xs line-clamp-3 text-muted-foreground group-hover:text-foreground transition-colors relative z-10 leading-relaxed">"{example.text}"</p>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {appState === "detecting" && (
            <motion.div
              key="detecting"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-2xl bg-background border border-border p-6 shadow-2xl relative"
            >
              <div className="absolute top-0 right-0 p-2 border-b border-l border-border bg-muted/30 w-32 h-8">
                <div className="w-full h-full bg-muted animate-pulse" />
              </div>
              <div className="mb-6 mt-4 space-y-4">
                <div className="w-48 h-4 bg-muted animate-pulse" />
                <div className="w-full h-16 bg-muted/30 border border-border/50 animate-pulse" />
                <div className="w-3/4 h-6 bg-muted animate-pulse" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1 h-12 bg-muted animate-pulse border border-border" />
                <div className="flex-1 h-12 bg-muted/50 animate-pulse border border-border" />
              </div>
            </motion.div>
          )}

          {appState === "confirming" && currentIntent && (
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
                   Category <span className="text-foreground">{currentIntent.category}</span>
                </p>
                <div className="p-4 bg-muted/30 border border-border/50 italic mb-4 text-sm">
                  "{currentIntent.cleanedInput}"
                </div>
                <h3 className="text-lg font-bold">I assume you want to {currentIntent.intent}?</h3>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={() => handleConfirm(true)}
                  className="flex-1 py-3 border border-foreground bg-foreground text-background uppercase tracking-widest text-xs font-bold hover:bg-background hover:text-foreground transition-all"
                >
                  Enhance It
                </button>
                <button
                  onClick={() => handleConfirm(false)}
                  className="flex-1 py-3 border border-border hover:bg-muted uppercase tracking-widest text-xs font-bold transition-colors"
                >
                  Refine Input
                </button>
              </div>
            </motion.div>
          )}

          {appState === "enhancing" && (
            <motion.div
              key="enhancing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-4xl"
            >
               <div className="bg-background border border-border shadow-2xl relative">
                 <div className="flex items-center justify-between border-b border-border bg-muted/20 p-4">
                    <div className="w-32 h-4 bg-muted animate-pulse" />
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-4 bg-muted animate-pulse" />
                      <div className="w-16 h-8 bg-muted animate-pulse" />
                    </div>
                 </div>
                 
                 <div className="p-8 space-y-6">
                   <div className="w-1/3 h-6 bg-muted animate-pulse" />
                   <div className="space-y-3">
                     <div className="w-full h-4 bg-muted animate-pulse" />
                     <div className="w-5/6 h-4 bg-muted animate-pulse" />
                     <div className="w-4/6 h-4 bg-muted animate-pulse" />
                   </div>
                   <div className="w-1/4 h-6 bg-muted animate-pulse mt-8" />
                   <div className="space-y-3">
                     <div className="w-full h-4 bg-muted animate-pulse" />
                     <div className="w-full h-4 bg-muted animate-pulse" />
                   </div>
                 </div>
                 
                 <div className="p-4 border-t border-border flex justify-end bg-muted/10">
                   <div className="w-32 h-8 bg-muted animate-pulse" />
                 </div>
               </div>
            </motion.div>
          )}

          {appState === "result" && currentResult && (
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
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        Tokens: <span className="text-foreground line-through opacity-50">{currentResult.originalTokens}</span> 
                        <ArrowRight className="w-3 h-3" /> 
                        <span className="font-bold text-primary px-1 bg-primary/10 border border-primary/20">{currentResult.optimizedTokens}</span>
                      </div>
                      <button 
                        onClick={() => handleCopy(currentResult.optimizedPrompt)}
                        className="min-w-[80px] px-3 py-1.5 border border-foreground bg-foreground text-background hover:bg-background hover:text-foreground transition-all flex justify-center items-center gap-2 text-xs uppercase"
                      >
                         {copiedPrompt === currentResult.optimizedPrompt ? (
                            <><Check className="w-3 h-3" /> Copied</>
                         ) : (
                            <><Copy className="w-3 h-3" /> Copy</>
                         )}
                      </button>
                    </div>
                 </div>
                 
                 <div className="p-8">
                   <div className="markdown-body">
                      <ReactMarkdown>{currentResult.optimizedPrompt}</ReactMarkdown>
                   </div>
                 </div>
                 
                 <div className="p-4 border-t border-border flex justify-end bg-muted/10">
                   <button
                     onClick={reset}
                     className="px-6 py-2 border border-border hover:bg-muted text-xs uppercase tracking-widest font-bold transition-colors"
                   >
                     Process Another
                   </button>
                 </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* History Grid (only show when idle or result) */}
      <AnimatePresence>
        {(appState === "idle" || appState === "result") && history.length > 0 && (
          <motion.footer 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full border-t border-border bg-background/50 backdrop-blur-md mt-auto relative z-20"
          >
            <div className="max-w-7xl mx-auto p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                 <div className="flex items-center gap-3">
                   <h2 className="text-xs uppercase tracking-widest font-bold text-muted-foreground whitespace-nowrap">Historical Logs</h2>
                   <span className="text-[10px] uppercase tracking-widest text-muted-foreground whitespace-nowrap">{filteredHistory.length} records</span>
                 </div>
                 
                 <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                    <div className="relative w-full sm:w-64 flex items-center group">
                      <Search className="w-4 h-4 absolute left-3 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                      <input 
                        type="text" 
                        placeholder="Search prompts..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border border-border py-2 pl-9 pr-3 text-xs uppercase tracking-widest outline-none focus:border-foreground transition-colors w-full"
                      />
                    </div>
                    <div className="relative w-full sm:w-56 flex items-center group">
                      <Filter className="w-4 h-4 absolute left-3 text-muted-foreground group-focus-within:text-foreground transition-colors pointer-events-none z-10" />
                      
                      <button 
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="bg-transparent border border-border py-2 pl-9 pr-8 text-xs uppercase tracking-widest outline-none hover:border-foreground focus:border-foreground transition-colors w-full text-left relative"
                      >
                        {filterCategory}
                        <ChevronDown className="w-3 h-3 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                      </button>

                      <AnimatePresence>
                        {isFilterOpen && (
                          <>
                            <div className="fixed inset-0 z-20" onClick={() => setIsFilterOpen(false)} />
                            <motion.div 
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              className="absolute top-full left-0 right-0 mt-1 bg-background border border-border shadow-2xl z-30 max-h-60 overflow-y-auto"
                            >
                              {CATEGORIES.map(c => (
                                <button 
                                  key={c} 
                                  onClick={() => {
                                    setFilterCategory(c);
                                    setIsFilterOpen(false);
                                  }}
                                  className={cn(
                                    "w-full text-left px-4 py-2 text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors",
                                    filterCategory === c ? "bg-muted text-foreground" : "text-muted-foreground"
                                  )}
                                >
                                  {c}
                                </button>
                              ))}
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                 </div>
              </div>
              
              {filteredHistory.length === 0 ? (
                <div className="text-center py-8 text-xs text-muted-foreground uppercase tracking-widest border border-dashed border-border">
                  No records match your filters.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {filteredHistory.slice(0, 8).map(item => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedHistory(item)}
                      className="text-left border border-border p-4 bg-background hover:border-foreground transition-colors group relative overflow-hidden h-32 flex flex-col justify-between"
                    >
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-foreground/5 to-transparent translate-x-[-100%] group-hover:translate-x-[0%] transition-transform duration-500 ease-out" />
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">{item.category}</span>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-foreground"><ArrowRight className="w-3 h-3" /></span>
                      </div>
                      <p className="text-xs line-clamp-2 text-muted-foreground group-hover:text-foreground transition-colors mb-2 flex-grow">"{item.original}"</p>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-auto">{new Date(item.timestamp).toLocaleDateString()}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.footer>
        )}
      </AnimatePresence>

      {/* History Dialog */}
      <Dialog open={!!selectedHistory} onOpenChange={() => setSelectedHistory(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-[90vw] lg:max-w-[1200px] w-full border-border bg-background rounded-none shadow-2xl p-0 gap-0 max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="p-6 border-b border-border bg-muted/20">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <Info className="w-4 h-4" /> Record Details
              </DialogTitle>
              {selectedHistory && (
                 <span className="text-[10px] px-2 py-1 border border-border font-bold uppercase tracking-widest">
                   {selectedHistory.category}
                 </span>
              )}
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {selectedHistory && (
              <>
                <div className="space-y-2">
                  <h4 className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Raw Input</h4>
                  <div className="p-4 border border-border bg-muted/30 text-sm italic relative">
                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-muted-foreground/30" />
                    "{selectedHistory.original}"
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold flex justify-between items-center">
                    <span>Generated Artifact</span>
                    <button 
                      onClick={() => handleCopy(selectedHistory.optimized)}
                      className="flex items-center gap-1.5 hover:text-foreground transition-colors text-muted-foreground w-24 justify-end"
                    >
                      {copiedPrompt === selectedHistory.optimized ? (
                         <><Check className="w-3 h-3" /> COPIED</>
                      ) : (
                         <><Copy className="w-3 h-3" /> COPY</>
                      )}
                    </button>
                  </h4>
                  <div className="markdown-body">
                    <ReactMarkdown>{selectedHistory.optimized}</ReactMarkdown>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
