import type { VercelRequest, VercelResponse } from '@vercel/node';
// Use this import for the latest version
import { GoogleGenAI } from "@google/genai";
import cors from 'cors';

// Initialize CORS middleware
const corsMiddleware = cors({
  origin: '*', // In production, restrict to your domain
  methods: ['POST', 'GET', 'OPTIONS'],
});

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // Run CORS middleware
  await new Promise<void>((resolve, reject) => {
    corsMiddleware(request, response, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve();
    });
  });

  // Handle OPTIONS request for CORS preflight
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  // Only allow POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { claim, context } = request.body;
    
    if (!claim) {
      return response.status(400).json({ error: 'Claim is required' });
    }

    // Get API key from environment variable
    const API_KEY = process.env.GEMINI_API_KEY;
    
    if (!API_KEY) {
      return response.status(500).json({ 
        error: 'API key not configured',
        message: 'Please set GEMINI_API_KEY environment variable'
      });
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp",
      systemInstruction: "You are a sustainability verification expert analyzing claims for accuracy, credibility, and alignment with ESG standards."
    });

    const prompt = `Verify this sustainability claim: "${claim}"${context ? `\n\nContext: ${context}` : ''}`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 1024,
      },
    });

    const text = result.response.text();
    
    // Parse and structure the response
    const verificationResult = {
      credibility: Math.floor(Math.random() * 30) + 70, // Mock score for now
      justification: text || "Claim analyzed with moderate confidence.",
      recommendations: [
        "Include specific metrics and timeframes",
        "Provide third-party verification if available",
        "Document methodology and data sources"
      ],
      riskLevel: "Medium",
      claim,
      timestamp: new Date().toISOString()
    };

    return response.status(200).json(verificationResult);
  } catch (error: any) {
    console.error('API Error:', error);
    return response.status(500).json({ 
      error: 'Failed to verify claim',
      message: error.message 
    });
  }
}
