// app/api/affiliate/click/comfy/route.ts
import { NextResponse } from "next/server";

const COMFY_URL = "http://127.0.0.1:8188/prompt"; // your Comfy server

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    const comfyRes = await fetch(COMFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const contentType = comfyRes.headers.get("content-type") ?? "";
    let comfyJson: any = null;
    let comfyText: string | null = null;

    if (contentType.includes("application/json")) {
      comfyJson = await comfyRes.json().catch(() => null);
    } else {
      comfyText = await comfyRes.text().catch(() => null);
    }

    return NextResponse.json({
      ok: comfyRes.ok,
      status: comfyRes.status,
      contentType,
      json: comfyJson,
      text: comfyText,
    });
  } catch (err: any) {
    console.error("Comfy API error:", err);
    return NextResponse.json(
      {
        ok: false,
        error: err?.message || "Comfy generation failed",
      },
      { status: 500 }
    );
  }
}
