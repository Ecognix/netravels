import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";
import { getTrip } from "../../../lib/packages";

export async function POST(request) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Booking is not configured. Please contact the team by email." }, { status: 503 });
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user?.email || !user.email_confirmed_at) return NextResponse.json({ error: "Please sign in with a verified email before booking a trip." }, { status: 401 });
  let input;
  try { input = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const trip = getTrip(input?.packageSlug);
  const fullName = typeof input?.fullName === "string" ? input.fullName.trim() : "";
  const phone = typeof input?.phone === "string" ? input.phone.trim() : "";
  const notes = typeof input?.notes === "string" ? input.notes.trim() : "";
  const date = typeof input?.travelDate === "string" ? input.travelDate : "";
  const travellers = Number(input?.travellers);
  const dateValue = new Date(`${date}T00:00:00Z`);
  const today = new Date().toISOString().slice(0, 10);
  if (!trip || fullName.length < 2 || fullName.length > 100 || phone.length < 7 || phone.length > 30 || notes.length > 2000 || !/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(dateValue.getTime()) || dateValue.toISOString().slice(0, 10) !== date || date < today || !Number.isInteger(travellers) || travellers < 1 || travellers > 20) {
    return NextResponse.json({ error: "Please check your trip, contact details, travel date and number of travellers." }, { status: 400 });
  }
  const { data, error } = await supabase.from("booking_requests").insert({
    user_id: user.id, package_slug: trip.slug, package_name: trip.title, full_name: fullName,
    email: user.email, phone, travel_date: date, travellers, notes,
  }).select("id").single();
  if (error) {
    console.error("Could not save booking request:", error.message);
    return NextResponse.json({ error: "We could not save your request. Please try again or email the team." }, { status: 500 });
  }
  return NextResponse.json({ id: data.id });
}
