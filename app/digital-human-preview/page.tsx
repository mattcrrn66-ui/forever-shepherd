"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";

type Character = {
  id: string;
  name: string;
  initials: string;
  tagline: string;
  kind: "historical" | "original";
  description: string;
};

const CHARACTERS: Character[] = [
  {
    id: "charlie-kirk-archive",
    name: "Charlie Kirk Archive",
    initials: "CK",
    tagline: "Source-grounded historical simulation",
    kind: "historical",
    description:
      "Historical archive mode. Spoken claims must be supported by retrieved evidence; inferred material is labeled separately.",
  },
  {
    id: "professor-atlas",
    name: "Professor Atlas",
    initials: "PA",
    tagline: "Original AI character",
    kind: "original",
    description:
      "Original character included with the engine so the conversation, voice, memory, and animation pipeline can be tested end to end.",
  },
];

const sampleSources = [
  {
    n: 1,
    title: "Character archive source",
    meta: "Dated source record",
    excerpt:
      "The production engine displays the exact retrieved source excerpt here. This branch is a visual preview only and is not connected to Supabase or the GPU worker.",
  },
  {
    n: 2,
    title: "Historical grounding guard",
    meta: "Engine safeguard",
    excerpt:
      "Historical speech is permitted only when its evidence excerpt can be found in the retrieved source note. Unsupported claims are refused.",
  },
];

