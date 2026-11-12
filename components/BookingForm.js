"use client";
import { useState } from "react";
import Link from "next/link";

export default function BookingForm({ trip, email }) {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError("");
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ packageSlug: trip.slug, fullName: data.get("fullName"), phone: data.get("phone"), travelDate: data.get("travelDate"), travellers: data.get("travellers"), notes: data.get("notes") }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Could not submit your request.");
      setResult(body);
    } catch (submitError) {
      setError(submitError.message || "Could not submit your request. Please try again.");
    } finally { setBusy(false); }
  }
  if (result) return <div className="auth-card"><p className="eyebrow">BOOKED</p><h2>Your booking<br/><em>is recorded.</em></h2><p>Your booking has been saved. No payment has been taken and availability, services and travel arrangements are not verified; our team must confirm them separately.</p><p className="small-note">Reference: {result.id}</p><Link className="button button-dark" href="/account">View my bookings <i className="ar"/></Link></div>;
  return <form className="auth-card form-grid" onSubmit={submit}><p className="eyebrow">YOUR TRAVEL DETAILS</p><h2>Tell us a little<br/><em>about your plans.</em></h2><p className="muted-text">Your account email: {email}</p><label>Full name<input name="fullName" required minLength={2} maxLength={100} autoComplete="name" placeholder="Your name"/></label><label>Phone number<input name="phone" type="tel" required minLength={7} maxLength={30} autoComplete="tel" placeholder="+91"/></label><div className="form-two"><label>Preferred start date<input name="travelDate" type="date" min={new Date().toISOString().slice(0,10)} required/></label><label>Travellers<input name="travellers" type="number" min="1" max="20" defaultValue="2" required/></label></div><label>Anything else? <span className="optional">Optional</span><textarea name="notes" maxLength={2000} rows="4" placeholder="Your travel style, interests or questions. Please don’t include sensitive information."/></label><label className="consent"><input type="checkbox" required/><span>I agree to be contacted about this booking and have read the <Link href="/privacy">privacy information</Link>.</span></label>{error && <p className="form-message error" role="alert">{error}</p>}<button disabled={busy} className="button button-dark wide-button" type="submit">{busy ? "Saving booking…" : "Book this journey"} <span><i className="ar"/></span></button><p className="small-note">No online payment. Availability, transport and accommodation are not checked automatically and must be confirmed by our team.</p></form>;
}
