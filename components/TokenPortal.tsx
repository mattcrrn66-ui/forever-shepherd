// components/TokenPortal.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";

interface TokenPortalProps {
  tokenId: string;
  name: string;
  symbol: string;
  description?: string;
  image?: string;
  website?: string;
  twitter?: string;
  telegram?: string;
}

interface PortalMessage {
  id: string;
  token_id: string;
  role: string | null;
  handle: string | null;
  display_name: string | null;
  message: string;
  created_at: string;
}

export default function TokenPortal({
  tokenId,
  name,
  symbol,
  description,
  image,
  website,
  twitter,
  telegram,
}: TokenPortalProps) {
  const supabase = createClient();

  const [messages, setMessages] = useState<PortalMessage[]>([]);
  const [displayName, setDisplayName] = useState("");
  const [handle, setHandle] = useState("");
  const [role, setRole] = useState<"dev" | "mod" | "holder">("holder");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Load messages for this token
  useEffect(() => {
    const loadMessages = async () => {
      const { data, error } = await supabase
        .from("token_portal_messages")
        .select("*")
        .eq("token_id", tokenId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setMessages(data as PortalMessage[]);
      } else if (error) {
        console.error("Error loading portal messages:", error);
      }
    };

    loadMessages();
  }, [supabase, tokenId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("token_portal_messages")
      .insert({
        token_id: tokenId,
        role,
        handle: handle || null,
        display_name: displayName || null,
        message: message.trim(),
      })
      .select()
      .single();

    setLoading(false);

    if (error) {
      console.error("Error saving message:", error);
      return;
    }

    if (data) {
      setMessages((prev) => [data as PortalMessage, ...prev]);
      setMessage("");
    }
  };

  const roleLabel = (r: string | null) => {
    if (!r) return "holder";
    return r;
  };

  const roleColor = (r: string | null) => {
    if (r === "dev") return "bg-cyan-500/20 text-cyan-300 border-cyan-400/60";
    if (r === "mod") return "bg-amber-500/20 text-amber-300 border-amber-400/60";
    return "bg-slate-700/40 text-slate-200 border-slate-500/60";
  };

  return (
    <section className="space-y-6">
      {/* Token Info Card */}
      <div className="bg-slate-900 rounded-xl p-6 shadow-xl border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          {image && (
            <img
              src={image}
              alt={name}
              className="w-20 h-20 rounded-xl object-cover border border-slate-700"
            />
          )}

          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-cyan-300">
              {name}
            </h2>
            <p className="text-lg text-slate-400 font-semibold">${symbol}</p>
            {description && (
              <p className="text-slate-200 leading-relaxed mt-2 max-w-xl">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Social Links */}
        <div className="flex flex-wrap gap-3 text-sm text-slate-200">
          {website && (
            <a
              href={website}
              className="px-3 py-1 rounded-full border border-slate-700 hover:border-cyan-400/70 hover:text-cyan-300"
              target="_blank"
              rel="noreferrer"
            >
              🌐 Website
            </a>
          )}
          {twitter && (
            <a
              href={twitter}
              className="px-3 py-1 rounded-full border border-slate-700 hover:border-cyan-400/70 hover:text-cyan-300"
              target="_blank"
              rel="noreferrer"
            >
              ✖ X (Twitter)
            </a>
          )}
          {telegram && (
            <a
              href={telegram}
              className="px-3 py-1 rounded-full border border-slate-700 hover:border-cyan-400/70 hover:text-cyan-300"
              target="_blank"
              rel="noreferrer"
            >
              💬 Telegram
            </a>
          )}
        </div>

        <div className="mt-6 p-4 border border-slate-700 rounded-lg bg-slate-800/40 text-sm text-slate-300">
          This is the official portal surface for <span className="text-cyan-300 font-semibold">{name}</span>. 
          Devs can drop updates, mods can pin info, and holders can coordinate, share ideas, and build.
        </div>
      </div>

      {/* Message Form */}
      <div className="border border-slate-800 rounded-xl p-4 sm:p-5 bg-slate-900/70 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-cyan-300">
            Speak into the Portal
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Use this channel for updates, calls to action, feedback, and coordination.
          </p>
        </div>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1">
              <label className="text-xs text-slate-400">
                Display name (optional)
              </label>
              <input
                type="text"
                className="w-full rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Dev, Mod, Holder..."
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-400">
                X / Telegram handle (optional)
              </label>
              <input
                type="text"
                className="w-full rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="@yourhandle"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-400">
                Role (for context)
              </label>
              <select
                className="w-full rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                value={role}
                onChange={(e) =>
                  setRole(e.target.value as "dev" | "mod" | "holder")
                }
              >
                <option value="holder">Holder / Community</option>
                <option value="dev">Dev</option>
                <option value="mod">Mod</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400">
              Message
            </label>
            <textarea
              className="w-full min-h-[80px] rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share an update, idea, or message to the community..."
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="inline-flex items-center justify-center rounded-md bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Posting..." : "Post to Portal"}
            </button>
          </div>
        </form>
      </div>

      {/* Messages Feed */}
      <div className="border border-slate-800 rounded-xl p-4 sm:p-5 bg-slate-950/80 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-cyan-300">
            Portal Feed
          </h3>
          <p className="text-xs text-slate-500">
            {messages.length === 0
              ? "No messages yet."
              : `${messages.length} message${messages.length === 1 ? "" : "s"}`}
          </p>
        </div>

        {messages.length === 0 ? (
          <p className="text-sm text-slate-500">
            Nothing has been spoken into this portal yet. Be the first.
          </p>
        ) : (
          <div className="space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className="rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-100">
                      {m.display_name || "Anon"}
                    </span>
                    {m.handle && (
                      <span className="text-xs text-cyan-300">
                        {m.handle}
                      </span>
                    )}
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full border ${roleColor(
                        m.role
                      )}`}
                    >
                      {roleLabel(m.role)}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {new Date(m.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-slate-200 whitespace-pre-wrap">
                  {m.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
