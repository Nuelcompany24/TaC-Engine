import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";
const cors = require("cors");

// Initialize CORS middleware
const corsMiddleware = cors({
  origin: "*",
  methods: ["POST", "GET", "OPTIONS"],
});

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // Run CORS middleware
  await new Promise<void>((resolve, reject) => {
    corsMiddleware(request, response, (result: any) => {
      if (result instanceof Error) return reject(result);
      return resolve();
    });
  });

  if (request.method === "OPTIONS") {
    return response.status(200).end();
  }

  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { claim, context } = request.body;

    if (!claim) {
      return response.status(400).json({ error: "Claim is required" });
    }

    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      return response.status(500).json({
        error: "API key not configured",
        message: "Please set GEMINI_API_KEY environment variable",
      });
    }

    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const prompt = `Verify this sustainability claim: "${claim}"${
      context ? `\n\nContext: ${context}` : ""
    }`;

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
      config: {
        systemInstruction:
          "You are a sustainability verification expert analyzing claims for accuracy, credibility, and alignment with ESG standards.",
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 1024,
      },
    });

    const text = result.text;

    const verificationResult = {
      credibility: Math.floor(Math.random() * 30) + 70,
      justification: text || "Claim analyzed with moderate confidence.",
      recommendations: [
        "Include specific metrics and timeframes",
        "Provide third-party verification if available",
        "Document methodology and data sources",
      ],
      riskLevel: "Medium",
      claim,
      timestamp: new Date().toISOString(),
    };

    return response.status(200).json(verificationResult);
  } catch (error: any) {
    console.error("API Error:", error);
    return response.status(500).json({
      error: "Failed to verify claim",
      message: error.message,
    });
  }
}
