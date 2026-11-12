import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";
import { getTrip } from "../../../../lib/packages";

export async function POST(request) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Admin access is not configured." }, { status: 503 });
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const { data: admin, error: adminError } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (adminError) return NextResponse.json({ error: "Could not verify admin access." }, { status: 500 });
  if (!admin) return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  let input;
  try { input = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const price = Number(input?.price);
  if (!getTrip(input?.slug) || !Number.isInteger(price) || price < 1 || price > 10000000) return NextResponse.json({ error: "Enter a valid whole-rupee price." }, { status: 400 });
  const { data, error } = await supabase.from("package_prices").update({ price_inr: price, is_sample: false, updated_at: new Date().toISOString() }).eq("slug", input.slug).select("slug").maybeSingle();
  if (error || !data) {
    console.error("Could not update price:", error?.message || "Price not found");
    return NextResponse.json({ error: "Could not update the price." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
