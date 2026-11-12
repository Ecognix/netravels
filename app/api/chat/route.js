import { NextResponse } from "next/server";
import { trips } from "../../../lib/packages";
import { getPrices, formatPrice } from "../../../lib/prices";

export async function POST(request) {
  const key = process.env.NVIDIA_API_KEY;
  if (!key) return NextResponse.json({ error: "AI support is not configured. Please use the contact form." }, { status: 503 });
  let input;
  try { input = await request.json(); } catch { return NextResponse.json({ error: "Invalid chat request." }, { status: 400 }); }
  if (!Array.isArray(input?.messages) || input.messages.length < 1 || input.messages.length > 12 || input.messages.some((m) => !["user", "assistant"].includes(m?.role) || typeof m.content !== "string" || m.content.length < 1 || m.content.length > 2000) || input.messages.at(-1).role !== "user") {
    return NextResponse.json({ error: "Please enter a message of up to 2,000 characters." }, { status: 400 });
  }
  const { prices, samples, error } = await getPrices();
  const tripFacts = trips.map((trip) => `${trip.title}: ${trip.state}, ${trip.duration}, starts ${trip.start}; ${error ? "price unavailable" : `${formatPrice(prices[trip.slug])} per person${samples.includes(trip.slug) ? " (sample price, not an offer)" : ""}`}. ${trip.intro} Key notes: ${trip.note}`).join("\n");
  const system = `You are NE Travels' customer support assistant. Answer clearly and accurately using these website facts. Do not invent availability, supplier confirmation, inclusions, prices, permits or cancellation terms. Booking is recorded without payment or live availability verification; services must be confirmed by the team. Direct booking or customization requests to /journeys or /contact; you cannot submit forms or change bookings. The phone number shown on the site is a non-working placeholder. Never ask for passwords, identification numbers, payment details, or other sensitive data. If uncertain, say so and direct the visitor to the contact form. Website journeys:\n${tripFacts}`;
  try {
    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "minimaxai/minimax-m3.1-flash", messages: [{ role: "system", content: system }, ...input.messages], max_tokens: 700, temperature: 0.4 }),
      signal: AbortSignal.timeout(45000),
    });
    if (!response.ok) {
      console.error("NVIDIA chat failed:", response.status);
      return NextResponse.json({ error: "AI support is temporarily unavailable. Please use the contact form." }, { status: 502 });
    }
    const result = await response.json();
    const text = result?.choices?.[0]?.message?.content;
    if (typeof text !== "string" || !text.trim()) return NextResponse.json({ error: "AI support returned an empty reply. Please try again or contact the team." }, { status: 502 });
    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error("NVIDIA chat request failed:", error);
    return NextResponse.json({ error: "AI support is temporarily unavailable. Please use the contact form." }, { status: 502 });
  }
}
