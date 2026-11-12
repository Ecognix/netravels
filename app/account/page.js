import Link from "next/link";
import { createClient } from "../../lib/supabase/server";
import SignOut from "../../components/SignOut";

export const metadata = { title: "My account" };
export const dynamic = "force-dynamic";
export default async function Account() {
  const supabase = await createClient();
  if (!supabase) return <section className="section page-top"><div className="shell"><p className="eyebrow">MY ACCOUNT</p><h1>Account setup <em>needed.</em></h1><p className="section-copy">Account services are not configured yet. Please email <a className="text-link" href="mailto:admin@ecognix.in">admin@ecognix.in</a>.</p></div></section>;
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return <section className="section page-top"><div className="shell"><p className="eyebrow">MY ACCOUNT</p><h1>Your plans,<br/><em>all in one place.</em></h1><p className="section-copy">Sign in to see your journey requests.</p><Link className="button button-dark" href="/auth">Sign in ↗</Link></div></section>;
  const { data: bookings, error } = await supabase.from("booking_requests").select("id, package_name, package_slug, travel_date, travellers, status, created_at").eq("user_id", user.id).order("created_at", { ascending: false });
  return <section className="section page-top"><div className="shell"><div className="account-heading"><div><p className="eyebrow">YOUR TRAVEL ACCOUNT</p><h1>Your next<br/><em>adventure awaits.</em></h1><p className="muted-text">{user.email}</p></div><SignOut/></div><div className="account-section-head"><h2>My bookings</h2><Link className="text-link" href="/journeys">Explore journeys ↗</Link></div>{error ? <p className="form-message error">We couldn’t load your bookings. Please try again later.</p> : bookings.length === 0 ? <div className="empty-state"><p>No bookings yet. Find a journey that speaks to you.</p><Link href="/journeys" className="button button-dark">Explore journeys ↗</Link></div> : <div className="requests-list">{bookings.map((booking)=><article key={booking.id}><div><span className="eyebrow">{booking.status.toUpperCase()}</span><h3>{booking.package_name}</h3><p>Preferred start: {booking.travel_date} · {booking.travellers} traveller{booking.travellers === 1 ? "" : "s"}</p><small>Booking {booking.id}</small></div><div><Link className="text-link" href={`/journeys/${booking.package_slug}`}>View journey ↗</Link><br/><Link className="text-link" href={`/contact?subject=${encodeURIComponent(`Customize booking ${booking.id}`)}`}>Customize booking ↗</Link></div></article>)}</div>}<p className="small-note">Bookings are recorded without payment or an availability check. The team must confirm services and travel arrangements.</p></div></section>;
}
