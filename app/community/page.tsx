// app/community/page.tsx

type Activity = {
  type: "token" | "dev" | "update";
  title: string;
  description: string;
  timeAgo: string;
  link?: string;
};

const activityFeed: Activity[] = [
  {
    type: "token",
    title: "Cyber Dev Token ($CDT) launched",
    description:
      "CDT is live as the core token behind the Cyber Dev ecosystem — focused on builders, not hype.",
    timeAgo: "Just now",
    link: "https://cyberdevtoken.com",
  },
  {
    type: "update",
    title: "Whitepaper v1.0 + Roadmap published",
    description:
      "The initial Cyber Dev Token whitepaper and roadmap are online, outlining the Roundtable vision, phases, and builder-first philosophy.",
    timeAgo: "Today",
    link: "/whitepaper",
  },
  {
    type: "dev",
    title: "Developer Hub scaffolded",
    description:
      "The Dev Hub page is live as the future home for builder profiles, reputation, and collaboration tools.",
    timeAgo: "Today",
    link: "/dev-hub",
  },
  {
    type: "token",
    title: "Token Directory wired up",
    description:
      "The Token Directory now reads tokens directly from the Supabase Tokens table (once populated), turning Cyber Dev into a live index.",
    timeAgo: "Today",
    link: "/directory",
  },
];

function typeLabel(type: Activity["type"]) {
  if (type === "token") return "Token";
  if (type === "dev") return "Dev";
  return "Update";
}

export default function CommunityPage() {
  const items = activityFeed;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-3xl mx-auto px-4 py-10 sm:py-16">
        {/* Header */}
        <header className="mb-10 border-b border-slate-800 pb-6">
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">
            Cyber Dev Token • $CDT
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-50">
            Community Feed
          </h1>
          <p className="mt-3 text-lg text-slate-300">
            A simple activity log for what&apos;s happening around Cyber Dev Token —
            launches, updates, tools and builder moves.
          </p>
        </header>

        {/* Activity Feed */}
        <section className="space-y-6">
          {items.length === 0 ? (
            <p className="text-slate-400 text-sm">
              No activity yet. Once the platform is live, new tokens, dev updates and
              announcements will appear here.
            </p>
          ) : (
            <ol className="space-y-4">
              {items.map((item, idx) => (
                <li
                  key={idx}
                  className="border border-slate-800 rounded-2xl p-4 bg-slate-900/40"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-slate-700 text-[11px] uppercase tracking-wide text-cyan-300">
                          {typeLabel(item.type)}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {item.timeAgo}
                        </span>
                      </div>
                      <h2 className="text-base font-semibold text-slate-50">
                        {item.title}
                      </h2>
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 mb-3">
                    {item.description}
                  </p>

                  {item.link && (
                    <a
                      href={item.link}
                      className="text-xs text-cyan-400 hover:text-cyan-300 underline"
                    >
                      View details
                    </a>
                  )}
                </li>
              ))}
            </ol>
          )}
        </section>

        {/* Note */}
        <section className="mt-10 border-t border-slate-800 pt-5">
          <p className="text-xs text-slate-500">
            Later on, this feed can be wired into real events: token profile creation,
            dev verifications, roadmap changes, and Roundtable activity powered by
            $CDT.
          </p>
        </section>
      </div>
    </main>
  );
}
