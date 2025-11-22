import { NextRequest, NextResponse } from "next/server";

const COMFY_URL = process.env.COMFY_URL; // e.g. "http://127.0.0.1:8188"

if (!COMFY_URL) {
  console.warn("COMFY_URL env var is not set");
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const promptId = url.searchParams.get("promptId");

    if (!promptId) {
      return NextResponse.json(
        { ok: false, error: "Missing promptId" },
        { status: 400 }
      );
    }

    if (!COMFY_URL) {
      return NextResponse.json(
        { ok: false, error: "COMFY_URL environment variable is not set" },
        { status: 500 }
      );
    }

    const historyRes = await fetch(`${COMFY_URL}/history/${promptId}`, {
      cache: "no-store",
    });

    if (historyRes.status === 404) {
      return NextResponse.json({
        ok: true,
        completed: false,
        images: [],
        rawHistory: null,
      });
    }

    if (!historyRes.ok) {
      const text = await historyRes.text();
      return NextResponse.json(
        {
          ok: false,
          completed: false,
          error: "Failed to fetch history from Comfy",
          status: historyRes.status,
          body: text,
        },
        { status: 500 }
      );
    }

    const historyJson = (await historyRes.json()) as any;
    const entry = historyJson[promptId];

    if (!entry || !entry.outputs) {
      return NextResponse.json({
        ok: true,
        completed: false,
        images: [],
        rawHistory: entry ?? null,
      });
    }

    const outputs = entry.outputs;
    const imageInfos: { filename: string; subfolder: string; type: string }[] =
      [];

    for (const nodeId of Object.keys(outputs)) {
      const nodeOutput = (outputs as any)[nodeId];
      if (!nodeOutput?.images) continue;

      for (const img of nodeOutput.images) {
        if (!img?.filename) continue;
        imageInfos.push({
          filename: img.filename,
          subfolder: img.subfolder ?? "",
          type: img.type ?? "output",
        });
      }
    }

    const images = imageInfos.map((img) => ({
      filename: img.filename,
      url: `/api/affiliate/click/comfy/image?filename=${encodeURIComponent(
        img.filename
      )}&subfolder=${encodeURIComponent(img.subfolder)}&type=${encodeURIComponent(
        img.type
      )}`,
    }));

    return NextResponse.json({
      ok: true,
      completed: true,
      images,
      rawHistory: entry,
    });
  } catch (err: any) {
    console.error("Error in comfy result route:", err);
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
