// Google Gemini client util
// Encapsulates summarization/paraphrasing with a stable, typed interface

import { GoogleGenerativeAI } from "@google/generative-ai";

export interface SummarizeOptions {
  maxWords?: number;
  languageHint?: string; // e.g., "English"; model will infer if omitted
}

export interface SummarizeResult {
  language: string;
  summary: string;
}

const DEFAULT_MAX_WORDS = 100;

export async function summarizeWithGemini(
  text: string,
  options: SummarizeOptions = {}
): Promise<SummarizeResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const maxWords = options.maxWords ?? DEFAULT_MAX_WORDS;
  const languageHint = options.languageHint ? ` in ${options.languageHint}` : "";

  const prompt = `Summarize this PIB press release${languageHint} in under ${maxWords} words with a clear, press-release style tone. Return only the summary without preface or notes.\n\nTEXT:\n${text}`;

  const result = await model.generateContent(prompt);
  const summary = result.response.text().trim();

  // Best-effort to infer language if user did not provide one
  const inferredLanguage = options.languageHint ?? "English";

  return { language: inferredLanguage, summary };
}


