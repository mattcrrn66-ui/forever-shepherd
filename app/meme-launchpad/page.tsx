"use client";

import { useEffect, useRef, useState } from "react";

const MEME_UNI_URL = "https://meme.university"; // base dapp URL
const REF_CODE = "N9S5839G";
const REFERRER_URL = "https://cyberdevtoken.com";

export default function MemeLaunchpadEmbedPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const launchUrl = `${MEME_UNI_URL}?ref=${REF_CODE}`;
  const phantomBrowseUrl = `https://phantom.app/ul/browse/${encodeURIComponent(
    launchUrl
  )}?ref=${encodeURIComponent(REFERRER_URL)}`;

  useEffect(() => {
    // Simple mobile detection
    if (typeof navigator !== "undefined") {
      setIsMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
    }
  }, []);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const injectReferral = () => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!doc) return;

        const input =
          doc.querySelector("input[name='ref']") ||
          doc.querySelector("input[name='referral']") ||
          doc.querySelector("input[name='code']") ||
          doc.querySelector("input[placeholder*='ref']") ||
          doc.querySelector("input");

        if (input) {
          (input as HTMLInputElement).value = REF_CODE;
          (input as HTMLInputElement).dispatchEvent(
            new Event("input", { bubbles: true })
          );
        }
      } catch {
        // Cross-origin might block this; URL ref still works.
      }
    };

    iframe.addEventListener("load", injectReferral);
    return () => iframe.removeEventListener("load", injectReferral);
  }, [launchUrl]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-6">
        <header className="border-b border-slate-800 pb-4">
          <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">
            Cyber Dev Token • $CDT
          </p>
          <h1 className="mt-3 text-3xl font-bold">Meme University Launchpad</h1>
          <p className="mt-2 text-slate-300">
            Your referral code <b>{REF_CODE}</b> will be automatically applied.
          </p>
        </header>

        {/* Mobile: open directly in Phantom */}
        {isMobile && (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-slate-300">
              On mobile, the best experience is to open Meme University inside
              the Phantom app.
            </p>
            <a
              href={phantomBrowseUrl}
              className="inline-flex items-center justify-center px-5 py-3 rounded-full border border-cyan-400/70 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-200 text-sm font-medium"
            >
              Open in Phantom (with referral)
            </a>
            <p className="text-xs text-slate-500">
              If nothing happens, make sure the Phantom app is installed, then
              tap the button again.
            </p>
          </div>
        )}

        {/* Desktop + fallback for mobile browsers */}
        <div className="text-xs sm:text-sm text-slate-400 mt-2">
          If the embedded launchpad doesn&apos;t load correctly or wallet
          connect behaves weird,{" "}
          <a
            href={launchUrl}
            target="_blank"
            rel="noreferrer"
            className="text-cyan-400 underline"
          >
            click here to open Meme University in a full tab (referral included)
          </a>
          . On desktop, that&apos;s the best way to let Phantom connect.
        </div>

        {/* Iframe preview (mostly for desktop) */}
        <div className="min-h-[80vh] border border-slate-800 rounded-xl overflow-hidden bg-black mt-2">
          <iframe
            ref={iframeRef}
            src={launchUrl}
            title="Meme University Launchpad"
            className="w-full h-full min-h-[80vh]"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </div>
      </div>
    </main>
  );
}
