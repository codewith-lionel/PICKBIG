import axios from "axios";
import { env } from "../config/env.js";
import { AppError } from "../utils/errors.js";

interface GeminiOpts {
  model?: string;
  retries?: number;
}

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractJson(payload: string): string {
  const trimmed = payload.trim();
  const jsonStart = trimmed.indexOf("{");
  const jsonEnd = trimmed.lastIndexOf("}");

  if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
    throw new AppError(502, "Gemini returned malformed JSON");
  }

  return trimmed.slice(jsonStart, jsonEnd + 1);
}

export async function callGeminiJSON(prompt: string, opts: GeminiOpts = {}) {
  const retries = opts.retries ?? 3;
  const model = opts.model ?? env.GEMINI_MODEL_FAST;
  let lastError: unknown;

  for (let attempt = 0; attempt < retries; attempt += 1) {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`,
        {
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        },
        { timeout: 20000 }
      );

      const text =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        response.data?.candidates?.[0]?.output ||
        "";

      if (!text) {
        throw new AppError(502, "Gemini returned empty response");
      }

      return JSON.parse(extractJson(text));
    } catch (error: any) {
      lastError = error;
      const status = error?.response?.status;
      if (status !== 429 && attempt >= retries - 1) {
        break;
      }

      const backoff = Math.min(15000, 2 ** attempt * 1000);
      await delay(backoff);
    }
  }

  throw new AppError(503, `Gemini unavailable: ${String((lastError as Error)?.message ?? lastError)}`);
}
