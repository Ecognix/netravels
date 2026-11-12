import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";

export async function POST(request) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Admin access is not configured." }, { status: 503 });
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const { data: admin, error: adminError } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (adminError) {
    console.error("Admin access check failed:", adminError.message);
    return NextResponse.json({ error: "Could not verify admin access." }, { status: 500 });
  }
  if (!admin) return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  let input;
  try { input = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  if (typeof input?.id !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(input.id) || !["new", "booked", "contacted", "closed", "cancelled"].includes(input.status)) {
    return NextResponse.json({ error: "Invalid request or status." }, { status: 400 });
  }
  const { data, error } = await supabase.from("booking_requests").update({ status: input.status }).eq("id", input.id).select("id").maybeSingle();
  if (error) {
    console.error("Could not update booking:", error.message);
    return NextResponse.json({ error: "Could not update the request." }, { status: 500 });
  }
  if (!data) return NextResponse.json({ error: "Request not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
