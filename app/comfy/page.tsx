"use client";

import React, { useEffect, useState } from "react";

type ComfySendResponse = {
  ok: boolean;
  status: number;
  contentType?: string;
  json?: any;
  text?: string | null;
};

type ComfyResultResponse = {
  ok: boolean;
  status: number;
  jobStatus?: string;
  images?: string[];
  raw?: any;
  error?: string;
};

export default function ComfyTesterPage() {
  const [prompt, setPrompt] = useState("girl on couch");
  const [sending, setSending] = useState(false);
  const [polling, setPolling] = useState(false);

  const [promptId, setPromptId] = useState<string | null>(null);
  const [lastSendResponse, setLastSendResponse] =
    useState<ComfySendResponse | null>(null);
  const [lastResult, setLastResult] =
    useState<ComfyResultResponse | null>(null);

  // Auto-poll when we have a promptId
  useEffect(() => {
    if (!promptId) return;

    let cancelled = false;
    setPolling(true);

    const poll = async () => {
      try {
        const res = await fetch(
          `/api/affiliate/click/comfy/result?prompt_id=${encodeURIComponent(
            promptId
          )}`
        );
        const data = (await res.json()) as ComfyResultResponse;
        if (cancelled) return;

        setLastResult(data);

        const status = data.jobStatus?.toLowerCase() ?? "";
        const hasImages = !!data.images && data.images.length > 0;

        if (status.includes("completed") || hasImages) {
          setPolling(false);
          return;
        }

        // Not done yet → poll again in 2s
        setTimeout(poll, 2000);
      } catch (err) {
        if (cancelled) return;
        console.error("Polling error:", err);
        setPolling(false);
      }
    };

    poll();

    return () => {
      cancelled = true;
    };
  }, [promptId]);

  async function handleSend() {
    try {
      setSending(true);
      setLastResult(null);
      setPromptId(null);

      const res = await fetch("/api/affiliate/click/comfy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = (await res.json()) as ComfySendResponse;
      setLastSendResponse(data);

      const pid: string | undefined = data?.json?.prompt_id;
      if (pid) {
        setPromptId(pid);
      } else {
        console.warn("No prompt_id returned from /comfy");
      }
    } catch (err) {
      console.error("Error sending prompt:", err);
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <p className="text-xs tracking-[0.25em] uppercase text-cyan-400 mb-1">
            Cyber Dev → ComfyUI Tester
          </p>
          <h1 className="text-2xl font-semibold mb-2">ComfyUI Tester</h1>
          <p className="text-sm text-slate-400">
            Send a prompt to the Comfy proxy in production and automatically
            poll ComfyUI for the result. When the job finishes, any generated
            images will appear below.
          </p>
        </div>

        {/* Prompt + button */}
        <div className="space-y-3 bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <label className="block text-xs font-medium text-slate-300">
            Prompt
          </label>
          <textarea
            className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-slate-100 resize-vertical min-h-[60px]"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <button
            onClick={handleSend}
            disabled={sending}
            className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-cyan-500 text-slate-950 text-sm font-semibold disabled:opacity-60"
          >
            {sending ? "Sending to Comfy..." : "Generate via Comfy"}
          </button>

          {promptId && (
            <p className="text-xs text-slate-400 mt-1">
              <span className="font-mono text-[11px]">prompt_id:</span>{" "}
              <span className="font-mono text-[11px]">{promptId}</span>{" "}
              {polling && (
                <span className="ml-1 text-cyan-300">(waiting for result…)</span>
              )}
            </p>
          )}
        </div>

        {/* Generated images */}
        {lastResult?.images && lastResult.images.length > 0 && (
          <div className="space-y-3 bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <h2 className="text-sm font-semibold text-slate-100">
              Generated Images
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {lastResult.images.map((src, i) => (
                <div
                  key={i}
                  className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-950"
                >
                  <img
                    src={src}
                    alt={`Comfy output ${i + 1}`}
                    className="w-full h-auto object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Raw JSON inspection */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <h2 className="text-xs font-semibold text-slate-200 mb-2">
              Last Send → /api/affiliate/click/comfy
            </h2>
            <pre className="text-[11px] leading-snug bg-slate-950 border border-slate-800 rounded-md p-2 overflow-auto max-h-64">
              {lastSendResponse
                ? JSON.stringify(lastSendResponse, null, 2)
                : "// No request yet"}
            </pre>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <h2 className="text-xs font-semibold text-slate-200 mb-2">
              Last Result → /api/affiliate/click/comfy/result
            </h2>
            <pre className="text-[11px] leading-snug bg-slate-950 border border-slate-800 rounded-md p-2 overflow-auto max-h-64">
              {lastResult ? JSON.stringify(lastResult, null, 2) : "// No result yet"}
            </pre>
          </div>
        </div>
      </div>
    </main>
  );
}
