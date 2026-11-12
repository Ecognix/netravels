import { trips } from "../../lib/packages";
import { TripCard, MiniCta } from "../../components/Site";

export const metadata = { title: "Our journeys" };
export default function Journeys() {
  return <><section className="page-hero shell"><p className="eyebrow">THE COLLECTION / 01—06</p><h1>Six ways to<br/><em>find your Northeast.</em></h1><p>From Meghalaya’s cloud-draped hills to Assam’s river country, every journey is a starting point for something personal.</p><div className="page-hero-bottom"><span>6 CUSTOMISABLE JOURNEYS</span><span>PRICES PER PERSON</span></div></section><section className="section compact-top"><div className="shell"><div className="trip-grid">{trips.map((trip,i)=><TripCard key={trip.slug} trip={trip} index={i}/>)}</div><p className="image-note">Photographs are representative. Routes and experiences depend on conditions and availability.</p></div></section><MiniCta/></>;
}
