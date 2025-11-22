import { NextResponse } from "next/server";

function getComfyBaseFromEnv() {
  const raw = (process.env.COMFY_URL ?? "").trim();
  if (!raw) return null;

  // COMFY_URL currently is like: https://xxxx.ngrok-free.dev/prompt
  // Strip the trailing /prompt so we can call /history/{id}
  return raw.replace(/\/prompt\/?$/i, "");
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const promptId = url.searchParams.get("promptId");

    if (!promptId) {
      return NextResponse.json(
        { ok: false, error: "Missing promptId query param" },
        { status: 400 }
      );
    }

    const comfyBase = getComfyBaseFromEnv();
    if (!comfyBase) {
      return NextResponse.json(
        {
          ok: false,
          error: "COMFY_URL env var is missing or invalid on server",
        },
        { status: 500 }
      );
    }

    const historyUrl = `${comfyBase}/history/${encodeURIComponent(promptId)}`;

    const comfyRes = await fetch(historyUrl, {
      method: "GET",
      cache: "no-store",
    });

    const text = await comfyRes.text();
    let json: any = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      // non-JSON, ignore
    }

    // 🔄 Comfy returns 404 while the history isn't ready yet.
    // Treat that as "still running", NOT as a hard error.
    if (comfyRes.status === 404) {
      return NextResponse.json(
        {
          ok: true,
          status: 404,
          completed: false,
          images: [],
          rawHistory: null,
          message: "History not ready yet",
        },
        { status: 200 }
      );
    }

    // Any other non-OK status is a real error.
    if (!comfyRes.ok) {
      return NextResponse.json(
        {
          ok: false,
          status: comfyRes.status,
          error: "Comfy history endpoint returned an error",
          raw: text || null,
        },
        { status: comfyRes.status }
      );
    }

    // Try to extract images from the history.
    const outputs = json?.outputs || {};
    const images: { filename: string; url: string }[] = [];

    for (const nodeId of Object.keys(outputs)) {
      const out = outputs[nodeId];
      const imgs = out?.images || [];
      for (const img of imgs) {
        const filename = img.filename;
        const subfolder = img.subfolder ?? "";
        const type = img.type ?? "output";

        if (!filename) continue;

        // Use our image proxy route so the browser doesn't have to hit ngrok directly
        const url = `/api/affiliate/click/comfy/image?filename=${encodeURIComponent(
          filename
        )}&subfolder=${encodeURIComponent(
          subfolder
        )}&type=${encodeURIComponent(type)}`;

        images.push({ filename, url });
      }
    }

    const completed = images.length > 0;

    return NextResponse.json(
      {
        ok: true,
        status: comfyRes.status,
        completed,
        images,
        rawHistory: json,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Comfy result route fatal error:", err);
    return NextResponse.json(
      {
        ok: false,
        error: err?.message ?? "Unknown error in result route",
      },
      { status: 500 }
    );
  }
}
