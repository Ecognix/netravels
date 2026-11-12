"use client";
import { useState } from "react";

export default function AdminPrices({ trips, initialPrices }) {
  const [values, setValues] = useState(initialPrices);
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  async function save(slug) {
    setBusy(slug); setMessage("");
    try {
      const response = await fetch("/api/admin/prices", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug, price: values[slug] }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setMessage("Price saved. New bookings will use the updated price.");
    } catch (error) { setMessage(error.message || "Could not update the price."); }
    finally { setBusy(""); }
  }
  return <><p className="small-note">Prices are per person in INR. Seed prices are examples until saved by the owner; existing bookings keep their original price.</p><p className="form-message" role="status">{message}</p><div className="admin-price-list">{trips.map((trip)=><div key={trip.slug}><span>{trip.title}</span><label>₹ <input type="number" min="1" max="10000000" step="1" aria-label={`${trip.title} price in rupees`} value={values[trip.slug] ?? ""} onChange={(event)=>setValues({ ...values, [trip.slug]: event.target.value })}/></label><button className="button button-dark" disabled={busy === trip.slug} onClick={()=>save(trip.slug)}>{busy === trip.slug ? "Saving…" : "Save"}</button></div>)}</div></>;
}
