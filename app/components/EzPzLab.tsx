'use client'
import { useState, useEffect, useRef } from "react";

// ── DESIGN TOKENS ──────────────────────────────────────────────
// Palette: lab notebook meets terminal
// #F7F5F0 parchment (bg), #0F0F0F ink (text), #C8F135 volt-green (accent)
// #E8E4DB warm rule, #6B6560 graphite (muted), #FF4D4D error-red
// Type: "Instrument Serif" display (restrained) + "DM Mono" utility
// Signature: every tool card has a hand-drawn underline SVG on hover

const TOOLS = [
  {
    id: "cold-email",
    icon: "✉",
    tag: "OUTREACH",
    name: "Cold Email Writer",
    desc: "Drop in a prospect's name, company, and what you're offering. Get a sharp, human-sounding cold email in seconds.",
    freeUses: 5,
    fields: [
      { key: "prospect", label: "Prospect name", placeholder: "e.g. Sarah Chen" },
      { key: "company", label: "Their company", placeholder: "e.g. Acme Corp" },
      { key: "offer", label: "What you're offering", placeholder: "e.g. SEO audit that doubled traffic for 3 SaaS companies" },
      { key: "sender", label: "Your name / role", placeholder: "e.g. Momo, founder at EzPzLab" },
    ],
    systemPrompt: (f: Record<string, string>) =>
      `You are an expert cold email copywriter. Write a cold email from ${f.sender} to ${f.prospect} at ${f.company}. The offer is: ${f.offer}. 
Rules: max 5 sentences, no buzzwords, conversational tone, one clear CTA. No subject line needed, just the email body. Start with their name.`,
    placeholder: "Your cold email will appear here...",
    color: "#C8F135",
  },
  {
    id: "resume-roaster",
    icon: "🔥",
    tag: "CAREER",
    name: "Resume Roaster",
    desc: "Paste your resume text. Get brutally honest feedback — what's weak, what's missing, what hiring managers actually skip.",
    freeUses: 5,
    fields: [
      { key: "resume", label: "Paste your resume", placeholder: "Paste your full resume text here...", multiline: true },
      { key: "role", label: "Role you're targeting", placeholder: "e.g. Senior Product Manager at a Series B startup" },
    ],
    systemPrompt: (f: Record<string, string>) =>
      `You are a senior hiring manager with 15 years experience. Roast this resume for someone targeting: ${f.role}.
Resume: ${f.resume}
Be direct and specific. Structure your response as:
🔴 WEAKNESSES (3 bullet points max)
🟡 MISSING (2 things they should add)
🟢 KEEP (1-2 things that actually work)
No fluff. Be the friend who tells the truth.`,
    placeholder: "Your roast will appear here — brace yourself...",
    color: "#FF4D4D",
  },
  {
    id: "contract-simplifier",
    icon: "📄",
    tag: "LEGAL",
    name: "Contract Simplifier",
    desc: "Paste any legal clause or contract section. Get plain English — what it means, what to watch out for.",
    freeUses: 5,
    fields: [
      { key: "contract", label: "Paste the contract text", placeholder: "Paste the clause or section you want simplified...", multiline: true },
    ],
    systemPrompt: (f: Record<string, string>) =>
      `You are a plain-language legal translator. Take this contract text and explain it in simple English:
${f.contract}
Structure:
📌 WHAT IT SAYS (1-2 sentences, plain English)
⚠️ WATCH OUT FOR (any risky or unusual terms)
✅ STANDARD OR NOT? (is this clause typical or unusual)
No legal advice disclaimer needed. Be direct.`,
    placeholder: "Plain English version will appear here...",
    color: "#7B61FF",
  },
];

// ── COMPONENTS ─────────────────────────────────────────────────

function TypewriterText({ text, speed = 18 }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const idx = useRef(0);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    idx.current = 0;
    if (!text) return;
    const iv = setInterval(() => {
      if (idx.current < text.length) {
        setDisplayed(text.slice(0, idx.current + 1));
        idx.current++;
      } else {
        setDone(true);
        clearInterval(iv);
      }
    }, speed);
    return () => clearInterval(iv);
  }, [text]);

  return (
    <span>
      {displayed}
      {!done && <span style={{ animation: "blink 1s step-end infinite", borderRight: "2px solid #0F0F0F" }}>&nbsp;</span>}
    </span>
  );
}

