"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Icon from "./Icon";
import { regions, experiences, planningTips, seasons, reviews } from "../lib/explore";
import { regionImages, placeImages } from "../lib/explore-media";
import Marquee from "./Marquee";
import ReviewSlider from "./ReviewSlider";
import { GoogleG } from "./Icon";

const places = regions.flatMap((r) => r.places.filter(([name]) => placeImages[name]).map(([name, text]) => ({ name, text, region: r })));

const vibes = ["All", ...Array.from(new Set(regions.flatMap((r) => r.vibe)))];

export function StateCard({ region, index }) {
  return (
    <Link href={`/explore/${region.slug}`} className="state-card">
      <img src={regionImages[region.slug]} alt={`${region.name} landscape`} loading="lazy" />
      <div className="state-shade" />
      <span className="state-num">{String(index + 1).padStart(2, "0")}</span>
      <div className="state-body"><span>{region.tag}</span><h3>{region.name}</h3><p>{region.summary}</p><em className="state-more">Explore {region.name} <i className="ar" /></em></div>
    </Link>
  );
}

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
      <section className="page-hero shell"><p className="eyebrow">EXPLORE THE NORTHEAST</p><h1>Eight states.<br /><em>Endless detours.</em></h1><p>Pick a state to see places to visit, food, festivals, how to get there and the best time to go. Details are a general guide, so always confirm permits, timings and road conditions before you travel.</p></section>
      <section className="shell explore-search">
        <label className="search-box"><Icon name="search" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search a state, place or experience, e.g. Kaziranga, tea, waterfalls" aria-label="Search destinations" /></label>
        <div className="chip-row" role="group" aria-label="Filter by experience">{vibes.map((v) => <button key={v} type="button" className={v === vibe ? "chip on" : "chip"} onClick={() => setVibe(v)}>{v}</button>)}</div>
        <p className="result-count">{results.length} {results.length === 1 ? "destination" : "destinations"} found</p>
      </section>
      <section className="shell state-grid state-grid-lg">
        {results.length === 0 && <p className="empty-state">Nothing matches that search. Try Assam, tea or waterfalls.</p>}
        {results.map((r) => <StateCard key={r.slug} region={r} index={regions.indexOf(r)} />)}
      </section>
      <section className="section places-band"><div className="shell"><p className="eyebrow">TRENDING PLACES</p><h2>Places you will <em>remember.</em></h2></div><Marquee label="Popular places" speed={70}>{places.map((p) => <Link key={p.name} href={`/explore/${p.region.slug}`} className="place-slide"><img src={placeImages[p.name]} alt={p.name} loading="lazy" /><div className="place-slide-shade" /><div className="place-slide-body"><span>{p.region.name}</span><h3>{p.name}</h3><p>{p.text}</p></div></Link>)}</Marquee></section>
      <section className="why-section"><div className="shell"><p className="eyebrow light-eyebrow">THINGS TO DO</p><h2>Experiences worth <em>the trip.</em></h2><div className="why-grid why-six">{experiences.map(([t, d], i) => <article key={t}><span>0{i + 1} /</span><h3>{t}</h3><p>{d}</p></article>)}</div></div></section>
      <section className="section"><div className="shell"><p className="eyebrow">WHEN TO GO</p><h2>A season for <em>every mood.</em></h2><div className="season-grid">{seasons.map(([m, t, d]) => <article key={m}><span>{m}</span><h3>{t}</h3><p>{d}</p></article>)}</div></div></section>
      <section className="section reviews-section"><div className="shell"><p className="eyebrow">TRAVELLER STORIES</p><h2>Heard on the <em>road.</em></h2></div><div className="shell"><ReviewSlider reviews={reviews} /></div><p className="shell small-note sample-note">Sample reviews shown while live Google Reviews are being connected.</p></section>
      <section className="section soft-section"><div className="shell"><p className="eyebrow">PLAN SMART</p><h2>Before you <em>go.</em></h2><div className="tip-grid">{planningTips.map(([t, d]) => <div key={t}><h3>{t}</h3><p>{d}</p></div>)}</div><div className="cta-row"><Link className="button button-dark" href="/journeys">Browse journeys <i className="ar" /></Link><Link className="button button-line" href="/contact">Plan with our team <i className="ar" /></Link></div></div></section>
    </>
  );
}
