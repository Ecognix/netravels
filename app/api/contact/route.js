import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

export async function POST(request) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Contact forms are not configured yet. Please try again later." }, { status: 503 });
  let input;
  try { input = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const get = (key) => typeof input?.[key] === "string" ? input[key].trim() : "";
  const name = get("name"), email = get("email"), phone = get("phone"), subject = get("subject"), message = get("message");
  if (name.length < 2 || name.length > 100 || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || phone.length > 30 || subject.length < 2 || subject.length > 150 || message.length < 10 || message.length > 3000) {
    return NextResponse.json({ error: "Please check your contact details and message." }, { status: 400 });
  }
  const { error } = await supabase.from("contact_messages").insert({ name, email, phone, subject, message });
  if (error) {
    console.error("Could not save contact message:", error.message);
    return NextResponse.json({ error: "We could not save your message. Please try again." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
