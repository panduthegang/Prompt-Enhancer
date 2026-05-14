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
      format: "Return a JSON object. For the `optimizedPrompt` string, YOU MUST USE PROPER MULTILINE MARKDOWN WITH ACTUAL NEWLINES (\\n). Structure the prompt strictly based on sections relevant to the category. For example, a UI/UX prompt might have: 'Style:', 'Layout:', 'Hero Section:', 'Sections to include:', 'Design Direction:', 'Visual Elements:', 'UX Requirements:', 'Output:'. An Image Generation prompt might use: 'Subject:', 'Environment:', 'Lighting:', 'Camera/Lens:', 'Style/Medium:', 'Parameters:'. ALWAYS use clear headings, bullet points, and parameters. DO NOT output as a single paragraph.",
      guidelines: [
        "Use actual newline characters (\\n) in the string to ensure the Markdown is correctly formatted spanning multiple lines.",
        "Ensure the output uses proper Markdown formatting without errant asterisks. Use **bold** strictly for emphasis.",
        "Use a highly structured layout with explicit sections, lists, and key-value pairs (like the example templates).",
        "Be concise and high-signal, eliminate all filler words.",
        "Ensure compatibility with state-of-the-art AI systems like ChatGPT, Gemini, Claude, Midjourney, etc., adapting styling based on the category."
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
      model: "gemini-3.1-pro-preview",
      contents: `Intent: ${intentData.intent}\nCategory: ${intentData.category}\nCleaned Input: ${intentData.cleanedInput}\n\nInstructions: ${JSON.stringify(promptInstructions)}\n\nGenerate the optimized prompt.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: enhancementSchema,
        temperature: 0.3,
      }
    });

    if (!response.text) return null;
    return JSON.parse(response.text) as EnhancementResult;
  } catch (error) {
    console.error("Error enhancing prompt:", error);
    return null;
  }
}
