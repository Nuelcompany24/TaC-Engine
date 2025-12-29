// src/services/geminiService.ts
import { GoogleGenAI } from "@google/genai"; // Keep this – it's the correct current SDK
import { VerificationResult, GroundingChunk } from "../types";

// Get API key the Vite way
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

if (!apiKey) {
  console.error("VITE_GEMINI_API_KEY is missing! Check your .env file.");
  throw new Error("API key not configured");
}

// Initialize client
const ai = new GoogleGenAI({ apiKey });

/**
 * Verify sustainability claim with search grounding
 */
export const verifySustainabilityClaim = async (
  query: string
): Promise<VerificationResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // UPDATED: Current stable fast model (Dec 2025)
      contents: `Verify this sustainability claim using recent data: "${query}". 
      Provide a concise summary and list key sources.`,
      toolConfig: { googleSearchRetrieval: {} }, // Enables grounding
    });

    const text = response.text ?? "No response text.";

    // Extract sources
    const groundingChunks = response.candidates?.[0]?.groundingMetadata
      ?.groundingChunks as GroundingChunk[] | undefined;

    const sources =
      groundingChunks
        ?.map((chunk) => ({
          uri: chunk.web?.uri ?? "",
          title: chunk.web?.title ?? "Unknown Source",
        }))
        .filter((s) => s.uri) ?? [];

    const uniqueSources = Array.from(
      new Map(sources.map((s) => [s.uri, s])).values()
    );

    return { text, sources: uniqueSources };
  } catch (error: any) {
    console.error("Verification Error:", error);
    throw new Error(`Verification failed: ${error.message || "Unknown error"}`);
  }
};

/**
 * Edit project image (note: gemini-2.5-flash supports basic image input/editing)
 */
export const editProjectImage = async (
  base64Image: string,
  prompt: string
): Promise<string> => {
  try {
    const mimeType = base64Image.startsWith("data:image/png")
      ? "image/png"
      : "image/jpeg";
    const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Same model works for image tasks
      contents: [
        { inlineData: { data: cleanBase64, mimeType } },
        { text: prompt },
      ],
    });

    const parts = response.candidates?.[0]?.content?.parts ?? [];
    for (const part of parts) {
      if (part.inlineData?.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image returned");
  } catch (error: any) {
    console.error("Image Edit Error:", error);
    throw new Error(`Image edit failed: ${error.message}`);
  }
};
