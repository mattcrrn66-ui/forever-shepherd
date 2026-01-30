// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Forever Shepherd",
  description: "Guidance that remains.",
  metadataBase: new URL("https://example.com"),
};

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 py-2 rounded-lg text-sm text-foreground/80 hover:text-foreground hover:bg-white/5 transition"
    >
      {children}
    </Link>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        {/* Ambient background */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-grid opacity-[0.20]" />
          <div className="absolute -top-40 left-1/2 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-spotlight blur-3xl opacity-60" />
          <div className="absolute bottom-[-220px] right-[-180px] h-[520px] w-[520px] rounded-full bg-spotlight2 blur-3xl opacity-45" />
          <div className="absolute inset-0 bg-vignette" />
        </div>

        {/* Top Nav */}
        <header className="sticky top-0 z-50 border-b border-white/10 bg-black/25 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
            <Link href="/" className="group flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
                <span className="h-2.5 w-2.5 rounded-full bg-brand shadow-glow" />
              </span>
              <div className="leading-tight">
                <div className="text-sm font-semibold tracking-wide">
                  Forever Shepherd
                </div>
                <div className="text-xs text-foreground/60">
                  Guidance that remains.
                </div>
              </div>
            </Link>

            <nav className="hidden items-center gap-1 md:flex">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/directory">Directory</NavLink>
              <NavLink href="/dev-hub">Dev Hub</NavLink>
              <NavLink href="/community">Community</NavLink>
              <NavLink href="/whitepaper">Whitepaper</NavLink>
              <NavLink href="/roadmap">Roadmap</NavLink>
            </nav>

            <div className="flex items-center gap-2">
              <Link
                href="/first-release"
                className="btn btn-primary"
              >
                First Release
              </Link>
              <Link
                href="/shipping"
                className="btn btn-ghost hidden sm:inline-flex"
              >
                Shipping
              </Link>
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="mx-auto w-full max-w-6xl px-5 py-10">{children}</main>

        {/* Footer */}
        <footer className="border-t border-white/10 bg-black/20">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-foreground/60 md:flex-row md:items-center md:justify-between">
            <div>© {new Date().getFullYear()} Forever Shepherd</div>
            <div className="flex items-center gap-4">
              <Link className="hover:text-foreground transition" href="/terms">
                Terms
              </Link>
              <Link className="hover:text-foreground transition" href="/privacy">
                Privacy
              </Link>
              <a className="hover:text-foreground transition" href="#" aria-disabled>
                Contact
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
