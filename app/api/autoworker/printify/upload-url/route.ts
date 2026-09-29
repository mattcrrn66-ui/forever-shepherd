import { NextRequest, NextResponse } from "next/server";
import { verifyPrintifyUploadGrant } from "@/lib/autoworker-capability";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PRINTIFY_BASE = "https://api.printify.com/v1";
const USER_AGENT = "ForeverShepherd-AutonomousWorker/1.0";

function publicUpload(data: any) {
  return {
    id: data?.id,
    file_name: data?.file_name,
    height: data?.height,
    width: data?.width,
    size: data?.size,
    mime_type: data?.mime_type,
    preview_url: data?.preview_url,
    upload_time: data?.upload_time,
  };
}

async function printifyFetch(path: string, token: string, init: RequestInit = {}) {
  return fetch(`${PRINTIFY_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "User-Agent": USER_AGENT,
      ...(init.body ? { "Content-Type": "application/json;charset=utf-8" } : {}),
      ...(init.headers ?? {}),
    },
    cache: "no-store",
    signal: AbortSignal.timeout(60_000),
  });
}

async function findExistingUpload(fileName: string, token: string) {
  const response = await printifyFetch("/uploads.json?limit=100&page=1", token);
  if (!response.ok) return null;
  const body = await response.json().catch(() => null);
  const items = Array.isArray(body?.data) ? body.data : [];
  return items.find((item: any) => item?.file_name === fileName) ?? null;
}

export async function POST(req: NextRequest) {
  const token = process.env.PRINTIFY_API_TOKEN;
  if (!token) return NextResponse.json({ ok: false, error: "Printify is not configured" }, { status: 503 });

  let body: any;
  try { body = await req.json(); }
  catch { return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 }); }

  try {
    const grant = verifyPrintifyUploadGrant(String(body?.grant ?? ""));
    if (body?.file_name !== grant.fileName || body?.url !== grant.sourceUrl || body?.sha256 !== grant.sha256 || Number(body?.size_bytes) !== grant.sizeBytes) {
      return NextResponse.json({ ok: false, error: "Request does not match signed capability" }, { status: 403 });
    }

    const head = await fetch(grant.sourceUrl, { method: "HEAD", redirect: "error", cache: "no-store", signal: AbortSignal.timeout(20_000) });
    if (!head.ok) return NextResponse.json({ ok: false, error: `Artifact preflight failed (${head.status})` }, { status: 502 });
    const remoteSha = String(head.headers.get("x-autoworker-sha256") ?? "").toLowerCase();
    const remoteLength = Number(head.headers.get("content-length"));
    const remoteType = String(head.headers.get("content-type") ?? "").split(";")[0].toLowerCase();
    if (remoteSha !== grant.sha256 || remoteLength !== grant.sizeBytes || !["image/png", "image/jpeg"].includes(remoteType)) {
      return NextResponse.json({ ok: false, error: "Artifact preflight metadata mismatch" }, { status: 409 });
    }

    const existing = await findExistingUpload(grant.fileName, token);
    if (existing?.id) return NextResponse.json({ ok: true, deduplicated: true, data: publicUpload(existing) });

    const response = await printifyFetch("/uploads/images.json", token, {
      method: "POST",
      body: JSON.stringify({ file_name: grant.fileName, url: grant.sourceUrl }),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok || !data?.id) {
      return NextResponse.json({ ok: false, error: data?.error || data?.message || "Printify upload failed", status: response.status }, { status: response.status >= 400 && response.status < 600 ? response.status : 502 });
    }
    return NextResponse.json({ ok: true, deduplicated: false, data: publicUpload(data) });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    const status = /capability|token|signature|scope|trusted|Malformed|expired/i.test(message) ? 403 : 500;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
