import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const AW = "https://autonomousworker.shop";
const IDEMPOTENCY_KEY = "ops-vercel-promote-forever-shepherd-45154f";

async function aw(path: string, secret: string, init: RequestInit = {}) {
  const response = await fetch(AW + path, {
    ...init,
    headers: {
      authorization: `Bearer ${secret}`,
      "content-type": "application/json",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
    signal: AbortSignal.timeout(30_000),
  });
  const text = await response.text();
  let body: any = {};
  if (text) {
    try { body = JSON.parse(text); } catch { body = { raw: text.slice(0, 2000) }; }
  }
  if (!response.ok) throw new Error(`Autonomous Worker ${response.status}: ${body?.error ?? body?.raw ?? "request failed"}`);
  return body;
}

export async function GET(_req: NextRequest, context: { params: Promise<{ parts: string[] }> }) {
  const { parts } = await context.params;
  const [secret = "", action = "enqueue", rawJobId = ""] = Array.isArray(parts) ? parts : [];
  if (secret.length < 32) return NextResponse.json({ ok: false, error: "missing one-time authorization" }, { status: 403 });

  try {
    if (action === "enqueue") {
      const result = await aw("/api/remote-ai/jobs", secret, {
        method: "POST",
        body: JSON.stringify({
          jobType: "OPS_EXECUTION",
          prompt: [
            "Promote the already-built Forever Shepherd Vercel deployment to production.",
            "Target deployment: https://forever-shepherd-ix73a2ult-cyberdevtokens-projects.vercel.app",
            "Target project: forever-shepherd",
            "Target team/scope: cyberdevtokens-projects",
            "Use the existing authenticated Vercel CLI on this machine if available.",
            "Run only the minimum Vercel commands needed to promote that exact deployment, for example: vercel promote https://forever-shepherd-ix73a2ult-cyberdevtokens-projects.vercel.app --yes --scope cyberdevtokens-projects",
            "Do not modify source code, branches, credentials, billing, environment variables, domains, or any other project.",
            "Do not read, print, copy, or expose any credentials.",
            "After the promote command, verify the production deployment points to commit 45154f35412bd15698a9754c309055a71017222f or to the exact target deployment above.",
            "If Vercel CLI is unavailable, unauthenticated, network access is disabled, or promotion cannot be verified, stop and report the blocker without changing anything else."
          ].join("\n"),
          requestedModel: "codex-local",
          responseFormat: "text",
          priority: 100,
          idempotencyKey: IDEMPOTENCY_KEY,
          metadata: {},
        }),
      });
      return NextResponse.json({ ok: true, job: result.job });
    }

    if (action === "status") {
      const jobId = Number(rawJobId);
      if (!Number.isInteger(jobId) || jobId <= 0) return NextResponse.json({ ok: false, error: "valid jobId required" }, { status: 400 });
      const result = await aw("/api/remote-ai/jobs", secret, { method: "GET" });
      const job = Array.isArray(result?.items) ? result.items.find((item: any) => Number(item?.id) === jobId) : null;
      if (!job) return NextResponse.json({ ok: false, error: "job not found" }, { status: 404 });
      return NextResponse.json({
        ok: true,
        job: {
          id: job.id,
          status: job.status,
          requestedModel: job.requestedModel,
          assignedWorkerId: job.assignedWorkerId,
          attemptCount: job.attemptCount,
          maxAttempts: job.maxAttempts,
          responseText: job.responseText,
          error: job.error,
          createdAt: job.createdAt,
          completedAt: job.completedAt,
        },
      });
    }

    return NextResponse.json({ ok: false, error: "unsupported action" }, { status: 400 });
  } catch (error: unknown) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : String(error) }, { status: 502 });
  }
}
