import { useState, useMemo, useEffect } from "react";
import { Search, Filter, ChevronDown, ArrowRight, Info, Copy, Check, ChevronLeft, ChevronRight, Star, Trash2, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import { PromptHistory, PromptCategory } from "../types";
import { cn } from "../lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/Dialog";

type FilterType = PromptCategory | "All" | "Favorites";

const CATEGORIES: FilterType[] = [
  "All", "Favorites", "image generation", "video generation", "coding/web app", "marketing", "content writing", "UI/UX", "business", "research", "other"
];

const ITEMS_PER_PAGE = 4;

interface HistoryLogsProps {
  history: PromptHistory[];
  loading?: boolean;
  appState: string;
  onCopy: (text: string) => void;
  copiedPrompt: string | null;
  onToggleFavorite: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function HistoryLogs({ history, loading, appState, onCopy, copiedPrompt, onToggleFavorite, onDelete }: HistoryLogsProps) {
  const [selectedHistory, setSelectedHistory] = useState<PromptHistory | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<FilterType>("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const currentSelected = useMemo(() => {
    if (!selectedHistory) return null;
    return history.find(h => h.id === selectedHistory.id) || null;
  }, [history, selectedHistory]);

  const filteredHistory = useMemo(() => {
    return history.filter(item => {
      const matchesSearch = item.original.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.optimized.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesCategory = true;
      if (filterCategory === "Favorites") {
        matchesCategory = !!item.isFavorite;
      } else if (filterCategory !== "All") {
        matchesCategory = item.category === filterCategory;
      }
      
      return matchesSearch && matchesCategory;
    });
  }, [history, searchQuery, filterCategory]);

  const totalPages = Math.ceil(filteredHistory.length / ITEMS_PER_PAGE);
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredHistory.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredHistory, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterCategory]);

  // Pagination Logic
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <>
      <AnimatePresence>
        {(appState === "idle" || appState === "result") && (loading || history.length > 0) && (
          <motion.footer 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full border-t border-border bg-background/50 backdrop-blur-md mt-auto relative z-20"
          >
            <div className="max-w-7xl mx-auto p-8">
              <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-8 gap-6">
                 <div className="flex items-center gap-3">
                   <h2 className="text-xs uppercase tracking-widest font-bold text-muted-foreground whitespace-nowrap">Historical Logs</h2>
                   <span className="text-[10px] uppercase tracking-widest text-muted-foreground whitespace-nowrap">{filteredHistory.length} records</span>
                 </div>
                 
                 <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto">
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
                      <div className="relative w-full sm:w-52 flex items-center group">
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
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                                className="absolute bottom-full left-0 right-0 mb-1 bg-background border border-border shadow-2xl z-30 max-h-60 overflow-y-auto scrollbar-hide"
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

                    {/* Pagination - Improved with Ellipses */}
                    {totalPages > 1 && (
                      <div className="flex items-center gap-1.5 border-l border-border pl-4 h-8">
                        <button
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="p-1.5 border border-border hover:border-foreground transition-colors disabled:opacity-20 group"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        
                        <div className="flex items-center gap-1">
                          {getPageNumbers().map((page, i) => (
                            <button
                              key={i}
                              onClick={() => typeof page === "number" && setCurrentPage(page)}
                              disabled={typeof page !== "number"}
                              className={cn(
                                "w-7 h-7 text-[10px] font-bold transition-all border flex items-center justify-center",
                                currentPage === page 
                                  ? "bg-foreground text-background border-foreground" 
                                  : typeof page === "number"
                                    ? "bg-transparent text-muted-foreground border-border hover:border-foreground"
                                    : "border-transparent text-muted-foreground cursor-default"
                              )}
                            >
                              {page}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="p-1.5 border border-border hover:border-foreground transition-colors disabled:opacity-20 group"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                 </div>
              </div>
              
              {loading ? (
                <div className="flex items-center justify-center py-12 gap-3">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  <span className="text-xs text-muted-foreground uppercase tracking-widest">Loading history...</span>
                </div>
              ) : filteredHistory.length === 0 ? (
                <div className="text-center py-8 text-xs text-muted-foreground uppercase tracking-widest border border-dashed border-border">
                  No records match your filters.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {currentItems.map(item => (
                    <div
                      key={item.id}
                      className="group relative h-32"
                    >
                      <button
                        onClick={() => setSelectedHistory(item)}
                        className="w-full h-full text-left border border-border p-4 bg-background hover:border-foreground transition-colors relative overflow-hidden flex flex-col justify-between"
                      >
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-foreground/5 to-transparent translate-x-[-100%] group-hover:translate-x-[0%] transition-transform duration-500 ease-out" />
                        <div className="flex justify-between items-start mb-2 relative z-10">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/70 group-hover:text-foreground transition-colors">{item.category}</span>
                          
                          <div className="flex items-center gap-2">
                             <button
                               onClick={(e) => {
                                 e.stopPropagation();
                                 onToggleFavorite(item.id);
                               }}
                               className={cn(
                                 "p-1 transition-all",
                                 item.isFavorite ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                               )}
                             >
                               <Star className={cn("w-3.5 h-3.5", item.isFavorite && "fill-current")} />
                             </button>
                             {onDelete && (
                               <button
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   onDelete(item.id);
                                 }}
                                 className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
                                 title="Delete prompt"
                               >
                                 <Trash2 className="w-3.5 h-3.5" />
                               </button>
                             )}
                             <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                          </div>
                        </div>
                        <p className="text-xs line-clamp-2 text-foreground group-hover:text-foreground transition-colors mb-2 flex-grow relative z-10">"{item.original}"</p>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-auto relative z-10">{new Date(item.timestamp).toLocaleDateString()}</div>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.footer>
        )}
      </AnimatePresence>

      <Dialog open={!!currentSelected} onOpenChange={() => setSelectedHistory(null)}>
        <DialogContent showCloseButton={false} className="max-w-[95vw] sm:max-w-[90vw] lg:max-w-[1200px] w-full border-border bg-background rounded-none shadow-2xl p-0 gap-0 max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="p-6 border-b border-border bg-muted/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <DialogTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                  <Info className="w-4 h-4" /> Record Details
                </DialogTitle>
                {currentSelected && (
                  <button
                    onClick={() => onToggleFavorite(currentSelected.id)}
                    className={cn(
                      "flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors",
                      currentSelected.isFavorite ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Star className={cn("w-3 h-3", currentSelected.isFavorite && "fill-current")} />
                    {currentSelected.isFavorite ? "Favorited" : "Mark Favorite"}
                  </button>
                )}
              </div>
              {currentSelected && (
                <div className="flex items-center gap-3">
                  {onDelete && (
                    <button
                      onClick={() => {
                        onDelete(currentSelected.id);
                        setSelectedHistory(null);
                      }}
                      className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  )}
                  <span className="text-[10px] px-2 py-1 border border-border font-bold uppercase tracking-widest">
                    {currentSelected.category}
                  </span>
                  <button
                    onClick={() => setSelectedHistory(null)}
                    className="p-1.5 border border-border text-muted-foreground hover:border-foreground hover:text-foreground transition-colors ml-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {currentSelected && (
              <>
                <div className="space-y-2">
                  <h4 className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Raw Input</h4>
                  <div className="p-4 border border-border bg-muted/30 text-sm italic relative">
                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-muted-foreground/30" />
                    "{currentSelected.original}"
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold flex justify-between items-center">
                    <span>Generated Artifact</span>
                    <button 
                      onClick={() => onCopy(currentSelected.optimized)}
                      className="flex items-center gap-1.5 hover:text-foreground transition-colors text-muted-foreground w-24 justify-end"
                    >
                      {copiedPrompt === currentSelected.optimized ? (
                         <><Check className="w-3 h-3" /> COPIED</>
                      ) : (
                         <><Copy className="w-3 h-3" /> COPY</>
                      )}
                    </button>
                  </h4>
                  <div className="markdown-body">
                    <ReactMarkdown>{currentSelected.optimized}</ReactMarkdown>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
