import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY as string,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

app.use(express.json());

// Market Research API Endpoint
app.post("/api/analyze", async (req, res) => {
  const { idea } = req.body;

  if (!idea) {
    return res.status(400).json({ error: "Idea is required" });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Perform a deep market research and business idea analysis for the following idea: "${idea}". 
      Provide specific data points for market size, a list of potential competitors, a SWOT analysis, and target audience segments.
      IMPORTANT: Be consistent. If this is a repeat analysis for the same idea, ensure the numerical market data and strategic points are stable and grounded in realistic industry estimates.`,
      config: {
        responseMimeType: "application/json",
        generationConfig: {
          temperature: 0,
          topP: 1,
          topK: 1,
        },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            marketSize: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  year: { type: Type.STRING },
                  value: { type: Type.NUMBER, description: "Market value in Billions USD" }
                },
                required: ["year", "value"]
              }
            },
            competitors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  strength: { type: Type.STRING },
                  weakness: { type: Type.STRING }
                },
                required: ["name", "strength", "weakness"]
              }
            },
            swot: {
              type: Type.OBJECT,
              properties: {
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                threats: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["strengths", "weaknesses", "opportunities", "threats"]
            },
            targetAudience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  segment: { type: Type.STRING },
                  size: { type: Type.STRING, description: "Small, Medium, Large" },
                  painPoint: { type: Type.STRING }
                },
                required: ["segment", "size", "painPoint"]
              }
            },
            recommendation: { type: Type.STRING }
          },
          required: ["title", "summary", "marketSize", "competitors", "swot", "targetAudience", "recommendation"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Gemini Error:", error);
    const errorMessage = error?.status === "UNAVAILABLE" 
      ? "The AI model is currently experiencing high demand. Please try again in a few moments."
      : "Failed to analyze idea. Please try again later.";
    res.status(error?.status === "UNAVAILABLE" ? 503 : 500).json({ error: errorMessage });
  }
});

// Vite middleware setup
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

setupVite();
