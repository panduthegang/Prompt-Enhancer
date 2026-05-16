import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, AlertCircle } from "lucide-react";
import AuthVisuals from "../components/AuthVisuals";
import { useAuth } from "../hooks/useAuth";

const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24">
    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

interface SignInProps {
  onSwitchToSignUp: () => void;
}

export default function SignIn({ onSwitchToSignUp }: SignInProps) {
  const navigate = useNavigate();
  const { signInEmail, signInGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await signInEmail(email, password);
      navigate("/workspace");
    } catch (err: any) {
      const code = err?.code || "";
      if (code === "auth/user-not-found" || code === "auth/invalid-credential") {
        setError("No account found with these credentials.");
      } else if (code === "auth/wrong-password") {
        setError("Incorrect password.");
      } else if (code === "auth/too-many-requests") {
        setError("Too many attempts. Try again later.");
      } else {
        setError("Authentication failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setIsLoading(true);
    try {
      await signInGoogle();
      navigate("/workspace");
    } catch (err: any) {
      if (err?.code !== "auth/popup-closed-by-user") {
        setError("Google sign-in failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full h-screen font-mono bg-background text-foreground selection:bg-foreground selection:text-background overflow-hidden">
      {/* Left Column - Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col px-8 py-6 md:px-16 md:py-8 xl:px-24 xl:py-10 justify-center relative z-10 border-r border-border bg-background h-full overflow-hidden">
        <button 
          onClick={() => navigate("/")}
          className="absolute top-8 left-8 md:top-10 md:left-12 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all flex items-center gap-2 z-20"
        >
          ← Back to Landing
        </button>

        <div className="absolute top-16 left-8 md:top-20 md:left-12 flex flex-col">
           <h1 className="text-xl font-bold tracking-widest uppercase flex items-center gap-2">
             <Sparkles className="w-5 h-5 fill-current" /> PROMPT-ENHANCER
           </h1>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm mx-auto"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-widest uppercase mb-1">Sign In</h2>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest leading-relaxed">
              Sign in to access the prompt engine.
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 border border-red-500/30 bg-red-500/5 flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span className="text-[10px] uppercase tracking-widest text-red-400 font-medium">{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-transparent border border-border p-2.5 text-xs outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/30 rounded-none lowercase"
                placeholder="you@example.com"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Password</label>
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-transparent border border-border p-2.5 text-xs outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/30 rounded-none"
                placeholder="••••••••••••"
                disabled={isLoading}
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              disabled={isLoading}
              className="w-full bg-foreground text-background border border-foreground p-3 text-xs font-bold uppercase tracking-widest hover:bg-background hover:text-foreground transition-all mt-2 flex items-center justify-between group rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing In..." : "Sign In"}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </form>

          <div className="my-5 flex items-center gap-4">
            <div className="h-px bg-border flex-1" />
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">OR CONTINUE WITH</span>
            <div className="h-px bg-border flex-1" />
          </div>

          <motion.button
            type="button"
            onClick={handleGoogleSignIn}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            disabled={isLoading}
            className="w-full bg-transparent text-foreground border border-border p-3 text-xs font-bold uppercase tracking-widest hover:border-foreground hover:bg-muted/30 transition-all flex items-center justify-center gap-3 rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <GoogleIcon /> Continue with Google
          </motion.button>

          <div className="mt-6 text-center">
            <button 
              type="button"
              onClick={onSwitchToSignUp}
              className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors underline decoration-border underline-offset-4 hover:decoration-foreground"
            >
              Don't have an account? Sign Up
            </button>
          </div>
        </motion.div>
      </div>

      {/* Right Column - Visual/Animation */}
      <AuthVisuals />
    </div>
  );
}
