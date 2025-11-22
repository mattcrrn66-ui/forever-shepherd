import { NextResponse } from "next/server";

const COMFY_URL = process.env.COMFY_URL!;

export async function GET(req: Request) {
  try {
    if (!COMFY_URL) {
      return NextResponse.json(
        { ok: false, error: "COMFY_URL env var missing" },
        { status: 500 }
      );
    }

    const url = new URL(req.url);
    const promptId = url.searchParams.get("prompt_id");

    if (!promptId) {
      return NextResponse.json(
        { ok: false, error: "Missing prompt_id query param" },
        { status: 400 }
      );
    }

    // Build Comfy history URL: base of COMFY_URL + /history/{prompt_id}
    const comfyBase = new URL(COMFY_URL);
    comfyBase.pathname = `/history/${promptId}`;
    comfyBase.search = "";

    const res = await fetch(comfyBase.toString(), {
      method: "GET",
    });

    const contentType = res.headers.get("content-type") ?? "";
    const isJson = contentType.includes("application/json");
    const historyJson = isJson ? await res.json().catch(() => null) : null;
    const historyText = !isJson ? await res.text().catch(() => null) : null;

    if (!historyJson) {
      return NextResponse.json(
        {
          ok: false,
          status: res.status,
          error: "No JSON from Comfy history",
          raw: historyText,
        },
        { status: res.status }
      );
    }

    // Comfy history shape is usually: { [prompt_id]: { status, outputs, ... } }
    const entry = historyJson[promptId] ?? historyJson;

    const status = entry.status ?? "unknown";
    const outputs = entry.outputs ?? {};

    // We know your SaveImage node is ID "23"
    const saveNode = outputs["23"];
    const images: string[] = [];

    if (saveNode && Array.isArray(saveNode.images)) {
      // Build public /view URLs on the same ngrok base
      const baseView = new URL(COMFY_URL);
      baseView.pathname = "/view";

      for (const img of saveNode.images) {
        const filename = img.filename;
        const subfolder = img.subfolder ?? "";
        const type = img.type ?? "output";

        const viewUrl = new URL(baseView.toString());
        viewUrl.searchParams.set("filename", filename);
        viewUrl.searchParams.set("subfolder", subfolder);
        viewUrl.searchParams.set("type", type);

        images.push(viewUrl.toString());
      }
    }

    return NextResponse.json(
      {
        ok: res.ok,
        status: res.status,
        jobStatus: status,
        images,
        raw: historyJson,
      },
      { status: res.ok ? 200 : res.status }
    );
  } catch (err: any) {
    console.error("Comfy history error:", err);
    return NextResponse.json(
      { ok: false, error: err?.message || "History lookup failed" },
      { status: 500 }
    );
  }
}
