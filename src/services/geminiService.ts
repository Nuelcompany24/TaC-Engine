// src/services/geminiService.ts
import { GoogleGenAI } from "@google/genai";
import type { VerificationResult, GroundingChunk } from "../types";

// Get API key from environment
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

// Initialize client
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

/**
 * Verify sustainability claim with search grounding
 */
export const verifySustainabilityClaim = async (
  query: string
): Promise<VerificationResult> => {
  try {
    // In production, use Vercel serverless function
    // In development, use local server or mock
    const isProd = import.meta.env.PROD;
    const baseURL = isProd ? '' : 'http://localhost:3001';
    
    const response = await fetch(`${baseURL}/api/gemini-proxy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        claim: query,
        context: "Please verify this sustainability claim with recent data and provide credible sources."
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Convert the proxy response to your expected format
    return {
      text: data.justification || data.message || "No verification response received.",
      sources: [] // The proxy doesn't provide sources yet, but you could map them
    };
  } catch (error: any) {
    console.error("Verification Error:", error);
    return {
      text: `Error: ${error.message || "Network or server error. Please try again."}`,
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
  try {
    // For now, return a mock image or the original
    console.log("Image editing called", { prompt, imageSize: base64Image.length });
    
    // If you have an image editing API, implement it here
    // For now, return a placeholder
    return base64Image; // Return original as placeholder
  } catch (error: any) {
    console.error("Image Edit Error:", error);
    throw new Error(`Image edit failed: ${error.message}`);
  }
};
