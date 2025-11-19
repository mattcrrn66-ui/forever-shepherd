"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-16 flex flex-col gap-12">

        {/* Header Section */}
        <section className="flex flex-col gap-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-50">
            Cyber Dev Token • $CDT
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto">
            The Roundtable for Builders on Solana.
            Create tokens, build communities, and launch your ideas into reality.
          </p>

          {/* NEW PRIMARY CTA BUTTON */}
          <div className="mt-6">
            <Link
              href="/meme-launchpad"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-cyan-500 text-slate-900 font-semibold text-lg hover:bg-cyan-400 transition"
            >
              🚀 Launch a Token Now
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="grid sm:grid-cols-2 gap-10 mt-10">
          <div className="p-6 border border-slate-800 rounded-xl bg-slate-900/40">
            <h2 className="text-xl font-bold text-cyan-300">Token Directory</h2>
            <p className="mt-2 text-slate-400">
              Explore tokens created through the Cyber Dev Hub and track active projects.
            </p>
            <Link
              href="/directory"
              className="inline-block mt-4 text-cyan-400 hover:underline"
            >
              View Directory →
            </Link>
          </div>

          <div className="p-6 border border-slate-800 rounded-xl bg-slate-900/40">
            <h2 className="text-xl font-bold text-cyan-300">Dev Hub</h2>
            <p className="mt-2 text-slate-400">
              Tools, uploads, utilities, and resources for builders launching on Solana.
            </p>
            <Link
              href="/dev-hub"
              className="inline-block mt-4 text-cyan-400 hover:underline"
            >
              Enter Dev Hub →
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}
