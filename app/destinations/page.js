import Link from "next/link";
import { trips } from "../../lib/packages";
import { MiniCta } from "../../components/Site";

export const metadata = { title: "Destinations" };
const descriptions = {
  Meghalaya: "Cloud forests, living root bridges and waterfalls in the hills.",
  Assam: "The Brahmaputra, tea gardens and extraordinary wildlife.",
  Sikkim: "Himalayan peaks, monasteries and winding mountain roads.",
  "Arunachal Pradesh": "High passes, wide valleys and remarkably varied cultures.",
  Nagaland: "Hill landscapes, local traditions and vibrant communities.",
};
export default function Destinations() {
  return <><section className="page-hero shell"><p className="eyebrow">PLACES WITH A STORY</p><h1>A region of<br/><em>many worlds.</em></h1><p>Five states to start exploring. Each has its own landscapes, cultures and ways of travelling.</p></section><section className="section compact-top"><div className="shell destination-list">{Object.entries(descriptions).map(([state, description], i) => {const trip=trips.find((t)=>t.state===state); return <Link key={state} href={`/journeys/${trip.slug}`} className="destination-item"><span className="destination-number">0{i+1} /</span><div><h2>{state}</h2><p>{description}</p></div><span className="destination-arrow"><i className="ar"/></span></Link>})}</div></section><MiniCta/></>;
}
