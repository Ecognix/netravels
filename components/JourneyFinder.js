"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Icon from "./Icon";
import { TripCard } from "./Site";
import { months, durations, budgets, seasonMonths, matchesDuration, matchesBudget, rupee } from "../lib/search";
import { regions } from "../lib/explore";

const states = ["All", ...regions.map((r) => r.name)];

export default function JourneyFinder({ trips, prices = {} }) {
  const [f, setF] = useState({ q: "", state: "All", month: "", days: "any", budget: "any", sort: "featured" });
  const hasPrices = Object.keys(prices).length > 0;

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setF((s) => ({ ...s, q: p.get("q") || "", state: states.includes(p.get("state")) ? p.get("state") : "All", month: p.get("month") || "", days: p.get("days") || "any", budget: p.get("budget") || "any" }));
  }, []);
  const set = (key) => (e) => setF((s) => ({ ...s, [key]: e.target.value }));

  const results = useMemo(() => {
    const q = f.q.trim().toLowerCase();
    const list = trips.filter((t) => {
      const text = [t.title, t.state, t.short, t.tag, t.intro, ...t.highlights].join(" ").toLowerCase();
      return (!q || text.includes(q))
        && (f.state === "All" || t.state === f.state)
        && (f.month === "" || seasonMonths(t.season).has(Number(f.month)))
        && matchesDuration(t, f.days)
        && (!hasPrices || matchesBudget(prices[t.slug], f.budget));
    });
    if (f.sort === "price") list.sort((a, b) => (prices[a.slug] ?? 0) - (prices[b.slug] ?? 0));
    if (f.sort === "days") list.sort((a, b) => a.days - b.days);
    return list;
  }, [trips, prices, hasPrices, f]);

  const reset = () => setF({ q: "", state: "All", month: "", days: "any", budget: "any", sort: "featured" });

  return (
    <div className="finder">
      <div className="finder-bar">
        <label className="search-box"><Icon name="search" /><input value={f.q} onChange={set("q")} placeholder="Search journeys, places or themes" aria-label="Search journeys" /></label>
        <div className="finder-selects">
          <label><span>Month</span><select value={f.month} onChange={set("month")}><option value="">Any month</option>{months.map((m, i) => <option key={m} value={i}>{m}</option>)}</select></label>
          <label><span>Duration</span><select value={f.days} onChange={set("days")}>{durations.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
          {hasPrices && <label><span>Budget</span><select value={f.budget} onChange={set("budget")}>{budgets.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>}
          <label><span>Sort by</span><select value={f.sort} onChange={set("sort")}><option value="featured">Featured</option><option value="days">Shortest first</option>{hasPrices && <option value="price">Price: low to high</option>}</select></label>
        </div>
      </div>
      <div className="chip-row" role="group" aria-label="Filter by state">{states.map((s) => <button key={s} type="button" className={s === f.state ? "chip on" : "chip"} onClick={() => setF((x) => ({ ...x, state: s }))}>{s}</button>)}</div>
      <p className="result-count">{results.length} {results.length === 1 ? "journey" : "journeys"} found</p>
      {results.length === 0 ? (
        <div className="empty-state"><p>No journey matches those filters yet.</p><button className="button button-dark" type="button" onClick={reset}>Clear filters</button> <Link className="text-link" href="/contact">Ask for a custom route <i className="ar" /></Link></div>
      ) : (
        <div className="trip-grid">{results.map((t) => <div className="trip-wrap" key={t.slug}><TripCard trip={t} index={trips.indexOf(t)} />{prices[t.slug] != null && <p className="price-tag">From <strong>{rupee(prices[t.slug])}</strong> per person</p>}</div>)}</div>
      )}
    </div>
  );
}
