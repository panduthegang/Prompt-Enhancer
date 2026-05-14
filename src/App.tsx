import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Workspace from "./pages/Workspace";

export default function App() {
  const [user, setUser] = useState<{ username: string, email: string } | null>(null);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

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
            <Workspace user={user} onLogout={() => setUser(null)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
