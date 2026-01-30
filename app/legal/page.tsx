// app/page.tsx
import Link from "next/link";

function Card({
  title,
  desc,
  href,
  tag,
}: {
  title: string;
  desc: string;
  href: string;
  tag?: string;
}) {
  return (
    <Link
      href={href}
      className="group relative rounded-2xl bg-white/[0.04] ring-1 ring-white/10 p-6 hover:bg-white/[0.06] transition overflow-hidden"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition pointer-events-none">
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-spotlight blur-3xl opacity-50" />
      </div>

      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-white">{title}</h3>
        {tag ? (
          <span className="text-xs rounded-full bg-white/5 ring-1 ring-white/10 px-2 py-1 text-white/70">
            {tag}
          </span>
        ) : null}
      </div>

      <p className="mt-2 text-sm text-white/70 leading-relaxed">{desc}</p>

      <div className="mt-4 text-sm text-cyan-400 group-hover:text-violet-400 transition">
        Open →
      </div>
    </Link>
  );
}

export default function Page() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-white/[0.04] ring-1 ring-white/10 p-8 md:p-12">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-spotlight blur-3xl opacity-50" />
          <div className="absolute bottom-[-220px] right-[-180px] h-[520px] w-[520px] rounded-full bg-spotlight2 blur-3xl opacity-35" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 ring-1 ring-white/10 px-3 py-1 text-xs text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-glow" />
            Forever Shepherd • v1
          </div>

          <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight text-white">
            Forever Shepherd
          </h1>

          <p className="mt-3 text-base md:text-lg text-white/70 leading-relaxed">
            Guidance that remains. A calm, focused storefront for the first release —
            minimal design, premium feel, no distractions.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link href="/first-release" className="btn btn-primary">
              First Release
            </Link>
            <Link href="/shipping" className="btn btn-ghost">
              Shipping & Returns
            </Link>
            <Link href="/legal" className="btn btn-outline">
              Legal / Policies
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap gap-2 text-xs text-white/60">
            <span className="chip">Dark-first</span>
            <span className="chip">Minimal</span>
            <span className="chip">Limited</span>
            <span className="chip">Vercel-ready</span>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="grid gap-4 md:grid-cols-2">
        <Card
          title="First Release"
          desc="A focused product page with clean visuals and a simple purchase flow."
          href="/first-release"
          tag="Drop 01"
        />
        <Card
          title="Shipping & Returns"
          desc="Clear policies designed to build trust and reduce friction."
          href="/shipping"
          tag="Policy"
        />
      </section>
    </div>
  );
}
