import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import { getTrip } from "../../../lib/packages";
import BookingForm from "../../../components/BookingForm";
import { getPrices, formatPrice } from "../../../lib/prices";

export const metadata = { title: "Request a journey" };
export const dynamic = "force-dynamic";
export default async function Book({ params }) {
  const trip = getTrip((await params).slug);
  if (!trip) notFound();
  const supabase = await createClient();
  const auth = supabase ? await supabase.auth.getUser() : null;
  const user = auth?.data?.user;
  const { prices, samples, error } = await getPrices();
  return <section className="section page-top"><div className="shell account-layout"><div><Link href={`/journeys/${trip.slug}`} className="text-link">← Back to journey</Link><p className="eyebrow top-space">YOUR NEXT CHAPTER</p><h1>Let’s plan<br/><em>{trip.title}.</em></h1><p className="section-copy">{trip.state} · {trip.duration} · {error ? "Price unavailable" : `${formatPrice(prices[trip.slug])} per person${samples.includes(trip.slug) ? " (sample price)" : ""}`}</p><p className="muted-text">Your booking is recorded without payment or an availability check. Our team must confirm travel services separately.</p></div>{!supabase || error ? <div className="auth-card"><h2>Booking setup needed.</h2><p>Booking is unavailable. Please <Link className="text-link" href="/contact">contact us</Link> about this journey.</p></div> : !user ? <div className="auth-card"><h2>First, let’s get<br/><em>you signed in.</em></h2><p>Use your account to book and see your bookings later.</p><Link className="button button-dark" href={`/auth?next=${encodeURIComponent(`/book/${trip.slug}`)}`}>Sign in or create account ↗</Link></div> : <BookingForm trip={trip} email={user.email}/>}</div></section>;
}
