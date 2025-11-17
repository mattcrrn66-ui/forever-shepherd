"use client";

import Link from "next/link";

export default function LaunchPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <header className="mb-8">
          <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">
            Cyber Dev Token • $CDT
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold">
            Launch / Register a Token
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            This is the dev area. Here you&apos;ll eventually create or register
            new tokens. For now, this is just a placeholder page wired
            correctly.
          </p>
        </header>

        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            You are currently on <code>/launch</code>. If you want to go to the
            builder page at <code>/build</code>, use the link below:
          </p>

          <Link
            href="/build"
            className="inline-flex items-center rounded-lg border border-cyan-500/60 px-3 py-1.5 text-sm font-medium text-cyan-300 hover:bg-cyan-500/10"
          >
            Go to /build (Token Builder)
          </Link>

          <p className="text-xs text-slate-500">
            If this link renders without errors, your <code>Link</code> usage is
            correct and any previous error was from syntax or placement.
          </p>
        </div>
      </div>
    </main>
  );
}
