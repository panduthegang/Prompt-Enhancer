import { GoogleGenAI, Type } from "@google/genai";
import { IntentDetectionResult, EnhancementResult, PromptCategory } from "../types";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

const intentSchema = {
  type: Type.OBJECT,
  properties: {
    intent: {
      type: Type.STRING,
      description: "A short, concise summary of what the user wants to achieve (e.g., 'Generate an image of a futuristic city' or 'Write a polite email to a client')."
    },
    category: {
      type: Type.STRING,
      description: "The category that best fits the prompt.",
      enum: ["image generation", "video generation", "coding/web app", "marketing", "content writing", "UI/UX", "business", "research", "other"]
    },
    cleanedInput: {
      type: Type.STRING,
      description: "The user's original input grammatically corrected, translated to English if necessary, with filler words removed."
    }
  },
  required: ["intent", "category", "cleanedInput"]
};

export async function detectIntent(rawInput: string): Promise<IntentDetectionResult | null> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following raw user input. It might be messy, multilingual, or in Hinglish. Extract the core intent, categorize it, and provide a cleaned version of the input in English.\n\nRaw Input: "${rawInput}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: intentSchema,
        temperature: 0.1,
      }
    });

    if (!response.text) return null;
    return JSON.parse(response.text) as IntentDetectionResult;
  } catch (error) {
    console.error("Error detecting intent:", error);
    return null;
  }
}

export async function enhancePrompt(intentData: IntentDetectionResult): Promise<EnhancementResult | null> {
  try {
    const promptInstructions = {
      action: "Create a highly optimized, professional, and token-efficient prompt for an AI model based on the provided intent and cleaned input.",
      format: "Return a JSON object. The `optimizedPrompt` must be a high-quality Markdown string. Use a highly structured layout with explicit sections (e.g., '### Subject', '### Environment', etc.), bulleted lists, and bold text for emphasis. Ensure it looks professional and is ready for immediate use in AI models. Use real newlines to separate sections and paragraphs.",
      guidelines: [
        "Structure the output with clear headings and logical groupings based on the category.",
        "Ensure the Markdown is correctly formatted so it renders across multiple lines naturally.",
        "Use bolding (**text**) for section headers and key parameters.",
        "Maintain a professional, clean, and high-signal tone.",
        "Avoid any meta-commentary; only output the prompt itself within the `optimizedPrompt` field."
      ]
    };

    const enhancementSchema = {
      type: Type.OBJECT,
      properties: {
        optimizedPrompt: {
          type: Type.STRING,
          description: "The final, highly optimized prompt string ready to be copy-pasted into an AI tool."
        },
        originalTokens: {
          type: Type.NUMBER,
          description: "Estimated number of tokens of the original cleaned input."
        },
        optimizedTokens: {
          type: Type.NUMBER,
          description: "Estimated number of tokens of the highly optimized prompt."
        }
      },
      required: ["optimizedPrompt", "originalTokens", "optimizedTokens"]
    };

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Intent: ${intentData.intent}\nCategory: ${intentData.category}\nCleaned Input: ${intentData.cleanedInput}\n\nInstructions: ${JSON.stringify(promptInstructions)}\n\nGenerate the optimized prompt.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: enhancementSchema,
        temperature: 0.3,
      }
    });

    if (!response.text) return null;
    const responseData = JSON.parse(response.text) as EnhancementResult;
    
    // Post-processing: Ensure literal '\n' strings are converted to real newlines
    // and cleanup potential double-escaped characters
    if (responseData.optimizedPrompt) {
      responseData.optimizedPrompt = responseData.optimizedPrompt
        .replace(/\\n/g, '\n')
        .replace(/\\"/g, '"');
    }
    
    return responseData;
  } catch (error) {
    console.error("Error enhancing prompt:", error);
    return null;
  }
}
