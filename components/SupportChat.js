"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";

const starters = ["Best time to visit Meghalaya?", "Which journey suits a family?", "Do I need a permit for Tawang?", "How does booking work?"];

export default function SupportChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [messages, busy, error]);

  async function ask(raw) {
    const text = raw.trim();
    if (!text || busy) return;
    const next = [...messages, { role: "user", content: text }].slice(-11);
    setMessages(next); setInput(""); setBusy(true); setError("");
    try {
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not send message.");
      setMessages((current) => [...current, { role: "assistant", content: result.reply }]);
    } catch (e) { setError(e.message || "Could not send message."); }
    finally { setBusy(false); }
  }

  return (
    <div className="support-widget">
      {!open && <button className="support-launcher" onClick={() => setOpen(true)} aria-expanded={false} aria-controls="support-chat"><Icon name="chat" /> Ask NE Travels</button>}
      {open && (
        <div className="support-panel" id="support-chat" role="dialog" aria-modal="true" aria-label="NE Travels assistant">
          <div className="support-header">
            <div><strong>NE Travels assistant</strong><small>AI travel guide · replies in seconds</small></div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close chat"><i className="ar x" /></button>
          </div>
          <div className="support-messages" aria-live="polite">
            <div className="support-inner">
              <p className="support-intro">Ask about our journeys, the best time to travel, permits or how booking works. Messages are sent to NVIDIA’s model provider, so please don’t share sensitive information. AI answers can be mistaken.</p>
              {messages.length === 0 && <div className="support-starters">{starters.map((s) => <button key={s} type="button" onClick={() => ask(s)}>{s}</button>)}</div>}
              {messages.map((message, index) => <div key={index} className={`support-message ${message.role}`}>{message.content}</div>)}
              {busy && <p className="support-typing">Thinking<span>.</span><span>.</span><span>.</span></p>}
              {error && <p role="alert" className="form-message error">{error} <a href="/contact">Contact us <i className="ar" /></a></p>}
              <div ref={endRef} />
            </div>
          </div>
          <form className="support-form" onSubmit={(e) => { e.preventDefault(); ask(input); }}>
            <div className="support-inner support-row">
              <input aria-label="Chat message" value={input} onChange={(e) => setInput(e.target.value)} maxLength={2000} placeholder="Ask us anything about the Northeast…" autoComplete="off" />
              <button disabled={busy || !input.trim()} type="submit" aria-label="Send"><Icon name="send" /></button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
