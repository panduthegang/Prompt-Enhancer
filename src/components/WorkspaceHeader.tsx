import { useState, useRef, useEffect } from "react";
import { Sparkles, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AppUser } from "../hooks/useAuth";

interface WorkspaceHeaderProps {
  user: AppUser;
  onLogout: () => void;
}

export default function WorkspaceHeader({ user, onLogout }: WorkspaceHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Generic Profile Icon
  const ProfileIcon = () => (
    <div className="w-8 h-8 bg-muted border border-border flex items-center justify-center">
      <User className="w-4 h-4 text-muted-foreground" />
    </div>
  );

  // Actual Avatar (PFP or Fallback)
  const AvatarIcon = () => (
    user.photoURL ? (
      <img 
        src={user.photoURL} 
        alt={user.username}
        className="w-8 h-8 object-cover border border-border"
        referrerPolicy="no-referrer"
      />
    ) : (
      <ProfileIcon />
    )
  );

  return (
    <header className="fixed top-0 left-0 w-full p-4 sm:p-6 flex justify-between items-center z-50 bg-background/80 backdrop-blur-md border-b border-border sm:bg-transparent sm:backdrop-blur-none sm:border-b-0">
      <div className="flex flex-col">
         <h1 className="text-xl font-bold tracking-widest uppercase flex items-center gap-2">
           <Sparkles className="w-5 h-5 fill-current" /> PROMPT-ENHANCER
         </h1>
      </div>
      
      <div className="flex items-center gap-4 relative">
        
        {/* === DESKTOP LAYOUT === */}
        <div className="hidden sm:flex items-center gap-3 pr-4 border-r border-border">
           <AvatarIcon />
           <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest">{user.username}</span>
              <span className="text-[9px] uppercase tracking-widest text-muted-foreground">{user.email}</span>
           </div>
        </div>
        
        <button
          onClick={onLogout}
          className="hidden sm:flex p-2 border border-border hover:bg-foreground hover:text-background transition-colors rounded-none outline-none group"
          title="Disconnect"
        >
           <LogOut className="w-4 h-4 text-muted-foreground group-hover:text-background transition-colors" />
        </button>

        {/* === MOBILE LAYOUT === */}
        <div className="sm:hidden relative" ref={menuRef}>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex items-center justify-center focus:outline-none"
          >
            {/* Mobile Header Button: Always show generic ProfileIcon */}
            <ProfileIcon />
          </button>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute top-12 right-0 w-56 bg-background border border-border shadow-2xl z-50 flex flex-col"
              >
                <div className="flex items-center gap-3 p-4 border-b border-border/50">
                  {/* Mobile Popover: Show actual PFP or fallback */}
                  <AvatarIcon />
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-widest truncate" title={user.username}>
                      {user.username}
                    </span>
                    <span className="text-[9px] uppercase tracking-widest text-muted-foreground truncate" title={user.email}>
                      {user.email}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={onLogout}
                  className="w-full text-left p-4 flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-red-500/80 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Disconnect
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </header>
  );
}