function ToolCard({ tool, onOpen }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpen(tool)}
      style={{
        background: "#fff",
        border: "1.5px solid #E8E4DB",
        borderRadius: 16,
        padding: "32px 28px",
        cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 12px 40px rgba(0,0,0,0.10)" : "0 2px 8px rgba(0,0,0,0.04)",
        borderColor: hovered ? tool.color : "#E8E4DB",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Accent strip */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: 3,
        background: tool.color,
        opacity: hovered ? 1 : 0,
        transition: "opacity 0.2s",
      }} />

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{
          width: 48, height: 48,
          background: tool.color + "22",
          borderRadius: 12,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22,
          border: `1.5px solid ${tool.color}44`,
        }}>
          {tool.icon}
        </div>
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: "2px",
          color: "#6B6560",
          background: "#F7F5F0",
          border: "1px solid #E8E4DB",
          padding: "4px 10px",
          borderRadius: 6,
        }}>
          {tool.tag}
        </span>
      </div>

      <div style={{
        fontFamily: "'Georgia', serif",
        fontSize: 20,
        fontWeight: 700,
        color: "#0F0F0F",
        marginBottom: 10,
        lineHeight: 1.2,
        letterSpacing: "-0.3px",
      }}>
        {tool.name}
      </div>

      <div style={{ fontSize: 14, color: "#6B6560", lineHeight: 1.6, marginBottom: 24 }}>
        {tool.desc}
      </div>

      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          color: "#6B6560",
        }}>
          {tool.freeUses} free / day
        </span>
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          fontFamily: "'DM Mono', monospace",
          fontSize: 12,
          fontWeight: 700,
          color: "#0F0F0F",
          transition: "gap 0.2s",
        }}>
          Try it {hovered ? "→" : "·"}
        </div>
      </div>
    </div>
  );
}

