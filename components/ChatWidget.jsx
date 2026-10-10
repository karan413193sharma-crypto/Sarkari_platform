"use client";
import { useState, useRef, useEffect } from "react";

const SUGGESTIONS = [
  "I'm in 12th with maths",
  "SSC CGL syllabus",
  "IBPS PO last date",
  "Exams after graduation",
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({});
  const [misses, setMisses] = useState(0);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! Ask me about any government exam: eligibility, syllabus, dates or apply links." },
  ]);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, open]);

  async function send(text) {
    const msg = (typeof text === "string" ? text : input).trim();
    if (!msg || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: msg }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, profile, misses }),
      });
      const data = await res.json();
      if (data.profile) setProfile(data.profile);
      setMisses(data.fallback ? misses + 1 : 0);
      setMessages((m) => [
        ...m,
        {
          role: "bot",
          text: data.reply ?? "I couldn't find an answer for that.",
          suggestions: data.suggestions,
        },
      ]);
    } catch (err) {
      console.error("chat widget error:", err);
      setMessages((m) => [...m, { role: "bot", text: "Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{css}</style>

      {!open && (
        <button className="cw-fab" onClick={() => setOpen(true)} aria-label="Open chat">
          💬
        </button>
      )}

      {open && (
        <div className="cw-panel" role="dialog" aria-label="Exam assistant">
          <div className="cw-header">
            <div>
              <strong>SarkariPath Assistant</strong>
              <div className="cw-sub">Answers from our exam database</div>
            </div>
            <button className="cw-close" onClick={() => setOpen(false)} aria-label="Close chat">✕</button>
          </div>

          <div className="cw-body">
            {messages.map((m, i) => (
              <div key={i} style={{ display: "contents" }}>
                <div className={`cw-msg ${m.role}`}>{m.text}</div>
                {m.suggestions?.length > 0 && i === messages.length - 1 && !loading && (
                  <div className="cw-chips">
                    {m.suggestions.map((s) => (
                      <button key={s} onClick={() => send(s)}>{s}</button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && <div className="cw-msg bot cw-typing"><span /><span /><span /></div>}
            {messages.length === 1 && (
              <div className="cw-chips">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => send(s)}>{s}</button>
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="cw-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask about an exam..."
              disabled={loading}
            />
            <button onClick={() => send()} disabled={loading || !input.trim()}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}

const css = `
:root{--cw-primary:#9B3FD9;--cw-bg:#fff;--cw-text:#111827;--cw-muted:#6b7280;--cw-bot:#f3f4f6;--cw-border:#e5e7eb}
@media (prefers-color-scheme:dark){:root{--cw-bg:#111827;--cw-text:#f9fafb;--cw-muted:#9ca3af;--cw-bot:#1f2937;--cw-border:#374151}}
.cw-fab{position:fixed;right:20px;bottom:20px;width:56px;height:56px;border-radius:50%;border:none;background:var(--cw-primary);color:#fff;font-size:24px;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.25);z-index:9999}
.cw-panel{position:fixed;right:20px;bottom:20px;width:360px;max-width:calc(100vw - 24px);height:520px;max-height:calc(100vh - 40px);background:var(--cw-bg);color:var(--cw-text);border:1px solid var(--cw-border);border-radius:16px;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,.25);z-index:9999;font-family:inherit}
.cw-header{display:flex;justify-content:space-between;align-items:center;padding:12px 14px;background:var(--cw-primary);color:#fff}
.cw-sub{font-size:11px;opacity:.85}
.cw-close{background:none;border:none;color:#fff;font-size:16px;cursor:pointer}
.cw-body{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px}
.cw-msg{max-width:85%;padding:8px 12px;border-radius:12px;font-size:14px;line-height:1.4;white-space:pre-wrap;word-break:break-word}
.cw-msg.bot{align-self:flex-start;background:var(--cw-bot)}
.cw-msg.user{align-self:flex-end;background:var(--cw-primary);color:#fff}
.cw-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px}
.cw-chips button{font-size:12px;padding:6px 10px;border-radius:999px;border:1px solid var(--cw-border);background:var(--cw-bg);color:var(--cw-text);cursor:pointer}
.cw-typing{display:flex;gap:4px}
.cw-typing span{width:6px;height:6px;border-radius:50%;background:var(--cw-muted);animation:cwb 1s infinite}
.cw-typing span:nth-child(2){animation-delay:.15s}.cw-typing span:nth-child(3){animation-delay:.3s}
@keyframes cwb{0%,80%,100%{opacity:.3}40%{opacity:1}}
.cw-input{display:flex;gap:8px;padding:10px;border-top:1px solid var(--cw-border)}
.cw-input input{flex:1;padding:9px 12px;border-radius:10px;border:1px solid var(--cw-border);background:var(--cw-bg);color:var(--cw-text);font-size:14px;outline:none}
.cw-input button{padding:0 16px;border-radius:10px;border:none;background:var(--cw-primary);color:#fff;cursor:pointer}
.cw-input button:disabled{opacity:.5;cursor:not-allowed}
`;