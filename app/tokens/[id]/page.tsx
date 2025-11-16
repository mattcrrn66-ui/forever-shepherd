"use client";

import { useEffect, useState, FormEvent } from "react";
import { createClient } from "@/lib/supabaseClient";

const supabase = createClient();

interface TokenPortalProps {
  tokenId: string;
}

type PortalMessage = {
  id: string;
  token_id: string;
  role: string | null;
  handle: string | null;
  display_name: string | null;
  message: string;
  created_at: string;
};

export default function TokenPortal({ tokenId }: TokenPortalProps) {
  const [displayName, setDisplayName] = useState("");
  const [handle, setHandle] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<PortalMessage[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchMessages() {
    setLoading(true);

    const { data, error } = await supabase
      .from("token_portal_messages")
      .select("*")
      .eq("token_id", tokenId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error(error);
      setStatus("Error loading messages: " + error.message);
    } else {
      setMessages(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchMessages();
  }, [tokenId]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("");

    if (!message.trim()) {
      setStatus("Message cannot be empty.");
      return;
    }

    const name = displayName.trim() || "Anon";
    const userHandle = handle.trim() || null;

    const { data, error } = await supabase
      .from("token_portal_messages")
      .insert({
        token_id: tokenId,
        display_name: name,
        handle: userHandle,
        role: "holder",
        message: message.trim(),
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      setStatus("Error posting message: " + error.message);
      return;
    }

    setMessages((prev) => [data as PortalMessage, ...prev]);
    setMessage("");
    if (!displayName.trim()) setDisplayName("Anon");
    setStatus("Message posted.");
  }

  return (
    <section className="border border-slate-800 rounded-xl p-4 sm:p-6 bg-slate-900/60">
      <h2 className="text-xl sm:text-2xl font-semibold mb-3">
        Community Portal
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Display name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full sm:w-1/3 rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-cyan-400"
          />
          <input
            type="text"
            placeholder="@handle (optional)"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            className="w-full sm:w-1/3 rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-cyan-400"
          />

          <textarea
            placeholder="Message…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-cyan-400"
          />
        </div>

        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-indigo-500 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          Post message
        </button>
        {status && <p className="text-xs text-slate-300">{status}</p>}
      </form>

      {/* Messages */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {loading ? (
          <p className="text-sm text-slate-400">Loading messages…</p>
        ) : messages.length === 0 ? (
          <p className="text-sm text-slate-500">
            No messages yet. Start the conversation.
          </p>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className="rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-cyan-300">
                  {m.display_name || "Anon"}
                  {m.handle && (
                    <span className="text-slate-500 ml-1">{m.handle}</span>
                  )}
                </span>
                <span className="text-[10px] text-slate-500">
                  {new Date(m.created_at).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-slate-100 whitespace-pre-wrap mt-1">
                {m.message}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
