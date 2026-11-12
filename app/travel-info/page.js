import Link from "next/link";

export const metadata = { title: "Travel information" };
const items = [
  ["When should I visit?", "Seasons vary across the region. The monsoon can mean heavy rain and road closures, while high-altitude routes may close in winter. Each itinerary offers a general starting point; check current conditions before travel."],
  ["Are permits required?", "Some areas, including Arunachal Pradesh and certain parts of Sikkim and Nagaland, may require permits or registration. Requirements vary by nationality and destination. We’ll discuss the documents and current rules needed for your route."],
  ["What happens when I book?", "Your booking is recorded immediately without payment. Availability, transport and accommodation are not checked automatically; the team must confirm the route, services and terms separately."],
  ["Are flights included?", "Flights, accommodation, meals, transport, entrance fees and guides are not automatically included. The final quote will specify exactly what is and is not included."],
  ["Can plans change?", "Yes. Road access, weather, local restrictions and availability can affect the itinerary. Discuss alternatives, cancellation terms and travel insurance before confirming a booking."],
  ["What should I bring?", "Bring comfortable footwear, layers, rain protection, essential medication and accepted identification. For treks and high-altitude routes, ask for a packing and fitness assessment specific to the route."],
  ["How do I travel responsibly?", "Respect local customs, ask permission before photographing people, follow your guide’s instructions, carry back waste and avoid disturbing wildlife."],
];
export default function TravelInfo() {
  return <section className="section page-top"><div className="shell information-layout"><div><p className="eyebrow">THE PRACTICAL DETAILS</p><h1>Know before<br/><em>you go.</em></h1><p className="section-copy">A little preparation goes a long way. These are general guidelines; always check the latest requirements for your dates and route.</p><Link href="/contact" className="text-link">Ask us a question ↗</Link></div><div className="faq-list">{items.map(([question, answer])=><details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></div></section>;
}
