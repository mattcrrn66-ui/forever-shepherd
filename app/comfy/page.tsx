"use client";

import React, { useState } from "react";

export default function ComfyTesterPage() {
  const [prompt, setPrompt] = useState("girl on couch");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string>(""); // pretty-printed response

  async function handleGenerate() {
    setLoading(true);
    setOutput("");

    try {
      const res = await fetch("/api/affiliate/click/comfy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      let data: any;
      try {
        data = await res.json(); // always JSON from our route
      } catch (e) {
        // If somehow it still isn't JSON, show a friendly message instead of blowing up
        const raw = await res.text().catch(() => "");
        setOutput(
          JSON.stringify(
            {
              error: "API did not return valid JSON",
              status: res.status,
              raw,
            },
            null,
            2,
          ),
        );
        return;
      }

      // Show exactly what the API sent back
      setOutput(JSON.stringify(data, null, 2));
    } catch (err: any) {
      console.error(err);
      setOutput(
        JSON.stringify(
          { error: err?.message || "Unexpected error talking to Comfy" },
          null,
          2,
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        <div>
          <p className="text-xs tracking-[0.25em] uppercase text-cyan-400">
            Cyber Dev → ComfyUI Tester
          </p>
          <h1 className="mt-2 text-2xl font-semibold">ComfyUI Tester</h1>
          <p className="text-sm text-slate-400 mt-1">
            Send a prompt to the Comfy proxy endpoint and inspect the raw JSON response.
          </p>
        </div>

        <div className="space-y-3">
          <textarea
            className="w-full min-h-[140px] rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="inline-flex items-center rounded-md bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow hover:bg-cyan-400 disabled:opacity-60"
          >
            {loading ? "Generating..." : "Generate via Comfy"}
          </button>
        </div>

        <div className="mt-4 rounded-md border border-slate-800 bg-slate-950 p-3">
          <pre className="text-xs text-emerald-300 whitespace-pre-wrap">
            {output || "// Response will appear here as JSON"}
          </pre>
        </div>
      </div>
    </main>
  );
}
