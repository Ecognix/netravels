"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

export default function MobileMenu({ links }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);
  const close = () => setOpen(false);

  return (
    <>
      <button type="button" className="burger" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}><span /><span /></button>
      {mounted && open && createPortal(
        <div className="menu-overlay" role="dialog" aria-modal="true" aria-label="Site menu">
          <div className="menu-top">
            <Link href="/" onClick={close} className="menu-brand">ne<span>.</span><small>TRAVELS</small></Link>
            <button type="button" className="menu-close" onClick={close} aria-label="Close menu"><span /><span /></button>
          </div>
          <nav className="menu-links" aria-label="Menu">
            {links.map(([href, label], i) => (
              <Link key={href} href={href} onClick={close} style={{ "--i": i }}><em>{String(i + 1).padStart(2, "0")}</em>{label}<i className="ar" /></Link>
            ))}
          </nav>
          <div className="menu-bottom">
            <div className="menu-auth">
              <Link href="/auth" onClick={close} className="button button-line-light">Sign in</Link>
              <Link href="/auth?mode=signup" onClick={close} className="button button-accent">Create account <i className="ar" /></Link>
            </div>
            <p>Thoughtful journeys through Northeast India.</p>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
