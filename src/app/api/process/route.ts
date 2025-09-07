import { NextRequest, NextResponse } from "next/server";
import { extractTextFromFile, cleanExtractedText } from "@/lib/extractors";
import { summarizeWithGemini } from "@/lib/gemini";

export const runtime = "nodejs"; // Needed for pdf-parse and mammoth

interface ProcessResponse {
  language: string;
  summary: string;
  prompt: string;
  meta?: Record<string, unknown>;
}

async function readTextOrFile(req: NextRequest): Promise<{ text: string; meta?: Record<string, unknown> }>{
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData();

    const file = form.get("file");
    const text = form.get("text");

    if (file instanceof File) {
      const { text: raw, meta } = await extractTextFromFile(file);
      const cleaned = cleanExtractedText(raw);
      if (!cleaned) throw new Error("Uploaded file contained no extractable text");
      return { text: cleaned, meta };
    }
    if (typeof text === "string" && text.trim().length > 0) {
      return { text: cleanExtractedText(text) };
    }
    throw new Error("Provide a PDF/DOCX/TXT file or non-empty text field");
  }

  // Handle raw JSON with { text: string }
  if (contentType.includes("application/json")) {
    const body = await req.json().catch(() => null) as { text?: string } | null;
    const raw = body?.text ?? "";
    const cleaned = cleanExtractedText(raw);
    if (!cleaned) throw new Error("Empty text body");
    return { text: cleaned };
  }

  throw new Error("Unsupported content type. Use multipart/form-data or application/json");
}

export async function POST(req: NextRequest) {
  try {
    const { text, meta } = await readTextOrFile(req);

    const { language, summary } = await summarizeWithGemini(text, {
      maxWords: 100,
      languageHint: "English",
    });

    const response: ProcessResponse = {
      language,
      summary,
      prompt: `Generate a 30-second multilingual video with captions and narration about: ${summary}`,
      meta,
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}


