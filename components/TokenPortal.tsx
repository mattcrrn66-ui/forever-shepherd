// components/TokenPortal.tsx
"use client";

import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";

const supabase = createClient();

type MessageRow = {
  id: string;
  token_id: string;
  role: string | null; // 'dev', 'mod', 'holder'
  handle: string | null;
  display_name: string | null;
  message: string;
  created_at: string;
};

type TokenPortalProps = {
  tokenId: string;
  name: string;
  symbol: string;
};

export default function TokenPortal({ tokenId, name, symbol }: TokenPortalProps) {
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // 🔒 No role picker anymore – everyone posts as holder
  const [handle, setHandle] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    setLoadError(null);
    const { data, error } = await supabase
      .from("token_portal_messages")
      .select("*")
      .eq("token_id", tokenId)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error(error);
      setLoadError(error.message);
      setMessages([]);
    } else {
      setMessages((data as MessageRow[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, [tokenId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSendError(null);

    const trimmed = text.trim();
    if (!trimmed) {
      setSendError("Message cannot be empty.");
      return;
    }

    setSending(true);

    const { error } = await supabase.from("token_portal_messages").insert([
      {
        token_id: tokenId,
        role: "holder", // 🔒 force all new messages to holder for now
        handle: handle || null,
        display_name: displayName || null,
        message: trimmed,
      },
    ]);

    setSending(false);

    if (error) {
      console.error(error);
      setSendError(error.message || "Failed to send message.");
      return;
    }

    setText("");
    // Refresh messages after posting
    fetchMessages();
  };

  return (
    <section className="border border-slate-800 rounded-2xl p-4 sm:p-6 bg-slate-900/60 space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-50">
            {name} Portal
          </h2>
          <p className="text-xs text-slate-400">
            Community room for <span className="font-mono">{symbol}</span>.{" "}
            For now, everyone posts as{" "}
            <span className="font-semibold text-slate-200">holder</span> to
            prevent fake dev/mod messages.
          </p>
        </div>
      </div>

      {/* New message form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3"
      >
        {sendError && (
          <div className="rounded-md border border-red-700 bg-red-900/40 px-3 py-2 text-[11px] text-red-100">
            {sendError}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="text-slate-400">
            Posting as{" "}
            <span className="font-semibold text-slate-200">holder</span>
          </span>

          <input
            type="text"
            className="flex-1 min-w-[120px] rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100 outline-none focus:border-cyan-500"
            placeholder="@handle (optional)"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
          />

          <input
            type="text"
            className="flex-1 min-w-[120px] rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100 outline-none focus:border-cyan-500"
            placeholder="Display name (optional)"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>

        <textarea
          className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-500 min-h-[70px]"
          placeholder="Drop an update, alpha, or question for this project..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={sending}
            className="inline-flex items-center rounded-md bg-cyan-500 px-4 py-1.5 text-xs font-medium text-slate-950 hover:bg-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {sending ? "Posting..." : "Post to Portal"}
          </button>
        </div>
      </form>

      {/* Messages list */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Latest activity</span>
          {loading && <span>Loading…</span>}
        </div>

        {loadError && (
          <p className="text-xs text-red-400">
            Error loading messages: {loadError}
          </p>
        )}

        {!loading && !loadError && messages.length === 0 && (
          <p className="text-xs text-slate-500">
            No messages yet. Be the first to talk in this portal.
          </p>
        )}

        <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
          {messages.map((m) => {
            const role = m.role || "holder";

            return (
              <div
                key={m.id}
                className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                        role === "dev"
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                          : role === "mod"
                          ? "bg-violet-500/20 text-violet-300 border border-violet-500/40"
                          : "bg-slate-700/40 text-slate-200 border border-slate-600/60"
                      }`}
                    >
                      {role}
                    </span>
                    {m.display_name && (
                      <span className="text-slate-100 font-medium">
                        {m.display_name}
                      </span>
                    )}
                    {m.handle && (
                      <span className="text-slate-400 font-mono text-[11px]">
                        {m.handle}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {new Date(m.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-slate-100 whitespace-pre-wrap">
                  {m.message}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
