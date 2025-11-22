import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const promptId = url.searchParams.get("promptId");

    if (!promptId) {
      return NextResponse.json(
        { ok: false, error: "Missing promptId" },
        { status: 400 }
      );
    }

    const base = process.env.COMFY_URL;
    if (!base) {
      return NextResponse.json(
        { ok: false, error: "Missing COMFY_URL env" },
        { status: 500 }
      );
    }

    // GET HISTORY FOR THAT PROMPT
    const histRes = await fetch(`${base}/history/${promptId}`, {
      method: "GET"
    });

    if (!histRes.ok) {
      return NextResponse.json(
        { ok: false, status: histRes.status, error: "History not ready" },
        { status: 200 }
      );
    }

    const histJson = await histRes.json();

    const images =
      histJson?.outputs?.[Object.keys(histJson.outputs)[0]]?.images || [];

    return NextResponse.json(
      {
        ok: true,
        completed: true,
        images,
        rawHistory: histJson
      },
      { status: 200 }
    );

  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err.message ?? "Error fetching result" },
      { status: 500 }
    );
  }
}
