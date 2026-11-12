"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Icon from "./Icon";
import { regions, experiences, planningTips, seasons } from "../lib/explore";

const vibes = ["All", ...Array.from(new Set(regions.flatMap((r) => r.vibe)))];

export default function Explore() {
  const [query, setQuery] = useState("");
  const [vibe, setVibe] = useState("All");
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setQuery(p.get("q") || "");
    const v = p.get("vibe");
    if (v && vibes.includes(v)) setVibe(v);
  }, []);
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return regions.filter((r) => {
      const text = [r.name, r.tag, r.summary, ...r.vibe, ...r.places.flat()].join(" ").toLowerCase();
      return (!q || text.includes(q)) && (vibe === "All" || r.vibe.includes(vibe));
    });
  }, [query, vibe]);

  return (
    <>
      <section className="page-hero shell"><p className="eyebrow">EXPLORE THE NORTHEAST</p><h1>Eight states.<br /><em>Endless detours.</em></h1><p>A practical guide to what to see, when to go and how to plan. Details are a general guide, so always confirm permits, timings and road conditions before you travel.</p></section>
      <section className="shell explore-search">
        <label className="search-box"><Icon name="search" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search a state, place or experience, e.g. Kaziranga, tea, waterfalls" aria-label="Search destinations" /></label>
        <div className="chip-row" role="group" aria-label="Filter by experience">{vibes.map((v) => <button key={v} type="button" className={v === vibe ? "chip on" : "chip"} onClick={() => setVibe(v)}>{v}</button>)}</div>
        <p className="result-count">{results.length} {results.length === 1 ? "destination" : "destinations"} found</p>
      </section>
      <section className="shell region-grid">
        {results.length === 0 && <p className="empty-state">Nothing matches that search. Try Assam, tea or waterfalls.</p>}
        {results.map((r) => (
          <article className="region-card" key={r.slug} id={r.slug}>
            <div className="region-head"><span className="region-tag">{r.tag}</span><h3>{r.name}</h3><p>{r.summary}</p></div>
            <div className="region-meta"><span><Icon name="calendar" /> Best: {r.best}</span><span><Icon name="pin" /> {r.distance}</span></div>
            <ul className="place-list">{r.places.map(([name, text]) => <li key={name}><strong>{name}</strong><span>{text}</span></li>)}</ul>
            <p className="region-tip"><Icon name="compass" /> {r.tip}</p>
            <Link className="text-link" href={`/journeys?state=${encodeURIComponent(r.name)}`}>See {r.name} journeys <i className="ar" /></Link>
          </article>
        ))}
      </section>
      <section className="why-section"><div className="shell"><p className="eyebrow light-eyebrow">THINGS TO DO</p><h2>Experiences worth <em>the trip.</em></h2><div className="why-grid">{experiences.map(([t, d], i) => <article key={t}><span>0{i + 1} /</span><h3>{t}</h3><p>{d}</p></article>)}</div></div></section>
      <section className="section"><div className="shell"><p className="eyebrow">WHEN TO GO</p><h2>A season for <em>every mood.</em></h2><div className="season-grid">{seasons.map(([m, t, d]) => <article key={m}><span>{m}</span><h3>{t}</h3><p>{d}</p></article>)}</div></div></section>
      <section className="section soft-section"><div className="shell"><p className="eyebrow">PLAN SMART</p><h2>Before you <em>go.</em></h2><div className="tip-grid">{planningTips.map(([t, d]) => <div key={t}><h3>{t}</h3><p>{d}</p></div>)}</div><div className="cta-row"><Link className="button button-dark" href="/journeys">Browse journeys <i className="ar" /></Link><Link className="button button-line" href="/contact">Plan with our team <i className="ar" /></Link></div></div></section>
    </>
  );
}
