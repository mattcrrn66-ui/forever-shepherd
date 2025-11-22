// app/api/comfy/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

const COMFY_URL = "http://127.0.0.1:8188/prompt";

// Helper: load the saved Comfy workflow JSON
async function loadBaseWorkflow() {
  const filePath = path.join(
    process.cwd(),
    "app",
    "comfy",
    "workflows",
    "CyberDev.json"
  );

  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

// Helper: inject prompts into the workflow
function injectPrompts(
  workflow: any,
  positivePrompt: string,
  negativePrompt?: string
) {
  // 👉 IMPORTANT:
  // You’ll need to change these node IDs to your actual CLIP Text nodes.
  // Open CyberDev.json and look for nodes where:
  //   "class_type": "CLIPTextEncode" (or similar)
  //   and inside "inputs": { "text": "your original prompt..." }
  //
  // Once you find them, note their node IDs (keys) and put them below.

  const POSITIVE_NODE_ID = "5"; // <-- replace with your real ID
  const NEGATIVE_NODE_ID = "8"; // <-- replace with your real ID (if you have one)

  if (workflow[POSITIVE_NODE_ID]) {
    workflow[POSITIVE_NODE_ID].inputs.text = positivePrompt;
  }

  if (negativePrompt && workflow[NEGATIVE_NODE_ID]) {
    workflow[NEGATIVE_NODE_ID].inputs.text = negativePrompt;
  }

  return workflow;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    const {
      prompt: positivePrompt = "Ultra realistic portrait, cyberdev default",
      negativePrompt = "blurry, low quality, distorted, jpeg artifacts",
    } = body;

    // 1️⃣ Load base workflow
    let workflow = await loadBaseWorkflow();

    // 2️⃣ Inject prompts
    workflow = injectPrompts(workflow, positivePrompt, negativePrompt);

    // 3️⃣ Build Comfy payload
    const client_id = "cyberdev-ui";
    const payload = {
      client_id,
      prompt: workflow,
    };

    // 4️⃣ Send to local ComfyUI server
    const res = await fetch(COMFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Comfy error:", text);
      return NextResponse.json(
        { error: "ComfyUI request failed", detail: text },
        { status: 500 }
      );
    }

    const data = await res.json();

    // For now we just return the prompt_id etc.
    // Later we can add a /history poller to fetch the final image URL.
    return NextResponse.json({
      ok: true,
      comfyResponse: data,
      client_id,
    });
  } catch (err: any) {
    console.error("API /api/comfy error:", err);
    return NextResponse.json(
      { error: "Internal error", detail: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}
