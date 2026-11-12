"use client";
import { useState } from "react";

export default function AdminRequests({ bookings }) {
  const [rows, setRows] = useState(bookings);
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  async function update(id, status) {
    setBusy(id); setMessage("");
    try {
      const response = await fetch("/api/admin/status", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Could not update the request.");
      setRows((current)=>current.map((row)=>row.id === id ? { ...row, status } : row));
      setMessage("Request status updated.");
    } catch (error) { setMessage(error.message || "Could not update the request."); }
    finally { setBusy(""); }
  }
  return <><p className="form-message" role="status">{message}</p><div className="admin-requests">{rows.length === 0 ? <p>No bookings yet.</p> : rows.map((row)=><article key={row.id} className="admin-request"><div className="admin-request-head"><div><span className="eyebrow">{row.package_name} · {row.status.toUpperCase()}</span><h3>{row.full_name}</h3><small>Received {new Date(row.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" })} IST · {row.id}</small></div><label>Status<select value={row.status} disabled={busy === row.id} onChange={(event)=>update(row.id,event.target.value)}><option value="new">New (legacy)</option><option value="booked">Booked</option><option value="contacted">Contacted</option><option value="closed">Closed</option><option value="cancelled">Cancelled</option></select></label></div><div className="admin-request-details"><p><b>Email</b><a href={`mailto:${row.email}`}>{row.email}</a></p><p><b>Phone</b>{row.phone}</p><p><b>Preferred date</b>{row.travel_date}</p><p><b>Travellers</b>{row.travellers}</p><p><b>Price per person</b>{row.price_per_person_inr ? `₹${row.price_per_person_inr.toLocaleString("en-IN")}` : "Not recorded"}</p></div>{row.notes && <p className="admin-notes"><b>Notes</b><br/>{row.notes}</p>}</article>)}</div></>;
}
