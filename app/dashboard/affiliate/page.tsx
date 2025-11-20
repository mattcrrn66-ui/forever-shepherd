"use client";

import { useEnsureAffiliate } from "@/lib/useEnsureAffiliate";

export default function AffiliateDashboardPage() {
  const { myCode, referralLink, loading } = useEnsureAffiliate();

  const handleCopy = async () => {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
    } catch {
      // ignore clipboard errors
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-6">Affiliate Dashboard</h1>

        <section className="border border-slate-800 rounded-xl bg-slate-900/60 p-6 space-y-4">
          <p className="text-sm font-medium text-slate-200">Your referral link</p>

          {loading || !referralLink ? (
            <p className="text-slate-500 text-sm">
              Generating your affiliate link...
            </p>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <code className="flex-1 text-xs sm:text-sm bg-slate-950/80 border border-slate-700 rounded-lg px-3 py-2 overflow-x-auto">
                  {referralLink}
                </code>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-900 text-sm font-semibold hover:bg-cyan-400"
                >
                  Copy
                </button>
              </div>

              {myCode && (
                <p className="text-xs text-slate-500">
                  Your affiliate code:{" "}
                  <span className="font-mono text-cyan-300">{myCode}</span>
                </p>
              )}

              <p className="text-xs text-slate-500">
                Share this link. Anyone who visits CyberDev through it and later
                uses the platform can earn you rewards once payouts are wired in.
              </p>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