export default function DigitalHumanPreview() {
  const [activeId, setActiveId] = useState(CHARACTERS[0].id);
  const [tab, setTab] = useState<"sources" | "transcript" | "about">("sources");
  const [draft, setDraft] = useState("");
  const [turns, setTurns] = useState<{ role: "user" | "assistant"; text: string }[]>([
    {
      role: "assistant",
      text: "Visual preview is live. Connect the GPU worker and Supabase to turn this into the real speaking digital human.",
    },
  ]);

  const active = useMemo(
    () => CHARACTERS.find((c) => c.id === activeId) ?? CHARACTERS[0],
    [activeId]
  );

  function send() {
    const text = draft.trim();
    if (!text) return;
    setTurns((old) => [
      ...old,
      { role: "user", text },
      {
        role: "assistant",
        text:
          active.kind === "historical"
            ? "Preview mode: the live engine would retrieve dated source material, verify the evidence, then generate the answer, voice, and lip-sync."
            : "Preview mode: the live engine would send this turn to the worker, generate the response, synthesize speech, and animate the character.",
      },
    ]);
    setDraft("");
  }

  const lastAssistant = [...turns].reverse().find((t) => t.role === "assistant");

  return (
    <main style={styles.page}>
      <div style={styles.topbar}>
        <div>
          <p style={styles.eyebrow}>DIGITAL HUMAN ENGINE</p>
          <h1 style={styles.title}>Character Studio</h1>
        </div>
        <div style={styles.previewBadge}>VISUAL PREVIEW · WORKER OFFLINE</div>
      </div>

      <nav style={styles.roster} aria-label="Characters">
        {CHARACTERS.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              setActiveId(c.id);
              setTurns([
                {
                  role: "assistant",
                  text: "Visual preview is live. Connect the GPU worker and Supabase to turn this into the real speaking digital human.",
                },
              ]);
            }}
            style={{
              ...styles.chip,
              ...(active.id === c.id ? styles.chipOn : {}),
            }}
          >
            {c.name}
          </button>
        ))}
      </nav>

      <div style={styles.layout}>
        <section style={styles.stage}>
          <div style={styles.spot}>
            <div style={styles.avatarGlow} />
            <div style={styles.avatar}>{active.initials}</div>
            <div style={styles.label}>
              {active.kind === "historical" ? "AI simulation, not the real person" : "AI character"}
            </div>
            <div style={styles.liveDotWrap}>
              <span style={styles.liveDot} />
              Ready
            </div>
          </div>

          <div style={styles.nameplate}>
            <h2 style={styles.characterName}>{active.name}</h2>
            <p style={styles.tagline}>{active.tagline}</p>
          </div>
        </section>

        <section style={styles.side}>
          <div style={styles.status}>
            <span style={styles.statusDot} />
            Tap the mic to talk, or type below
          </div>

          {lastAssistant && (
            <section style={styles.reply}>
              <p style={styles.say}>{lastAssistant.text}</p>
            </section>
          )}

          <div style={styles.composer}>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") send();
              }}
              placeholder={`Ask ${active.name} anything`}
              style={styles.input}
              aria-label="Message"
            />
            <button onClick={send} style={styles.send}>
              Send
            </button>
            <button
              style={styles.mic}
              aria-label="Microphone preview"
              title="Microphone activates when the real worker is connected"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="9" y="3" width="6" height="11" rx="3" />
                <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
              </svg>
            </button>
          </div>

          <section style={styles.panel}>
            <div style={styles.tabs}>
              {(["sources", "transcript", "about"] as const).map((key) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  style={{
                    ...styles.tab,
                    ...(tab === key ? styles.tabOn : {}),
                  }}
                >
                  {key === "about" ? "About" : key[0].toUpperCase() + key.slice(1)}
                </button>
              ))}
            </div>

            <div style={styles.tabBody}>
              {tab === "sources" && (
                <ol style={styles.sources}>
                  {sampleSources.map((s) => (
                    <li key={s.n} style={styles.sourceItem}>
                      <div style={styles.sourceTitle}>
                        <span style={styles.sourceN}>{s.n}</span>
                        <strong>{s.title}</strong>
                      </div>
                      <p style={styles.meta}>{s.meta}</p>
                      <p style={styles.excerpt}>{s.excerpt}</p>
                    </li>
                  ))}
                </ol>
              )}

              {tab === "transcript" && (
                <div>
                  {turns.map((t, i) => (
                    <div key={i} style={styles.turn}>
                      <p style={styles.who}>{t.role === "user" ? "You" : active.name}</p>
                      <p style={styles.turnText}>{t.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {tab === "about" && (
                <div>
                  <p style={styles.aboutText}>{active.description}</p>
                  <p style={styles.meta}>
                    The full engine adds microphone capture, GPU speech-to-text, RAG retrieval, LLM reasoning, TTS, optional voice matching, MuseTalk lip-sync, citations, and conversation memory.
                  </p>
                </div>
              )}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#1a2233",
    color: "#eceff4",
    padding: "18px clamp(16px, 3vw, 34px) 40px",
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  topbar: {
    maxWidth: 1180,
    margin: "0 auto 14px",
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    alignItems: "flex-end",
    flexWrap: "wrap",
  },
  eyebrow: {
    margin: 0,
    color: "#9aa5ba",
    fontSize: 12,
    letterSpacing: "0.16em",
    fontWeight: 800,
  },
  title: {
    margin: "4px 0 0",
    fontSize: "clamp(28px, 5vw, 46px)",
    lineHeight: 1,
    letterSpacing: "-0.04em",
  },
  previewBadge: {
    border: "1px solid #f2b33d",
    color: "#f2b33d",
    borderRadius: 999,
    padding: "7px 11px",
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: "0.06em",
  },
  roster: {
    maxWidth: 1180,
    margin: "0 auto",
    display: "flex",
    gap: 8,
    overflowX: "auto",
    paddingBottom: 12,
  },
  chip: {
    flex: "none",
    border: "1px solid #3a4763",
    background: "transparent",
    borderRadius: 999,
    padding: "7px 14px",
    color: "#9aa5ba",
    cursor: "pointer",
  },
  chipOn: {
    borderColor: "#eceff4",
    color: "#eceff4",
  },
  layout: {
    maxWidth: 1180,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "minmax(280px, 0.86fr) minmax(320px, 1.14fr)",
    gap: 28,
    alignItems: "start",
  },
  stage: {
    position: "sticky",
    top: 18,
  },
  spot: {
    position: "relative",
    width: "100%",
    aspectRatio: "4 / 5",
    maxHeight: "70vh",
    borderRadius: 28,
    overflow: "hidden",
    background: "radial-gradient(ellipse 70% 60% at 50% 38%, #334564, #1a2233 75%)",
    border: "1px solid #3a4763",
    display: "grid",
    placeItems: "center",
  },
  avatarGlow: {
    position: "absolute",
    width: "72%",
    aspectRatio: "1",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(236,239,244,.13), rgba(236,239,244,0) 68%)",
  },
  avatar: {
    position: "relative",
    width: "48%",
    aspectRatio: "1",
    borderRadius: "50%",
    border: "1px solid #5d6c8a",
    display: "grid",
    placeItems: "center",
    fontSize: "clamp(64px, 12vw, 130px)",
    fontWeight: 800,
    letterSpacing: "-0.08em",
    color: "#52617e",
    boxShadow: "0 0 80px rgba(0,0,0,.22)",
  },
  label: {
    position: "absolute",
    top: 14,
    left: 14,
    borderRadius: 8,
    background: "rgba(26,34,51,.85)",
    padding: "5px 10px",
    fontSize: 12,
    fontWeight: 800,
  },
  liveDotWrap: {
    position: "absolute",
    right: 14,
    bottom: 14,
    display: "flex",
    gap: 8,
    alignItems: "center",
    background: "rgba(26,34,51,.85)",
    padding: "6px 10px",
    borderRadius: 999,
    color: "#cbd2df",
    fontSize: 12,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#f2b33d",
    display: "inline-block",
  },
  nameplate: {
    padding: "14px 4px 0",
  },
  characterName: {
    margin: 0,
    fontSize: "clamp(30px, 5vw, 48px)",
    lineHeight: 1,
    letterSpacing: "-0.04em",
  },
  tagline: {
    margin: "8px 0 0",
    color: "#9aa5ba",
  },
  side: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
    minWidth: 0,
  },
  status: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    color: "#9aa5ba",
    fontSize: 14,
  },
  statusDot: {
    width: 9,
    height: 9,
    borderRadius: "50%",
    background: "#3a4763",
  },
  reply: {
    minHeight: 118,
    display: "flex",
    alignItems: "center",
    borderRadius: 18,
    background: "#202b40",
    padding: 20,
    border: "1px solid #33415d",
  },
  say: {
    margin: 0,
    fontSize: "clamp(21px, 3.6vw, 28px)",
    lineHeight: 1.36,
    fontWeight: 800,
    maxWidth: "36ch",
  },
  composer: {
    display: "grid",
    gridTemplateColumns: "1fr auto auto",
    gap: 8,
    alignItems: "center",
  },
  input: {
    minWidth: 0,
    height: 54,
    borderRadius: 14,
    border: "1px solid #3a4763",
    background: "#222c40",
    color: "#eceff4",
    padding: "0 15px",
    fontSize: 16,
    outline: "none",
  },
  send: {
    height: 54,
    padding: "0 16px",
    borderRadius: 14,
    border: "1px solid #3a4763",
    background: "transparent",
    color: "#eceff4",
    cursor: "pointer",
  },
  mic: {
    width: 62,
    height: 62,
    borderRadius: "50%",
    border: 0,
    display: "grid",
    placeItems: "center",
    background: "#eceff4",
    color: "#1a2233",
    cursor: "pointer",
  },
  panel: {
    borderTop: "1px solid #3a4763",
    paddingTop: 4,
  },
  tabs: {
    display: "flex",
    gap: 5,
  },
  tab: {
    border: 0,
    borderBottom: "2px solid transparent",
    background: "transparent",
    color: "#9aa5ba",
    padding: "10px 12px",
    cursor: "pointer",
    fontWeight: 700,
  },
  tabOn: {
    color: "#eceff4",
    borderBottomColor: "#eceff4",
  },
  tabBody: {
    paddingTop: 13,
  },
  sources: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "grid",
    gap: 12,
  },
  sourceItem: {
    border: "1px solid #3a4763",
    borderRadius: 14,
    padding: 14,
    background: "#202a3d",
  },
  sourceTitle: {
    display: "flex",
    gap: 10,
    alignItems: "center",
  },
  sourceN: {
    width: 25,
    height: 25,
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    background: "#eceff4",
    color: "#1a2233",
    fontWeight: 900,
    fontSize: 12,
    flex: "none",
  },
  meta: {
    margin: "6px 0 0",
    color: "#9aa5ba",
    fontSize: 13,
  },
  excerpt: {
    margin: "9px 0 0",
    color: "#cbd2df",
    fontSize: 14,
    lineHeight: 1.55,
  },
  turn: {
    padding: "10px 0",
    borderBottom: "1px solid #33415d",
  },
  who: {
    margin: 0,
    color: "#9aa5ba",
    fontSize: 12,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  turnText: {
    margin: "4px 0 0",
    lineHeight: 1.55,
  },
  aboutText: {
    margin: 0,
    fontSize: 17,
    lineHeight: 1.6,
  },
};

