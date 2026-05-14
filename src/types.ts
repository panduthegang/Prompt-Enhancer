export type PromptCategory = 
  | "image generation"
  | "video generation"
  | "coding/web app"
  | "marketing"
  | "content writing"
  | "UI/UX"
  | "business"
  | "research"
  | "other";

export interface IntentDetectionResult {
  intent: string;
  category: PromptCategory;
  cleanedInput: string;
}

export interface EnhancementResult {
  optimizedPrompt: string;
  originalTokens: number;
  optimizedTokens: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  type?: "text" | "intent-confirmation" | "optimization-result";
  intentData?: IntentDetectionResult;
  enhancementData?: EnhancementResult;
}

export interface PromptHistory {
  id: string;
  timestamp: number;
  original: string;
  optimized: string;
  category: PromptCategory;
}
