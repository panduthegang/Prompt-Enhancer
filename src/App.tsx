import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";

import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Workspace from "./pages/Workspace";
import LandingPage from "./pages/LandingPage";

// Wrapper to handle animations between routes
function AnimatedRoutes() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<{ username: string, email: string } | null>(() => {
    const saved = localStorage.getItem("auth_user");
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (userData: { username: string, email: string }) => {
    setUser(userData);
    localStorage.setItem("auth_user", JSON.stringify(userData));
    navigate("/workspace");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
    navigate("/");
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LandingPage onGetStarted={() => navigate("/signin")} />
          </motion.div>
        } />
        
        <Route path="/signin" element={
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <SignIn onLogin={handleLogin} onSwitchToSignUp={() => navigate("/signup")} />
          </motion.div>
        } />
        
        <Route path="/signup" element={
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <SignUp onLogin={handleLogin} onSwitchToSignIn={() => navigate("/signin")} />
          </motion.div>
        } />
        
        <Route path="/workspace" element={
          user ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col w-full h-full min-h-screen">
              <Workspace user={user} onLogout={handleLogout} />
            </motion.div>
          ) : (
            <Navigate to="/signin" replace />
          )
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen font-mono text-foreground overflow-x-hidden selection:bg-foreground selection:text-background flex flex-col">
        {/* Background with Fade */}
        <div className="fixed inset-0 z-[-2] bg-background" />
        <div className="fixed inset-0 z-[-1] bg-grid-pattern" />
        <div className="fixed inset-0 z-[-1] bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />

        <AnimatedRoutes />
      </div>
    </BrowserRouter>
  );
}
