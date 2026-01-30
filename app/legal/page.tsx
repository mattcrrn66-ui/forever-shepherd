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
        <h3 className="text-base font-semibold">{title}</h3>
        {tag ? (
          <span className="text-xs rounded-full bg-white/5 ring-1 ring-white/10 px-2 py-1 text-foreground/70">
            {tag}
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-sm text-foreground/70 leading-relaxed">{desc}</p>
      <div className="mt-4 text-sm text-brand group-hover:text-brand2 transition">
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
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 ring-1 ring-white/10 px-3 py-1 text-xs text-foreground/70">
            <span className="h-1.5 w-1.5 rounded-full bg-brand shadow-glow" />
            Forever Shepherd • v1
          </div>

          <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">
            Forever Shepherd
          </h1>
          <p className="mt-3 text-base md:text-lg text-foreground/70 leading-relaxed">
            Guidance that remains. A clean, calm launch surface for your first release — with
            simple navigation, beautiful dark mode, and room to grow.
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

          <div className="mt-6 flex flex-wrap gap-2 text-xs text-foreground/60">
            <span className="chip">Dark-first</span>
            <span className="chip">Fast</span>
            <span className="chip">Minimal</span>
            <span className="chip">Vercel-ready</span>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="grid gap-4 md:grid-cols-3">
        <Card
          title="First Release"
          desc="A focused product page with a buy button placeholder and clean visuals."
          href="/first-release"
          tag="POD"
        />
        <Card
          title="Shipping & Returns"
          desc="Simple policy layout that looks premium and builds trust."
          href="/shipping"
          tag="Policy"
        />
        <Card
          title="Roadmap"
          desc="Where this is going — phases, drops, and the long arc."
          href="/roadmap"
          tag="Plan"
        />
      </section>

      {/* CTA */}
      <section className="rounded-3xl bg-white/[0.04] ring-1 ring-white/10 p-8 md:p-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Next step</h2>
            <p className="mt-2 text-foreground/70">
              Tell me your exact vibe (calm, luxury, tactical, spiritual, street, etc.) and I’ll
              lock the palette + typography + spacing so it feels like a real brand.
            </p>
          </div>
          <div className="flex gap-3">
            <Link className="btn btn-primary" href="/directory">
              Start building
            </Link>
            <Link className="btn btn-outline" href="/whitepaper">
              Read the vision
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
