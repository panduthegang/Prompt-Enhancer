import { motion } from "motion/react";
import { Mic, Zap, Cpu, ArrowRight, Terminal, Star, Sparkles } from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Floating Navbar */}
      <div className="fixed top-4 md:top-6 left-0 right-0 z-50 px-4 md:px-6">
        <nav className="max-w-5xl mx-auto border border-white/10 bg-black/60 backdrop-blur-xl px-4 md:px-6 h-12 md:h-14 flex items-center justify-between shadow-2xl overflow-hidden">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-white fill-current" />
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-white">PROMPT-ENHANCER</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors">Features</a>
          </div>

          <button 
            onClick={onGetStarted}
            className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest bg-white text-black px-3 md:px-5 py-1.5 md:py-2 hover:bg-white/90 transition-all shrink-0"
          >
            Launch App
          </button>
        </nav>
      </div>

      {/* Hero Section with Image Background */}
      <section 
        className="min-h-screen flex items-center pt-32 pb-20 md:pt-20 md:pb-20 px-6 relative overflow-hidden bg-cover bg-center text-white" 
        style={{ backgroundImage: 'url("/Hero-1.png")' }}
      >
        {/* Dark Overlay - Higher opacity for better text contrast */}
        <div className="absolute inset-0 bg-black/75 -z-10" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] text-white/80 mb-4 md:mb-6 block drop-shadow-md">
              Advanced Prompt Engineering
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-8xl font-bold tracking-tighter leading-[1.1] mb-6 md:mb-8 drop-shadow-2xl">
              Voice to <span className="italic text-white underline decoration-white/30 underline-offset-4 md:underline-offset-8">MVP</span> Prompt <br className="hidden sm:block" />
              In Seconds.
            </h1>
            <p className="text-xs md:text-base text-white/90 max-w-2xl mx-auto mb-10 md:mb-12 uppercase tracking-[0.15em] md:tracking-[0.2em] leading-relaxed drop-shadow-lg font-medium px-4">
              Transform raw voice rants, messy thoughts, and Hinglish inputs into 
              structured, token-efficient AI prompts. The bridge between human 
              chaos and machine precision.
            </p>
            <div className="flex justify-center">
              <button 
                onClick={onGetStarted}
                className="group w-full sm:w-auto bg-white text-black px-8 md:px-10 py-4 md:py-5 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-white/90 transition-all shadow-2xl"
              >
                Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Subtle Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 md:h-64 bg-gradient-to-t from-background via-background/80 to-transparent -z-10" />
      </section>

      {/* Why Section */}
      <section id="features" className="py-20 md:py-32 px-6 bg-background relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 md:gap-20">
            <div className="lg:col-span-1">
              <h2 className="text-xs font-bold uppercase tracking-[0.5em] text-muted-foreground mb-4 md:mb-8">Capabilities</h2>
              <h3 className="text-3xl md:text-5xl font-bold tracking-tighter mb-6 md:mb-8 leading-tight">Built for the next generation of AI power users.</h3>
              <p className="text-xs text-muted-foreground uppercase tracking-widest leading-relaxed opacity-70">
                We don't just optimize text. We decompose intent, identify constraints, and inject 
                professional context to ensure your LLM gives you the perfect answer on the first try.
              </p>
            </div>
            
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border">
              {[
                {
                  icon: Mic,
                  title: "Multilingual Voice",
                  desc: "Speak in Hinglish, Hindi, or English. Our engine understands context, not just words."
                },
                {
                  icon: Zap,
                  title: "Token Optimization",
                  desc: "Reduce token usage by 30-50% with our Caveman Mode, keeping your prompts lean and high-signal."
                },
                {
                  icon: Cpu,
                  title: "Intent Decomposition",
                  desc: "Automatically identifies Task, Domain, Audience, and Constraints for a highly structured prompt."
                },
                {
                  icon: Star,
                  title: "Historical Persistence",
                  desc: "Your best prompts are saved, categorized, and ready to be favorited for quick access."
                }
              ].map((feature, i) => (
                <div key={i} className="p-8 md:p-12 bg-background hover:bg-muted/50 transition-colors group">
                  <feature.icon className="w-6 h-6 md:w-7 md:h-7 mb-6 md:mb-8 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <h4 className="text-xs md:text-sm font-bold uppercase tracking-widest mb-3 md:mb-4">{feature.title}</h4>
                  <p className="text-[10px] md:text-xs text-muted-foreground leading-relaxed uppercase tracking-tight opacity-70 group-hover:opacity-100 transition-opacity">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-20 md:pt-24 pb-12 px-6 border-t border-border bg-black text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 md:mb-20">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6 md:mb-8">
                <Sparkles className="w-6 h-6 text-white fill-current" />
                <span className="text-xs md:text-sm font-bold uppercase tracking-widest">PROMPT-ENHANCER</span>
              </div>
              <p className="text-[10px] md:text-xs text-white/60 uppercase tracking-widest max-w-sm leading-relaxed font-medium">
                The bridge between human intent and artificial intelligence. 
                Optimized prompts for the world's most powerful models.
              </p>
            </div>
            
            <div className="space-y-4 md:space-y-6">
              <h5 className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white/40">Connect</h5>
              <div className="flex flex-col gap-3 md:gap-4">
                <a href="https://harshrathod-portfolio.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-[10px] md:text-xs uppercase tracking-widest hover:text-white/60 transition-colors font-medium">Portfolio</a>
                <a href="https://www.linkedin.com/in/harsh-rathod-2591b0292/" target="_blank" rel="noopener noreferrer" className="text-[10px] md:text-xs uppercase tracking-widest hover:text-white/60 transition-colors font-medium">LinkedIn</a>
              </div>
            </div>

            <div className="space-y-4 md:space-y-6">
              <h5 className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white/40">Legal</h5>
              <div className="flex flex-col gap-3 md:gap-4">
                <a href="#" className="text-[10px] md:text-xs uppercase tracking-widest hover:text-white/60 transition-colors font-medium">Privacy Policy</a>
                <a href="#" className="text-[10px] md:text-xs uppercase tracking-widest hover:text-white/60 transition-colors font-medium">Terms of Service</a>
              </div>
            </div>
          </div>

          <div className="pt-10 md:pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">
              Application crafted by <a href="https://harshrathod-portfolio.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/60 transition-colors">Harsh Rathod</a>
            </div>
            <p className="text-[8px] md:text-[9px] text-white/40 uppercase tracking-[0.5em]">&copy; 2026 PROMPT-ENHANCER. All rights reserved.</p>
          </div>
        </div>

        {/* Decorative element */}
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/[0.05] rounded-full blur-3xl" />
      </footer>
    </div>
  );
}
