import { PromptCategory } from "../types";

const EXAMPLES: { category: PromptCategory, text: string }[] = [
  { category: "image generation", text: "A futuristic city skyline at sunset with flying cars, cyberpunk style" },
  { category: "coding/web app", text: "Create a functional React to-do list app with Tailwind CSS and local storage" },
  { category: "marketing", text: "High-converting Facebook ad copy for a new eco-friendly water bottle" },
  { category: "UI/UX", text: "landing page wireframe for a SaaS dashboard focusing on data analytics" },
];

interface InspirationGridProps {
  onSelect: (text: string) => void;
}

export default function InspirationGrid({ onSelect }: InspirationGridProps) {
  return (
    <div className="w-full max-w-4xl">
      <h3 className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-4 text-center">Inspiration</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {EXAMPLES.map((example, i) => (
          <button
            key={i}
            onClick={() => onSelect(example.text)}
            className="text-left border border-border p-4 bg-background hover:border-foreground transition-colors group relative h-32 flex flex-col items-start gap-2"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-foreground/70 group-hover:text-foreground transition-colors">{example.category}</span>
            <p className="text-xs line-clamp-3 text-foreground/90 group-hover:text-foreground transition-colors relative z-10 leading-relaxed">"{example.text}"</p>
          </button>
        ))}
      </div>
    </div>
  );
}
