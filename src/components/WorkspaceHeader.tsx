import { Sparkles, User, LogOut } from "lucide-react";

interface WorkspaceHeaderProps {
  user: { username: string, email: string };
  onLogout: () => void;
}

export default function WorkspaceHeader({ user, onLogout }: WorkspaceHeaderProps) {
  return (
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
          onClick={onLogout}
          className="p-2 border border-border hover:bg-foreground hover:text-background transition-colors rounded-none outline-none group"
          title="Disconnect"
        >
           <LogOut className="w-4 h-4 text-muted-foreground group-hover:text-background transition-colors" />
        </button>
      </div>
    </header>
  );
}
