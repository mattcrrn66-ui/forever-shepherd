import crypto from "node:crypto";

export const AUTOWORKER_CAPABILITY_PUBLIC_KEY_B64 = "MCowBQYDK2VwAyEAPFIcKXlwHYvmjItmHwzuTZ0X2Tr7q2qX+ZrvbIshJIQ=";
const EXPECTED_ISSUER = "autonomous-worker";
const EXPECTED_AUDIENCE = "forever-shepherd";
const EXPECTED_ACTION = "printify.upload_url";

export type VerifiedUploadGrant = {
  v: 1;
  iss: "autonomous-worker";
  aud: "forever-shepherd";
  action: "printify.upload_url";
  jobId: number;
  workerId: string;
  artifactId: string;
  fileName: string;
  sha256: string;
  sizeBytes: number;
  sourceUrl: string;
  iat: number;
  exp: number;
  nonce: string;
};

function parseJsonSegment<T>(segment: string): T {
  try { return JSON.parse(Buffer.from(segment, "base64url").toString("utf8")) as T; }
  catch { throw new Error("Malformed capability token"); }
}

function safeString(value: unknown, max: number): string {
  if (typeof value !== "string") throw new Error("Malformed capability token");
  const normalized = value.trim();
  if (!normalized || normalized.length > max) throw new Error("Malformed capability token");
  return normalized;
}

export function verifyPrintifyUploadGrant(token: string, nowMs = Date.now()): VerifiedUploadGrant {
  const parts = token.split(".");
  if (parts.length !== 3 || parts.some((part) => !part)) throw new Error("Malformed capability token");
  const [headerPart, payloadPart, signaturePart] = parts;
  const header = parseJsonSegment<Record<string, unknown>>(headerPart);
  if (header.alg !== "EdDSA" || header.typ !== "JWT") throw new Error("Unsupported capability token");

  const key = crypto.createPublicKey({ key: Buffer.from(AUTOWORKER_CAPABILITY_PUBLIC_KEY_B64, "base64"), format: "der", type: "spki" });
  const valid = crypto.verify(null, Buffer.from(`${headerPart}.${payloadPart}`), key, Buffer.from(signaturePart, "base64url"));
  if (!valid) throw new Error("Invalid capability signature");

  const raw = parseJsonSegment<Record<string, unknown>>(payloadPart);
  if (raw.v !== 1 || raw.iss !== EXPECTED_ISSUER || raw.aud !== EXPECTED_AUDIENCE || raw.action !== EXPECTED_ACTION) throw new Error("Capability scope mismatch");
  if (!Number.isInteger(raw.jobId) || Number(raw.jobId) <= 0) throw new Error("Malformed capability token");
  if (!Number.isInteger(raw.sizeBytes) || Number(raw.sizeBytes) <= 0 || Number(raw.sizeBytes) > 25 * 1024 * 1024) throw new Error("Malformed capability token");
  if (!Number.isInteger(raw.iat) || !Number.isInteger(raw.exp)) throw new Error("Malformed capability token");
  const now = Math.floor(nowMs / 1000);
  if (Number(raw.exp) < now) throw new Error("Capability token expired");
  if (Number(raw.iat) > now + 60) throw new Error("Capability token issued in the future");
  if (Number(raw.exp) - Number(raw.iat) > 15 * 60) throw new Error("Capability token lifetime is too long");

  const fileName = safeString(raw.fileName, 180);
  if (!/^autoworker-[a-zA-Z0-9._-]+\.(png|jpe?g)$/i.test(fileName)) throw new Error("Malformed capability token");
  const sha256 = safeString(raw.sha256, 64).toLowerCase();
  if (!/^[a-f0-9]{64}$/.test(sha256)) throw new Error("Malformed capability token");
  const artifactId = safeString(raw.artifactId, 64);
  if (!/^[a-f0-9-]{36}$/i.test(artifactId)) throw new Error("Malformed capability token");
  const sourceUrl = safeString(raw.sourceUrl, 2048);
  const parsedSource = new URL(sourceUrl);
  if (parsedSource.protocol !== "https:" || parsedSource.hostname !== "autonomousworker.shop" || !parsedSource.pathname.startsWith("/api/artifacts/")) throw new Error("Capability source URL is not trusted");

  return {
    v: 1,
    iss: EXPECTED_ISSUER,
    aud: EXPECTED_AUDIENCE,
    action: EXPECTED_ACTION,
    jobId: Number(raw.jobId),
    workerId: safeString(raw.workerId, 120),
    artifactId,
    fileName,
    sha256,
    sizeBytes: Number(raw.sizeBytes),
    sourceUrl: parsedSource.toString(),
    iat: Number(raw.iat),
    exp: Number(raw.exp),
    nonce: safeString(raw.nonce, 80),
  };
}
