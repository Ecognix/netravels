"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "./Icon";
import { months, durations, budgets } from "../lib/search";

const states = ["Meghalaya", "Assam", "Sikkim", "Arunachal Pradesh", "Nagaland"];

export default function TripSearch() {
  const router = useRouter();
  const [tab, setTab] = useState("journey");
  const [f, setF] = useState({ state: "", month: "", days: "any", budget: "any", q: "" });
  const set = (key) => (e) => setF((s) => ({ ...s, [key]: e.target.value }));

  function submit(e) {
    e.preventDefault();
    if (tab === "explore") {
      router.push(f.q.trim() ? `/explore?q=${encodeURIComponent(f.q.trim())}` : "/explore");
      return;
    }
    const p = new URLSearchParams();
    if (f.state) p.set("state", f.state);
    if (f.month) p.set("month", f.month);
    if (f.days !== "any") p.set("days", f.days);
    if (f.budget !== "any") p.set("budget", f.budget);
    router.push(`/journeys${p.toString() ? `?${p}` : ""}`);
  }

  return (
    <form className="trip-search" onSubmit={submit} aria-label="Search journeys">
      <div className="ts-tabs" role="tablist">
        <button type="button" role="tab" aria-selected={tab === "journey"} className={tab === "journey" ? "on" : ""} onClick={() => setTab("journey")}>Find a journey</button>
        <button type="button" role="tab" aria-selected={tab === "explore"} className={tab === "explore" ? "on" : ""} onClick={() => setTab("explore")}>Explore places</button>
      </div>
      {tab === "journey" ? (
        <div className="ts-fields">
          <label><span><Icon name="pin" /> Destination</span><select value={f.state} onChange={set("state")}><option value="">All of the Northeast</option>{states.map((s) => <option key={s}>{s}</option>)}</select></label>
          <label><span><Icon name="calendar" /> Travel month</span><select value={f.month} onChange={set("month")}><option value="">Any month</option>{months.map((m, i) => <option key={m} value={i}>{m}</option>)}</select></label>
          <label><span><Icon name="clock" /> Duration</span><select value={f.days} onChange={set("days")}>{durations.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
          <label><span><Icon name="rupee" /> Budget / person</span><select value={f.budget} onChange={set("budget")}>{budgets.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
          <button className="button button-dark" type="submit"><Icon name="search" /> Search journeys</button>
        </div>
      ) : (
        <div className="ts-fields ts-single">
          <label><span><Icon name="search" /> Place, state or experience</span><input value={f.q} onChange={set("q")} placeholder="Kaziranga, tea, waterfalls, Tawang…" /></label>
          <button className="button button-dark" type="submit"><Icon name="search" /> Explore</button>
        </div>
      )}
    </form>
  );
}
