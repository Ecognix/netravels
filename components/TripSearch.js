"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "./Icon";
import { months, durations, budgets } from "../lib/search";
import { regions } from "../lib/explore";

export default function TripSearch() {
  const router = useRouter();
  const [f, setF] = useState({ q: "", state: "", month: "", days: "any", budget: "any" });
  const set = (key) => (e) => setF((s) => ({ ...s, [key]: e.target.value }));

  function submit(e) {
    e.preventDefault();
    const p = new URLSearchParams();
    if (f.q.trim()) p.set("q", f.q.trim());
    if (f.state) p.set("state", f.state);
    if (f.month) p.set("month", f.month);
    if (f.days !== "any") p.set("days", f.days);
    if (f.budget !== "any") p.set("budget", f.budget);
    router.push(`/journeys${p.toString() ? `?${p}` : ""}`);
  }

  return (
    <form className="trip-search" onSubmit={submit} aria-label="Search journeys">
      <label className="ts-main"><Icon name="search" /><input value={f.q} onChange={set("q")} placeholder="Search places or themes: Kaziranga, tea, waterfalls…" aria-label="Search" /></label>
      <div className="ts-filters">
        <label><span>Destination</span><select value={f.state} onChange={set("state")}><option value="">All states</option>{regions.map((r) => <option key={r.slug}>{r.name}</option>)}</select></label>
        <label><span>Month</span><select value={f.month} onChange={set("month")}><option value="">Any month</option>{months.map((m, i) => <option key={m} value={i}>{m}</option>)}</select></label>
        <label><span>Duration</span><select value={f.days} onChange={set("days")}>{durations.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
        <label><span>Budget</span><select value={f.budget} onChange={set("budget")}>{budgets.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
      </div>
      <button className="ts-go" type="submit"><Icon name="search" /> <b>Search</b></button>
    </form>
  );
}
