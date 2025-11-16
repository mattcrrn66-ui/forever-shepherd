// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cyber Dev Token • $CDT",
  description: "Building tools for creators, devs & communities on Solana.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100">
        <div className="min-h-screen flex flex-col">
          {/* Header / Nav */}
          <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur">
            <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
              {/* Brand */}
              <a href="/" className="flex items-baseline gap-2">
                <span className="text-xs uppercase tracking-[0.25em] text-cyan-400">
                  Cyber Dev
                </span>
                <span className="text-sm text-slate-400 hidden sm:inline">
                  $CDT
                </span>
              </a>

              {/* Nav Links */}
              <nav className="flex flex-wrap items-center gap-4 text-sm">
                <a
                  href="/"
                  className="text-slate-300 hover:text-cyan-300 transition-colors"
                >
                  Home
                </a>
                <a
                  href="/directory"
                  className="text-slate-300 hover:text-cyan-300 transition-colors"
                >
                  Directory
                </a>
                <a
                  href="/dev-hub"
                  className="text-slate-300 hover:text-cyan-300 transition-colors"
                >
                  Dev Hub
                </a>
                <a
                  href="/community"
                  className="text-slate-300 hover:text-cyan-300 transition-colors"
                >
                  Community
                </a>
                <a
                  href="/whitepaper"
                  className="text-slate-300 hover:text-cyan-300 transition-colors"
                >
                  Whitepaper
                </a>
                <a
                  href="/roadmap"
                  className="text-slate-300 hover:text-cyan-300 transition-colors"
                >
                  Roadmap
                </a>
              </nav>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t border-slate-800 mt-8">
            <div className="max-w-5xl mx-auto px-4 py-4 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span>
                © {new Date().getFullYear()} Cyber Dev Token · $CDT
              </span>

              <div className="flex flex-wrap gap-3">
                <span className="hidden sm:inline">
                  Tools for creators, devs & communities on Solana.
                </span>
                <a
                  href="/terms"
                  className="hover:text-cyan-300 transition-colors"
                >
                  Terms
                </a>
                <a
                  href="/privacy"
                  className="hover:text-cyan-300 transition-colors"
                >
                  Privacy
                </a>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
