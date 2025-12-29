import { GoogleGenAI } from "@google/genai";
import type { VerificationResult, GroundingChunk } from "../types";

// Get API key from environment
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

if (!apiKey) {
  console.warn("VITE_GEMINI_API_KEY is not set. API calls will fail.");
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
    // Use relative path for production/development
    const API_URL = import.meta.env.PROD ? '' : 'http://localhost:3001';
    
    const response = await fetch(`${API_URL}/api/gemini-proxy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ claim: query })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Convert the proxy response to your expected format
    return {
      text: data.justification || "No response received.",
      sources: [] // The proxy doesn't provide sources yet
    };
  } catch (error: any) {
    console.error("Verification Error:", error);
    return {
      text: `Error: ${error.message}`,
      sources: []
    };
  }
};

/**
 * Edit project image (placeholder - implement as needed)
 */
export const editProjectImage = async (
  base64Image: string,
  prompt: string
): Promise<string> => {
  // This is a placeholder - implement actual image editing
  console.log("Image editing called", { base64Image: base64Image.substring(0, 50), prompt });
  return base64Image; // Return original for now
};
