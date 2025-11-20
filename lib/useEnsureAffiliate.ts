"use client";

import { useEffect, useState } from "react";

type AffiliateState = {
  myCode: string | null;
  referralLink: string | null;
  loading: boolean;
};

function generateAffiliateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return `CDT-${out}`;
}

/**
 * Ensures this browser has:
 * 1) Its own affiliate code (for sharing)
 * 2) Any incoming ?ref=... is tracked + stored
 */
export function useEnsureAffiliate(): AffiliateState {
  const [myCode, setMyCode] = useState<string | null>(null);
  const [referralLink, setReferralLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    (async () => {
      try {
        const origin = window.location.origin;

        // 1) Make sure THIS browser has its own affiliate code
        let storedMyCode = window.localStorage.getItem("cdt_my_affiliate_code");
        if (!storedMyCode) {
          storedMyCode = generateAffiliateCode();
          window.localStorage.setItem("cdt_my_affiliate_code", storedMyCode);
        }
        setMyCode(storedMyCode);
        setReferralLink(`${origin}/?ref=${storedMyCode}`);

        // 2) Check if user arrived with a ?ref=... code from someone else
        const url = new URL(window.location.href);
        const incomingRef = url.searchParams.get("ref");

        if (incomingRef) {
          // Remember who referred this browser
          window.localStorage.setItem("cdt_attribution_code", incomingRef);

          // Log the click to your API (→ affiliate_clicks)
          try {
            await fetch("/api/affiliate/click", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                affiliate_code: incomingRef,
                source: "site_visit_with_ref",
              }),
            });
          } catch {
            // ignore network errors for now
          }
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { myCode, referralLink, loading };
}
