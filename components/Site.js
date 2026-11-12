import Link from "next/link";

export function Mark({ light = false }) {
  return <Link href="/" className={`brand${light ? " brand-light" : ""}`} aria-label="NE Travels home"><span className="brand-mark"><svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M3 24 11.5 9l4.7 8 3.2-5L29 24H3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/><circle cx="23.5" cy="7.5" r="2" fill="currentColor"/></svg></span><span>ne<span className="brand-dot">.</span><small>TRAVELS</small></span></Link>;
}

export function Header() {
  return <header className="header"><div className="shell header-inner"><Mark/><nav className="desktop-nav" aria-label="Main navigation"><Link href="/destinations">Destinations</Link><Link href="/journeys">Our journeys</Link><Link href="/about">Our approach</Link><Link href="/contact">Contact</Link></nav><div className="header-actions"><Link href="/account" className="header-account">My account</Link><Link href="/journeys" className="button button-dark header-cta">Find your journey <span>↗</span></Link><details className="mobile-menu"><summary aria-label="Open navigation"><span></span><span></span></summary><nav aria-label="Mobile navigation"><Link href="/destinations">Destinations</Link><Link href="/journeys">Our journeys</Link><Link href="/about">Our approach</Link><Link href="/contact">Contact</Link><Link href="/account">My account</Link></nav></details></div></div></header>;
}

export function Footer() {
  return <footer className="footer"><div className="shell"><div className="footer-top"><div><p className="eyebrow light-eyebrow">THE NORTHEAST IS CALLING</p><h2>Go a little further.<br/><em>Feel a lot more.</em></h2></div><Link className="button button-light" href="/journeys">Explore the journeys <span>↗</span></Link></div><div className="footer-main"><div className="footer-about"><Mark light/><p>Thoughtful journeys through Northeast India, shaped around the people and places that make it extraordinary.</p><Link href="/contact">Contact our team ↗</Link></div><div><h3>EXPLORE</h3><Link href="/destinations">Destinations</Link><Link href="/journeys">All journeys</Link><Link href="/about">Our approach</Link></div><div><h3>PLAN</h3><Link href="/contact">Get in touch</Link><Link href="/account">My bookings</Link><Link href="/admin">Admin</Link></div><div><h3>THE DETAILS</h3><Link href="/travel-info">Travel information</Link><Link href="/privacy">Privacy</Link><Link href="/photo-credits">Photo credits</Link><span>India · Northeast</span></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} NE Travels. All rights reserved.</span><span>TRAVEL WELL. TREAD LIGHTLY.</span></div></div></footer>;
}

export function SectionHeading({ eyebrow, title, text, action }) {
  return <div className="section-heading"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{text && <p className="section-copy">{text}</p>}</div>{action}</div>;
}

export function TripCard({ trip, index }) {
  return <Link href={`/journeys/${trip.slug}`} className="trip-card"><div className="trip-image"><img src={trip.image} alt="" loading="lazy"/><span className="trip-number">{String(index + 1).padStart(2, "0")}</span><span className="trip-arrow">↗</span></div><div className="trip-meta"><span>{trip.state}</span><span>{trip.duration}</span></div><h3>{trip.title}</h3><p>{trip.short}</p><span className="trip-link">Explore this journey <span>↗</span></span></Link>;
}

export function MiniCta() {
  return <section className="mini-cta"><div className="shell mini-cta-inner"><div><p className="eyebrow light-eyebrow">YOUR JOURNEY STARTS HERE</p><h2>Have a place in mind?<br/><em>Let’s make a plan.</em></h2><p>Tell us how you like to travel. We’ll take it from there.</p></div><Link href="/contact" className="button button-light">Talk to us <span>↗</span></Link></div></section>;
}
