// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cyber Dev Token Hub",
  description: "Create and explore token profiles.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-50">
        <header className="border-b border-slate-800">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="h-8 w-8 rounded-full bg-cyan-500/20 border border-cyan-400/60 flex items-center justify-center text-xs font-bold text-cyan-300">
                CDT
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-semibold tracking-wide">
                  Cyber Dev Token
                </span>
                <span className="text-xs text-slate-400">
                  The Roundtable for Builders
                </span>
              </div>
            </Link>

            <nav className="flex items-center gap-4 text-sm">
              <Link
                href="/"
                className="text-slate-300 hover:text-cyan-300 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/whitepaper"
                className="text-slate-300 hover:text-cyan-300 transition-colors"
              >
                Whitepaper
              </Link>
            </nav>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
