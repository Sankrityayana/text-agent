"use client";

import { useState } from "react";
import type { ProcessOutput } from "@/types";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [result, setResult] = useState<ProcessOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      let res: Response;
      if (file) {
        const form = new FormData();
        form.append("file", file);
        if (text.trim()) form.append("text", text.trim());
        res = await fetch("/api/process", { method: "POST", body: form });
      } else {
        res = await fetch("/api/process", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Request failed");
      setResult(data as ProcessOutput);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold">Text → Prompt Agent</h1>
        <p className="mt-1 text-sm text-neutral-400">PIB Multilingual Text-to-Video</p>

        <div className="mt-8 space-y-6">
          <div>
            <label className="block text-sm mb-2">Upload file (PDF, DOCX, TXT)</label>
            <input
              type="file"
              accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
              className="block w-full rounded border border-neutral-800 bg-neutral-900 p-2 text-sm"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Or paste text</label>
            <textarea
              className="block w-full min-h-[160px] resize-y rounded border border-neutral-800 bg-neutral-900 p-3 text-sm leading-6"
              placeholder="Paste or type your text..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSubmit}
              disabled={loading || (!file && !text.trim())}
              className="inline-flex items-center rounded bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-500 disabled:opacity-50"
            >
              {loading ? "Processing..." : "Process"}
            </button>
            {error && <span className="text-sm text-red-400">{error}</span>}
          </div>

          <div>
            <label className="block text-sm mb-2">Output</label>
            <pre className="whitespace-pre-wrap rounded border border-neutral-800 bg-neutral-900 p-3 text-xs leading-6">
{result ? JSON.stringify(result, null, 2) : "No result yet."}
            </pre>
          </div>
        </div>
      </div>
    </main>
  );
}
