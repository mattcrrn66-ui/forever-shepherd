"use client";

import { useEnsureAffiliate } from "@/lib/useEnsureAffiliate";

/**
 * Runs globally (in layout) so we always:
 * - Generate a code for this browser
 * - Track incoming ?ref=... visits
 */
export default function AffiliateInitializer() {
  useEnsureAffiliate();
  return null;
}
