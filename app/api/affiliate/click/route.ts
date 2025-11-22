import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Missing prompt" },
        { status: 400 }
      );
    }

    // Use COMFY_URL from env
    const base = process.env.COMFY_URL;
    if (!base) {
      return NextResponse.json(
        { error: "Missing COMFY_URL env variable" },
        { status: 500 }
      );
    }

    // SEND PROMPT TO COMFYUI
    const sendRes = await fetch(`${base}/prompt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: {
          "1": {
            "inputs": {
              "text": prompt
            },
            "class_type": "CLIPTextEncode"
          }
        }
      })
    });

    const sendJson = await sendRes.json();

    return NextResponse.json(
      {
        ok: sendRes.ok,
        status: sendRes.status,
        prompt_id: sendJson.prompt_id ?? null,
        json: sendJson
      },
      { status: 200 }
    );

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Error sending to ComfyUI" },
      { status: 500 }
    );
  }
}