function ToolModal({ tool, onClose }) {
  const [fields, setFields] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const init = {};
    tool.fields.forEach(f => init[f.key] = "");
    setFields(init);
    setResult("");
    setError("");
  }, [tool]);

  const canRun = tool.fields.every(f => fields[f.key]?.trim());

  async function run() {
    if (!canRun) return;
    setLoading(true);
    setResult("");
    setError("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{ role: "user", content: tool.systemPrompt(fields) }],
        }),
      });
      const data = await res.json();
      const text = data?.content?.[0]?.text || "";
      if (!text) throw new Error("No response");
      setResult(text);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(15,15,15,0.55)",
      backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000,
      padding: "20px",
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: "#F7F5F0",
        borderRadius: 20,
        width: "100%",
        maxWidth: 680,
        maxHeight: "90vh",
        overflow: "auto",
        boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
        border: "1.5px solid #E8E4DB",
      }}>
        {/* Modal header */}
        <div style={{
          padding: "28px 32px 24px",
          borderBottom: "1px solid #E8E4DB",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#fff",
          borderRadius: "20px 20px 0 0",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 40, height: 40,
              background: tool.color + "22",
              borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18,
              border: `1.5px solid ${tool.color}44`,
            }}>
              {tool.icon}
            </div>
            <div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#6B6560", letterSpacing: "2px", marginBottom: 2 }}>{tool.tag}</div>
              <div style={{ fontFamily: "'Georgia', serif", fontSize: 18, fontWeight: 700, color: "#0F0F0F" }}>{tool.name}</div>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "#F7F5F0",
            border: "1px solid #E8E4DB",
            borderRadius: 8,
            width: 34, height: 34,
            cursor: "pointer",
            fontSize: 16,
            color: "#6B6560",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
        </div>

        {/* Fields */}
        <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 20 }}>
          {tool.fields.map(f => (
            <div key={f.key}>
              <label style={{
                display: "block",
                fontFamily: "'DM Mono', monospace",
                fontSize: 11,
                fontWeight: 500,
                color: "#6B6560",
                letterSpacing: "1.5px",
                marginBottom: 8,
                textTransform: "uppercase",
              }}>
                {f.label}
              </label>
              {f.multiline ? (
                <textarea
                  value={fields[f.key] || ""}
                  onChange={e => setFields(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  rows={5}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    background: "#fff",
                    border: "1.5px solid #E8E4DB",
                    borderRadius: 10,
                    fontSize: 14,
                    color: "#0F0F0F",
                    fontFamily: "'DM Mono', monospace",
                    resize: "vertical",
                    outline: "none",
                    transition: "border-color 0.15s",
                    lineHeight: 1.6,
                    boxSizing: "border-box",
                  }}
                  onFocus={e => e.target.style.borderColor = tool.color}
                  onBlur={e => e.target.style.borderColor = "#E8E4DB"}
                />
              ) : (
                <input
                  value={fields[f.key] || ""}
                  onChange={e => setFields(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    background: "#fff",
                    border: "1.5px solid #E8E4DB",
                    borderRadius: 10,
                    fontSize: 14,
                    color: "#0F0F0F",
                    fontFamily: "'DM Mono', monospace",
                    outline: "none",
                    transition: "border-color 0.15s",
                    boxSizing: "border-box",
                  }}
                  onFocus={e => e.target.style.borderColor = tool.color}
                  onBlur={e => e.target.style.borderColor = "#E8E4DB"}
                  onKeyDown={e => e.key === "Enter" && run()}
                />
              )}
            </div>
          ))}

          {/* Run button */}
          <button
            onClick={run}
            disabled={!canRun || loading}
            style={{
              width: "100%",
              padding: "14px",
              background: canRun && !loading ? "#0F0F0F" : "#E8E4DB",
              color: canRun && !loading ? tool.color : "#6B6560",
              border: "none",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "'DM Mono', monospace",
              letterSpacing: "1px",
              cursor: canRun && !loading ? "pointer" : "not-allowed",
              transition: "all 0.15s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            {loading ? (
              <>
                <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>◌</span>
                &nbsp;Running...
              </>
            ) : (
              `Run ${tool.name} →`
            )}
          </button>

          {/* Result */}
          {(result || error) && (
            <div style={{
              background: "#fff",
              border: `1.5px solid ${error ? "#FF4D4D" : tool.color}`,
              borderRadius: 12,
              overflow: "hidden",
            }}>
              <div style={{
                padding: "10px 16px",
                background: error ? "#FF4D4D11" : tool.color + "18",
                borderBottom: `1px solid ${error ? "#FF4D4D33" : tool.color + "33"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <span style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "2px",
                  color: error ? "#FF4D4D" : "#0F0F0F",
                }}>
                  {error ? "ERROR" : "OUTPUT"}
                </span>
                {result && (
                  <button onClick={copy} style={{
                    background: "none",
                    border: "1px solid #E8E4DB",
                    borderRadius: 6,
                    padding: "3px 10px",
                    fontSize: 11,
                    fontFamily: "'DM Mono', monospace",
                    cursor: "pointer",
                    color: "#6B6560",
                  }}>
                    {copied ? "Copied ✓" : "Copy"}
                  </button>
                )}
              </div>
              <div style={{
                padding: "20px",
                fontSize: 14,
                lineHeight: 1.75,
                color: error ? "#FF4D4D" : "#0F0F0F",
                fontFamily: result ? "inherit" : "'DM Mono', monospace",
                whiteSpace: "pre-wrap",
                minHeight: 80,
              }}>
                {error ? error : <TypewriterText text={result} speed={12} />}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── MAIN APP ───────────────────────────────────────────────────
export default function EzPzLab() {
  const [activeTool, setActiveTool] = useState(null);
  const [filter, setFilter] = useState("ALL");

  const tags = ["ALL", ...Array.from(new Set(TOOLS.map(t => t.tag)))];

  const filtered = filter === "ALL" ? TOOLS : TOOLS.filter(t => t.tag === filter);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F7F5F0",
      fontFamily: "'Inter', -apple-system, sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Georgia&display=swap');
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing: border-box; }
        ::placeholder { color: #B8B3AC; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #F7F5F0; }
        ::-webkit-scrollbar-thumb { background: #D8D3CB; border-radius: 3px; }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(247,245,240,0.9)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #E8E4DB",
        padding: "0 5%",
        height: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 28, height: 28,
            background: "#0F0F0F",
            borderRadius: 7,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, color: "#C8F135",
            fontFamily: "'DM Mono', monospace",
            fontWeight: 700,
          }}>⚗</div>
          <span style={{
            fontFamily: "'Georgia', serif",
            fontWeight: 700,
            fontSize: 16,
            color: "#0F0F0F",
            letterSpacing: "-0.3px",
          }}>
            EzPz<span style={{ color: "#C8F135", background: "#0F0F0F", padding: "0 4px", borderRadius: 4 }}>Lab</span>
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            color: "#6B6560",
            background: "#fff",
            border: "1px solid #E8E4DB",
            padding: "5px 12px",
            borderRadius: 7,
          }}>
            {TOOLS.length} tools · free
          </span>
          <button style={{
            background: "#0F0F0F",
            color: "#C8F135",
            border: "none",
            borderRadius: 8,
            padding: "8px 16px",
            fontSize: 12,
            fontWeight: 700,
            fontFamily: "'DM Mono', monospace",
            cursor: "pointer",
            letterSpacing: "0.5px",
          }}>
            Go Pro →
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={{
        padding: "72px 5% 56px",
        maxWidth: 800,
        animation: "fadeUp 0.5s ease both",
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          color: "#6B6560",
          background: "#fff",
          border: "1px solid #E8E4DB",
          padding: "5px 12px",
          borderRadius: 6,
          marginBottom: 24,
          letterSpacing: "1.5px",
        }}>
          <span style={{ color: "#C8F135", background: "#0F0F0F", borderRadius: 3, padding: "1px 5px", fontSize: 10 }}>BETA</span>
          AI-powered micro-tools · no signup needed
        </div>

        <h1 style={{
          fontFamily: "'Georgia', serif",
          fontSize: "clamp(38px, 6vw, 62px)",
          fontWeight: 700,
          color: "#0F0F0F",
          lineHeight: 1.08,
          letterSpacing: "-1px",
          marginBottom: 20,
        }}>
          Tiny tools.<br />
          <span style={{
            background: "#C8F135",
            padding: "2px 12px",
            borderRadius: 6,
            display: "inline-block",
            marginTop: 4,
          }}>
            Big output.
          </span>
        </h1>

        <p style={{
          fontSize: 17,
          color: "#6B6560",
          lineHeight: 1.65,
          maxWidth: 520,
          marginBottom: 0,
        }}>
          AI tools built for the task — not for a subscription you forget to cancel.
          Pick a tool, fill in the blanks, get your output. That's it.
        </p>
      </div>

      {/* ── DIVIDER ── */}
      <div style={{ padding: "0 5%", marginBottom: 36 }}>
        <div style={{ height: 1, background: "#E8E4DB" }} />
      </div>

      {/* ── FILTERS ── */}
      <div style={{
        padding: "0 5%",
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 32,
        flexWrap: "wrap",
      }}>
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          color: "#6B6560",
          marginRight: 4,
          letterSpacing: "1px",
        }}>FILTER:</span>
        {tags.map(tag => (
          <button
            key={tag}
            onClick={() => setFilter(tag)}
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "1.5px",
              padding: "6px 14px",
              borderRadius: 7,
              border: "1.5px solid",
              cursor: "pointer",
              transition: "all 0.15s",
              background: filter === tag ? "#0F0F0F" : "#fff",
              color: filter === tag ? "#C8F135" : "#6B6560",
              borderColor: filter === tag ? "#0F0F0F" : "#E8E4DB",
            }}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* ── TOOL GRID ── */}
      <div style={{
        padding: "0 5% 80px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 20,
      }}>
        {filtered.map((tool, i) => (
          <div key={tool.id} style={{ animation: `fadeUp 0.4s ease ${i * 0.08}s both` }}>
            <ToolCard tool={tool} onOpen={setActiveTool} />
          </div>
        ))}

        {/* Coming soon cards */}
        {[
          { name: "Ad Copy Generator", tag: "MARKETING", icon: "📣" },
          { name: "Domain Name Finder", tag: "BRANDING", icon: "🔍" },
          { name: "Meeting Summarizer", tag: "PRODUCTIVITY", icon: "📝" },
        ].filter(() => filter === "ALL").map((t, i) => (
          <div key={t.name} style={{
            animation: `fadeUp 0.4s ease ${(filtered.length + i) * 0.08}s both`,
            background: "#fff",
            border: "1.5px dashed #D8D3CB",
            borderRadius: 16,
            padding: "32px 28px",
            opacity: 0.5,
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{
                width: 48, height: 48,
                background: "#F7F5F0",
                borderRadius: 12,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22,
                border: "1.5px solid #E8E4DB",
                filter: "grayscale(1)",
              }}>
                {t.icon}
              </div>
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                letterSpacing: "2px",
                color: "#6B6560",
                background: "#F7F5F0",
                border: "1px solid #E8E4DB",
                padding: "4px 10px",
                borderRadius: 6,
              }}>SOON</span>
            </div>
            <div style={{
              fontFamily: "'Georgia', serif",
              fontSize: 20,
              fontWeight: 700,
              color: "#B8B3AC",
              marginBottom: 8,
            }}>{t.name}</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#B8B3AC", letterSpacing: "1px" }}>
              Coming soon · {t.tag}
            </div>
          </div>
        ))}
      </div>

      {/* ── PRO BANNER ── */}
      <div style={{
        margin: "0 5% 80px",
        background: "#0F0F0F",
        borderRadius: 20,
        padding: "48px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 24,
      }}>
        <div>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            color: "#C8F135",
            letterSpacing: "2px",
            marginBottom: 12,
          }}>// PRO PLAN</div>
          <div style={{
            fontFamily: "'Georgia', serif",
            fontSize: 28,
            fontWeight: 700,
            color: "#fff",
            marginBottom: 10,
            letterSpacing: "-0.5px",
          }}>
            Unlimited runs. Every tool.
          </div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
            Remove daily limits · priority AI · early access to new tools
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20, flexShrink: 0 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{
              fontFamily: "'Georgia', serif",
              fontSize: 40,
              fontWeight: 700,
              color: "#C8F135",
              lineHeight: 1,
            }}>$9</div>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "1px",
            }}>/month</div>
          </div>
          <button style={{
            background: "#C8F135",
            color: "#0F0F0F",
            border: "none",
            borderRadius: 10,
            padding: "14px 28px",
            fontSize: 14,
            fontWeight: 700,
            fontFamily: "'DM Mono', monospace",
            cursor: "pointer",
            letterSpacing: "0.5px",
            whiteSpace: "nowrap",
          }}>
            Get Pro →
          </button>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{
        padding: "28px 5%",
        borderTop: "1px solid #E8E4DB",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
      }}>
        <span style={{
          fontFamily: "'Georgia', serif",
          fontWeight: 700,
          fontSize: 14,
          color: "#0F0F0F",
        }}>
          EzPz<span style={{ color: "#C8F135", background: "#0F0F0F", padding: "0 3px", borderRadius: 3 }}>Lab</span>
        </span>
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          color: "#B8B3AC",
          letterSpacing: "0.5px",
        }}>
          by Adpins Ltd · ezpzlab.com
        </span>
        <div style={{ display: "flex", gap: 20 }}>
          {["Terms", "Privacy", "Contact"].map(l => (
            <a key={l} href="#" style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              color: "#6B6560",
              textDecoration: "none",
              letterSpacing: "0.5px",
            }}>{l}</a>
          ))}
        </div>
      </footer>

      {/* ── MODAL ── */}
      {activeTool && (
        <ToolModal tool={activeTool} onClose={() => setActiveTool(null)} />
      )}
    </div>
  );
}
