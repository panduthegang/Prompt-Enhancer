import { GoogleGenAI, Type } from "@google/genai";
import { IntentDetectionResult, EnhancementResult, PromptCategory } from "../types";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

const intentSchema = {
  type: Type.OBJECT,
  properties: {
    intent: {
      type: Type.STRING,
      description: "A short, concise summary of what the user wants to achieve."
    },
    category: {
      type: Type.STRING,
      description: "The category that best fits the prompt.",
      enum: ["image generation", "video generation", "coding/web app", "marketing", "content writing", "UI/UX", "business", "research", "other"]
    },
    cleanedInput: {
      type: Type.STRING,
      description: "The user's original input grammatically corrected and translated to English."
    },
    task: {
      type: Type.STRING,
      description: "The specific core task to be performed (e.g., 'Generate image', 'Write code', 'Create plan')."
    },
    domain: {
      type: Type.STRING,
      description: "The industry or field of expertise (e.g., 'Fitness', 'E-commerce', 'Cybersecurity')."
    },
    constraints: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of specific rules or limitations extracted from the input."
    },
    outputFormat: {
      type: Type.STRING,
      description: "The desired format of the AI output (e.g., 'Markdown table', 'React component', 'Bullet points')."
    },
    audience: {
      type: Type.STRING,
      description: "For content tasks, who is the content for? For creation/coding tasks, who are the intended users of the product being built (e.g. 'Productivity seekers', 'Fitness enthusiasts')."
    }
  },
  required: ["intent", "category", "cleanedInput", "task", "domain", "constraints", "outputFormat", "audience"]
};

export async function detectIntent(rawInput: string): Promise<IntentDetectionResult | null> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following raw user input. Extract the core intent and decompose it into the requested structure. Use professional terminology. 

CRITICAL: For 'audience', do not just put 'Developers' for coding tasks. Instead, identify who would actually use the resulting product (e.g. if building a to-do list, the audience is 'General users' or 'Task managers'). 

If a field is not explicitly specified, infer it logically from the context of the goal.\n\nRaw Input: "${rawInput}"`,
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
      action: "Create a highly optimized, professional, and token-efficient prompt for an AI model based on the decomposed intent data.",
      format: "Return a JSON object. The `optimizedPrompt` must be a high-quality Markdown string. Use a highly structured layout with explicit sections, bulleted lists, and bold text for emphasis. Use real newlines to separate sections.",
      guidelines: [
        "Structure the output with clear, professional headings based on the Task, Domain, and Audience.",
        "Ensure every Constraint is explicitly integrated into the prompt with technical depth.",
        "Use bolding (**text**) for section headers and key parameters to improve readability.",
        "Maximize 'Information Density': Eliminate conversational filler while retaining all necessary technical context and instructions.",
        "The final prompt must be comprehensive and ready for immediate professional use, avoiding over-simplification."
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
      contents: `Decomposed Data: ${JSON.stringify(intentData)}\n\nInstructions: ${JSON.stringify(promptInstructions)}\n\nGenerate the optimized prompt.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: enhancementSchema,
        temperature: 0.3,
      }
    });

    if (!response.text) return null;
    const responseData = JSON.parse(response.text) as EnhancementResult;

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
