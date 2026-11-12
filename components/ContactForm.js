"use client";
import { useState } from "react";

export default function ContactForm({ initialSubject = "" }) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault(); setBusy(true); setMessage(""); setError(false);
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not send your message.");
      form.reset(); setMessage("Message sent to our team. We’ll review your enquiry in our admin inbox.");
    } catch (e) { setError(true); setMessage(e.message || "Could not send your message."); }
    finally { setBusy(false); }
  }
  return <form className="contact-panel form-grid" onSubmit={submit}><p className="eyebrow">SEND A MESSAGE</p><h2>Tell us what<br/><em>you’re dreaming of.</em></h2><label>Full name<input name="name" required minLength={2} maxLength={100} autoComplete="name"/></label><label>Email address<input name="email" type="email" required maxLength={254} autoComplete="email"/></label><label>Phone <span className="optional">Optional</span><input name="phone" type="tel" maxLength={30} autoComplete="tel"/></label><label>Subject<input name="subject" required minLength={2} maxLength={150} defaultValue={initialSubject}/></label><label>Message<textarea name="message" rows="5" minLength={10} maxLength={3000} required placeholder="Tell us about your plans or booking changes."/></label><label className="consent"><input type="checkbox" required/><span>I agree to be contacted about this message and have read the <a href="/privacy">privacy information</a>.</span></label>{message && <p className={`form-message${error ? " error" : ""}`} role={error ? "alert" : "status"}>{message}</p>}<button disabled={busy} type="submit" className="button button-dark">{busy ? "Sending…" : "Send message"} <span>↗</span></button></form>;
}
