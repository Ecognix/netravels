"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Icon, { GoogleG } from "./Icon";

export default function ReviewSlider({ reviews, rating = "4.9", note = "Google reviews · sample rating" }) {
  const track = useRef(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(reviews.length);
  const paused = useRef(false);

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const card = el.children[0];
    const step = card.offsetWidth + parseFloat(getComputedStyle(el).columnGap || 0);
    const perView = Math.max(1, Math.round(el.clientWidth / step));
    setPages(Math.max(1, reviews.length - perView + 1));
    setPage(Math.min(Math.round(el.scrollLeft / step), Math.max(0, reviews.length - perView)));
  }, [reviews.length]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const go = useCallback((index) => {
    const el = track.current;
    if (!el) return;
    const card = el.children[0];
    const step = card.offsetWidth + parseFloat(getComputedStyle(el).columnGap || 0);
    el.scrollTo({ left: index * step, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (paused.current) return;
      go(page + 1 >= pages ? 0 : page + 1);
    }, 5000);
    return () => clearInterval(id);
  }, [page, pages, go]);

  return (
    <div className="rs" onMouseEnter={() => (paused.current = true)} onMouseLeave={() => (paused.current = false)} onTouchStart={() => (paused.current = true)}>
      <div className="rs-head">
        <div className="rs-brand"><GoogleG /><span>Google</span></div>
        <div className="rs-score"><strong>{rating}</strong>
          <div className="stars" aria-label={`${rating} out of 5 stars`}>{[0, 1, 2, 3, 4].map((i) => <Icon key={i} name="starfill" />)}</div>
        </div>
        <span className="rs-note">{note}</span>
        <div className="rs-arrows">
          <button type="button" onClick={() => go(Math.max(0, page - 1))} aria-label="Previous review"><i className="ar rs-prev" /></button>
          <button type="button" onClick={() => go(Math.min(pages - 1, page + 1))} aria-label="Next review"><i className="ar" /></button>
        </div>
      </div>
      <div className="rs-track" ref={track} onScroll={measure} tabIndex={0} aria-label="Traveller reviews">
        {reviews.map(([name, city, trip, text]) => (
          <figure className="review-card rs-card" key={name}>
            <div className="review-top"><span className="avatar">{name[0]}</span><div><strong>{name}</strong><small>{city} · {trip}</small></div><GoogleG /></div>
            <div className="stars" aria-label="5 out of 5 stars">{[0, 1, 2, 3, 4].map((i) => <Icon key={i} name="starfill" />)}</div>
            <blockquote>{text}</blockquote>
          </figure>
        ))}
      </div>
      <div className="rs-dots" role="tablist" aria-label="Choose review">
        {Array.from({ length: pages }).map((_, i) => <button key={i} type="button" role="tab" aria-selected={i === page} aria-label={`Go to review ${i + 1}`} className={i === page ? "on" : ""} onClick={() => go(i)} />)}
      </div>
    </div>
  );
}
