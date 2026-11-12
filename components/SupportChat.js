"use client";
import { useState } from "react";

export default function SupportChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function send(event) {
    event.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    const next = [...messages, { role: "user", content: text }].slice(-11);
    setMessages(next); setInput(""); setBusy(true); setError("");
    try {
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not send message.");
      setMessages((current)=>[...current, { role: "assistant", content: result.reply }]);
    } catch (e) { setError(e.message || "Could not send message."); }
    finally { setBusy(false); }
  }
  return <div className="support-widget"><button className="support-launcher" onClick={()=>setOpen(!open)} aria-expanded={open} aria-controls="support-chat">{open ? "Close ×" : "Ask NE Travels ✦"}</button>{open && <div className="support-panel" id="support-chat"><div className="support-header"><div><strong>NE Travels support</strong><small>AI travel assistant</small></div><button onClick={()=>setOpen(false)} aria-label="Close chat">×</button></div><div className="support-messages" aria-live="polite"><p className="support-intro">Ask about our journeys, planning or booking. Messages are sent to NVIDIA’s model provider; don’t share sensitive information. AI answers can be mistaken.</p>{messages.map((message, index)=><div key={index} className={`support-message ${message.role}`}>{message.content}</div>)}{busy && <p className="small-note">Thinking…</p>}{error && <p role="alert" className="form-message error">{error} <a href="/contact">Contact us ↗</a></p>}</div><form className="support-form" onSubmit={send}><input aria-label="Chat message" value={input} onChange={(event)=>setInput(event.target.value)} maxLength={2000} placeholder="Ask us anything…" required/><button disabled={busy} type="submit">Send</button></form></div>}</div>;
}
