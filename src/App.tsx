import { motion, AnimatePresence } from "motion/react";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";

import { AuthProvider, useAuth } from "./hooks/useAuth";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Workspace from "./pages/Workspace";
import LandingPage from "./pages/LandingPage";

// Loading screen while Firebase resolves auth state
function AuthLoader() {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="text-center space-y-4">
        <div className="w-8 h-8 border-2 border-foreground border-t-transparent animate-spin mx-auto" />
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-bold">Authenticating</p>
      </div>
    </div>
  );
}

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <AuthLoader />;
  if (!user) return <Navigate to="/signup" replace />;

  return <>{children}</>;
}

// Redirect away from auth pages if already logged in
function GuestRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <AuthLoader />;
  if (user) return <Navigate to="/workspace" replace />;

  return <>{children}</>;
}

function AnimatedRoutes() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LandingPage onGetStarted={async () => {
              await logout();
              navigate("/signup");
            }} />
          </motion.div>
        } />
        
        <Route path="/signin" element={
          <GuestRoute>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <SignIn onSwitchToSignUp={() => navigate("/signup")} />
            </motion.div>
          </GuestRoute>
        } />
        
        <Route path="/signup" element={
          <GuestRoute>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <SignUp onSwitchToSignIn={() => navigate("/signin")} />
            </motion.div>
          </GuestRoute>
        } />
        
        <Route path="/workspace" element={
          <ProtectedRoute>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col w-full h-full min-h-screen">
              <Workspace onLogout={handleLogout} />
            </motion.div>
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="relative min-h-screen font-mono text-foreground overflow-x-hidden selection:bg-foreground selection:text-background flex flex-col">
          <div className="fixed inset-0 z-[-2] bg-background" />
          <div className="fixed inset-0 z-[-1] bg-grid-pattern" />
          <div className="fixed inset-0 z-[-1] bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />

          <AnimatedRoutes />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
