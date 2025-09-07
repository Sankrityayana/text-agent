// Text extraction utilities for PDF, DOCX, and TXT
// Keep the API minimal and typed for easy reuse across routes/services

import type { Readable } from "stream";

export type SupportedMime =
  | "application/pdf"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  | "text/plain";

export interface ExtractionResult {
  text: string;
  meta?: Record<string, unknown>;
}

// Lazy imports to avoid loading heavy libs until needed
async function extractPdf(buffer: Buffer): Promise<ExtractionResult> {
  const pdfParse = (await import("pdf-parse")).default as unknown as (
    dataBuffer: Buffer
  ) => Promise<{ text: string; info?: Record<string, unknown> }>;
  const result = await pdfParse(buffer);
  return { text: result.text ?? "", meta: result.info };
}

async function extractDocx(buffer: Buffer): Promise<ExtractionResult> {
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ buffer });
  return { text: result.value ?? "" };
}

async function extractTxt(buffer: Buffer): Promise<ExtractionResult> {
  return { text: buffer.toString("utf-8") };
}

export async function extractTextFromFile(
  file: File
): Promise<ExtractionResult> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const mime = file.type as SupportedMime | string;
  const name = file.name.toLowerCase();

  if (mime === "application/pdf" || name.endsWith(".pdf")) {
    return extractPdf(buffer);
  }
  if (
    mime ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    name.endsWith(".docx")
  ) {
    return extractDocx(buffer);
  }
  if (mime === "text/plain" || name.endsWith(".txt")) {
    return extractTxt(buffer);
  }
  throw new Error(
    "Unsupported file type. Please upload a PDF, DOCX, or TXT file."
  );
}

export function cleanExtractedText(input: string): string {
  // Basic normalization/cleanup to reduce noisy whitespace
  return input
    .replace(/\u0000/g, " ")
    .replace(/[\t\r]+/g, " ")
    .replace(/[ ]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}


