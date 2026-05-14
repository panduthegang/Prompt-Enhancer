import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ArrowRight, CornerDownRight } from "lucide-react";
import { cn } from "./lib/utils";

const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24">
    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

export default function AuthPage({ onLogin }: { onLogin: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="flex min-h-screen w-full font-mono bg-background text-foreground selection:bg-foreground selection:text-background">
      {/* Left Column - Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 md:p-16 xl:p-24 justify-center relative z-10 border-r border-border bg-background min-h-screen">
        <div className="absolute top-8 left-8 md:top-12 md:left-12 flex flex-col">
           <h1 className="text-xl font-bold tracking-widest uppercase flex items-center gap-2">
             <Sparkles className="w-5 h-5 fill-current" /> P.E.E
           </h1>
           <span className="text-[10px] tracking-widest text-muted-foreground uppercase">Prompt Enhancement Engine</span>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm mx-auto"
        >
          <div className="mb-12">
            <h2 className="text-3xl font-bold tracking-widest uppercase mb-2">
              {isLogin ? "Authenticate" : "Initialize"}
            </h2>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest leading-relaxed">
              {isLogin ? "Enter your credentials to access the engine." : "Create an identity to begin enhancement."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="popLayout" initial={false}>
              {!isLogin ? (
                <motion.div
                  key="signup-username"
                  initial={{ opacity: 0, height: 0, overflow: 'hidden', filter: 'blur(4px)' }}
                  animate={{ opacity: 1, height: "auto", overflow: 'visible', filter: 'blur(0px)' }}
                  exit={{ opacity: 0, height: 0, overflow: 'hidden', filter: 'blur(4px)' }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="space-y-2"
                >
                  <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">System Alias (Username)</label>
                  <input 
                    type="text" 
                    required={!isLogin}
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full bg-transparent border border-border p-3 text-xs outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/30 rounded-none uppercase"
                    placeholder="SYS_ADMIN"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="signin-status"
                  initial={{ opacity: 0, height: 0, overflow: 'hidden', filter: 'blur(4px)' }}
                  animate={{ opacity: 1, height: "auto", overflow: 'visible', filter: 'blur(0px)' }}
                  exit={{ opacity: 0, height: 0, overflow: 'hidden', filter: 'blur(4px)' }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="pb-2"
                >
                  <div className="p-3 border border-border/50 bg-muted/10 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse ring-2 ring-green-500/20" />
                       <div className="text-[10px] uppercase tracking-widest text-muted-foreground flex flex-col">
                         <span className="font-bold text-foreground">Encrypted Channel</span>
                         <span>Node routing verified</span>
                       </div>
                     </div>
                     <span className="text-[9px] text-muted-foreground font-mono">256-BIT</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Network ID (Email)</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-transparent border border-border p-3 text-xs outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/30 rounded-none lowercase"
                placeholder="operator@matrix.net"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Passkey</label>
                {isLogin && <button type="button" className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">Recover?</button>}
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-transparent border border-border p-3 text-xs outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/30 rounded-none"
                placeholder="••••••••••••"
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-foreground text-background border border-foreground p-4 text-xs font-bold uppercase tracking-widest hover:bg-background hover:text-foreground transition-all mt-4 flex items-center justify-between group rounded-none"
            >
              {isLogin ? "Establish Connection" : "Generate Identity"}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </form>

          <div className="my-8 flex items-center gap-4">
            <div className="h-px bg-border flex-1" />
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">OR OVERRIDE VIA</span>
            <div className="h-px bg-border flex-1" />
          </div>

          <motion.button
            type="button"
            onClick={() => onLogin()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-transparent text-foreground border border-border p-4 text-xs font-bold uppercase tracking-widest hover:border-foreground hover:bg-muted/30 transition-all flex items-center justify-center gap-3 rounded-none"
          >
            <GoogleIcon /> Authmode: Google
          </motion.button>

          <div className="mt-12 text-center">
            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors underline decoration-border underline-offset-4 hover:decoration-foreground"
            >
              {isLogin ? "Require new identity? Initialize here" : "Already established? Authenticate here"}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Right Column - Visual/Animation */}
      <div className="hidden lg:flex w-1/2 sticky top-0 h-screen relative bg-background flex-col justify-center items-center overflow-hidden border-l border-border/20">
         <div className="absolute inset-0 bg-grid-pattern opacity-50" />
         <div className="absolute inset-0 bg-gradient-to-br from-background via-transparent to-background/50 z-0 pointer-events-none" />
         
         {/* Animated Flow Representation */}
         <div className="relative z-10 w-full max-w-xl mx-auto px-12">
            <motion.div 
              className="space-y-8"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.4 } }
              }}
            >
              {/* Step 1: Messy Input */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, x: -20, filter: 'blur(4px)' },
                  visible: { opacity: 1, x: 0, filter: 'blur(0px)' }
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="p-5 border border-border/50 bg-background/50 backdrop-blur-sm self-start w-4/5 mr-auto relative shadow-[4px_4px_0_0_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,0.05)]"
              >
                 <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                   <CornerDownRight className="w-3 h-3" /> Raw Stream
                 </div>
                 <motion.p 
                   animate={{ opacity: [0.6, 1, 0.6] }}
                   transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                   className="text-[11px] text-muted-foreground font-mono blur-[0.5px] hover:blur-none transition-all leading-relaxed"
                 >
                   "make website for gym need fast and cool looking animations maybe some dark mode"
                 </motion.p>
              </motion.div>

              {/* Processing Line */}
              <div className="flex justify-center my-2 h-16 relative">
                <motion.div 
                  initial={{ height: "0%" }}
                  animate={{ height: ["0%", "100%", "0%"], top: ["0%", "0%", "100%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-px bg-foreground absolute origin-top"
                />
              </div>

              {/* Step 2: Optimization Process */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, scale: 0.95 },
                  visible: { opacity: 1, scale: 1 }
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="p-6 border border-foreground bg-foreground text-background self-center w-[90%] mx-auto relative shadow-2xl overflow-hidden rounded-none group"
              >
                 {/* Scanner line */}
                 <motion.div 
                    animate={{ top: ["-10%", "110%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-8 bg-gradient-to-b from-transparent via-background/20 to-transparent z-10 pointer-events-none skew-y-3"
                 />
                 <div className="text-[10px] uppercase tracking-widest mb-5 font-bold flex justify-between items-center whitespace-nowrap">
                   <span>Synthesis Core Processing...</span>
                   <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
                     <Sparkles className="w-3 h-3" />
                   </motion.div>
                 </div>
                 <div className="space-y-3 opacity-60 relative z-0">
                    <motion.div animate={{ scaleX: [1, 0.95, 1], originX: 0 }} transition={{ duration: 2, repeat: Infinity }} className="h-1.5 w-full bg-background" />
                    <motion.div animate={{ scaleX: [1, 0.9, 1], originX: 0 }} transition={{ duration: 2, delay: 0.2, repeat: Infinity }} className="h-1.5 w-4/5 bg-background" />
                    <motion.div animate={{ scaleX: [1, 0.98, 1], originX: 0 }} transition={{ duration: 2, delay: 0.4, repeat: Infinity }} className="h-1.5 w-5/6 bg-background" />
                    <motion.div animate={{ scaleX: [1, 0.85, 1], originX: 0 }} transition={{ duration: 2, delay: 0.6, repeat: Infinity }} className="h-1.5 w-2/3 bg-background" />
                 </div>
              </motion.div>

              {/* Processing Line */}
              <div className="flex justify-center my-2 h-16 relative">
                <motion.div 
                  initial={{ height: "0%" }}
                  animate={{ height: ["0%", "100%", "0%"], top: ["0%", "0%", "100%"] }}
                  transition={{ duration: 2.5, delay: 1.25, repeat: Infinity, ease: "easeInOut" }}
                  className="w-px bg-foreground absolute origin-top"
                />
              </div>

              {/* Step 3: Crystalized Prompt */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, x: 20, filter: 'blur(4px)' },
                  visible: { opacity: 1, x: 0, filter: 'blur(0px)' }
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="p-6 border border-border bg-background backdrop-blur-md self-end w-[90%] ml-auto relative shadow-[8px_8px_0_0_rgba(0,0,0,0.1)] dark:shadow-[8px_8px_0_0_rgba(255,255,255,0.05)] border-l-4 border-l-foreground overflow-hidden group"
              >
                 <motion.div className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                 <div className="text-[10px] uppercase tracking-widest text-foreground font-bold mb-4 flex items-center justify-between relative z-10">
                   <span>Optimized Artifact</span>
                   <span className="text-muted-foreground flex items-center gap-1">
                     <span className="w-1 h-1 rounded-full bg-foreground animate-pulse" /> TOKENS: 64
                   </span>
                 </div>
                 <p className="text-[11px] text-foreground font-mono leading-relaxed relative z-10">
                   <strong>Role:</strong> Expert Full-Stack Developer.<br/>
                   <strong>Task:</strong> Develop a high-performance gym management landing page.<br/>
                   <strong>Tech Stack:</strong> Next.js, React, Tailwind CSS.<br/>
                   <strong>Key Features:</strong> Smooth performance, modern dark UI...
                 </p>
              </motion.div>
            </motion.div>
         </div>

         {/* Decorative Background Elements */}
         <div className="absolute bottom-0 right-0 p-8 text-[9px] uppercase tracking-widest text-muted-foreground/40 text-right leading-loose font-bold z-20">
           SYS_STATUS: ONLINE<br/>
           LATENCY: 12MS<br/>
           NODES: ACTIVE<br/>
           P.E.E v_2.0.4
         </div>
      </div>
    </div>
  );
}
