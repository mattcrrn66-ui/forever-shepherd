"use client";

import { useEffect } from "react";

const REF_PARAM = "ref";
const LOCAL_STORAGE_KEY = "cdt_affiliate_code";
const SESSION_SENT_KEY = "cdt_affiliate_click_sent";

function saveAffiliateCode(code: string) {
  try {
    // Save for long-term use
    window.localStorage.setItem(LOCAL_STORAGE_KEY, code);

    // Also drop a simple cookie (30 days)
    const days = 30;
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `cdt_affiliate_code=${encodeURIComponent(
      code
    )}; expires=${expires}; path=/`;
  } catch (err) {
    console.error("Error saving affiliate code:", err);
  }
}

async function sendClick(code: string, source: string = "site_visit") {
  try {
    // Prevent duplicate logs in a single browser session
    const sessionKey = `${SESSION_SENT_KEY}_${code}`;
    if (window.sessionStorage.getItem(sessionKey)) {
      return;
    }

    const res = await fetch("/api/affiliate/click", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        affiliate_code: code,
        source,
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("Affiliate click log failed", res.status, text);
    } else {
      window.sessionStorage.setItem(sessionKey, "1");
    }
  } catch (err) {
    console.error("Error sending affiliate click:", err);
  }
}

export default function AffiliateInitializer() {
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const refFromUrl = url.searchParams.get(REF_PARAM);

      if (refFromUrl && refFromUrl.trim().length > 0) {
        const code = refFromUrl.trim();
        // Save affiliate code
        saveAffiliateCode(code);
        // Log the click
        void sendClick(code, "site_visit_with_ref");
      }
    } catch (err) {
      console.error("AffiliateInitializer error:", err);
    }
  }, []);

  // This component doesn't render anything
  return null;
}
