import { GoogleGenAI, Type } from "@google/genai";

// Ensure API key is present, checking multiple common environment variable patterns
// process.env.API_KEY: Standard for this preview environment
// import.meta.env.VITE_API_KEY: Standard for Vite
// process.env.REACT_APP_API_KEY: Standard for Create React App
const apiKey = PLEASEGOGRAPYOUROWNKEYANDSTOPBEINIGAWEIRDO

let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export interface AIAnalysisResult {
  items: {
    name: string;
    calories: number;
    protein: number;
    fat: number;
  }[];
  total_calories: number;
  total_protein: number;
  total_fat: number;
}

export const analyzeFoodText = async (text: string): Promise<AIAnalysisResult> => {
  if (!ai) {
    throw new Error("API Key not found. Please set VITE_API_KEY (if using Vite) or API_KEY in your environment.");
  }

  const modelId = "gemini-2.5-flash"; // Using Flash for speed

  const prompt = `
    Analyze the following food description and estimate the calories, protein (in grams), and fat (in grams).
    Return a breakdown of items and the totals. 
    Be realistic with estimation. If quantity isn't specified, assume a standard serving size.
    Input: "${text}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  calories: { type: Type.NUMBER },
                  protein: { type: Type.NUMBER },
                  fat: { type: Type.NUMBER }
                },
                required: ["name", "calories", "protein", "fat"]
              }
            },
            total_calories: { type: Type.NUMBER },
            total_protein: { type: Type.NUMBER },
            total_fat: { type: Type.NUMBER }
          },
          required: ["items", "total_calories", "total_protein", "total_fat"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No response from AI");

    return JSON.parse(resultText) as AIAnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
