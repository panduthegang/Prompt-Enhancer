import { motion } from "motion/react";
import { Sparkles, CornerDownRight } from "lucide-react";

export default function AuthVisuals() {
  return (
    <div className="hidden lg:flex w-1/2 h-full relative bg-background flex-col justify-center items-center overflow-hidden border-l border-border/20">
      <div className="absolute inset-0 bg-grid-pattern opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-br from-background via-transparent to-background/50 z-0 pointer-events-none" />
      
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
          {/* Step 1: Raw Stream */}
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

          {/* Step 2: Synthesis Core Processing */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, scale: 0.95 },
              visible: { opacity: 1, scale: 1 }
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="p-6 border border-foreground bg-foreground text-background self-center w-[90%] mx-auto relative shadow-2xl overflow-hidden rounded-none group"
          >
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

          {/* Step 3: Optimized Artifact */}
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
    </div>
  );
}
