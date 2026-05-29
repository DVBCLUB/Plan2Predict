import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "ledgerflow-studio-sandbox",
        },
      },
    });
  }
  return aiClient;
}

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

function getNumberEnv(name: string, fallback: number): number {
  const raw = Number(process.env[name]);
  return Number.isFinite(raw) && raw > 0 ? raw : fallback;
}

function getClientIp(req: express.Request): string {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string" && forwardedFor.length > 0) {
    return forwardedFor.split(",")[0].trim();
  }
  return req.ip || req.socket.remoteAddress || "unknown";
}

function geminiRateLimit(req: express.Request, res: express.Response, next: express.NextFunction) {
  const windowMs = getNumberEnv("RATE_LIMIT_WINDOW_MS", 60_000);
  const maxRequests = getNumberEnv("RATE_LIMIT_MAX_REQUESTS", 20);
  const now = Date.now();
  const key = getClientIp(req);
  const current = rateLimitStore.get(key);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return next();
  }

  if (current.count >= maxRequests) {
    return res.status(429).json({
      error: "Too many AI requests. Please wait a moment and try again.",
      retryAfterMs: Math.max(0, current.resetAt - now),
    });
  }

  current.count += 1;
  return next();
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const MAX_PROMPT_LENGTH = getNumberEnv("MAX_PROMPT_LENGTH", 12_000);

  app.use(express.json({ limit: "1mb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", time: new Date(), model: GEMINI_MODEL });
  });

  app.post("/api/gemini/generate", geminiRateLimit, async (req, res) => {
    try {
      const { prompt, systemInstruction } = req.body;
      if (!prompt || typeof prompt !== "string") {
        return res.status(400).json({ error: "Prompt is required." });
      }

      if (prompt.length > MAX_PROMPT_LENGTH) {
        return res.status(413).json({
          error: `Prompt is too long. Maximum allowed length is ${MAX_PROMPT_LENGTH} characters.`,
        });
      }

      if (systemInstruction && typeof systemInstruction !== "string") {
        return res.status(400).json({ error: "systemInstruction must be a string when provided." });
      }

      if (systemInstruction && systemInstruction.length > 4_000) {
        return res.status(413).json({ error: "systemInstruction is too long." });
      }

      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY") {
        return res.status(400).json({
          error: "GEMINI_API_KEY is missing. Please configure it in your environment variables.",
          isMissingKey: true,
        });
      }

      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: systemInstruction ? { systemInstruction } : undefined,
      });

      res.json({ success: true, text: response.text });
    } catch (err: any) {
      console.error("Gemini Error:", err);
      res.status(500).json({ error: err.message || "An error occurred during generation." });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
