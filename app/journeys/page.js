import { trips } from "../../lib/packages";
import { getPrices } from "../../lib/prices";
import JourneyFinder from "../../components/JourneyFinder";
import { MiniCta } from "../../components/Site";

export const metadata = { title: "Our journeys" };
export const dynamic = "force-dynamic";

export default async function Journeys() {
  const { prices } = await getPrices();
  return <><section className="page-hero shell"><p className="eyebrow">THE COLLECTION</p><h1>Find the journey<br/><em>that fits your Northeast.</em></h1><p>Search by destination, month, length or budget. Every journey can be shaped around your dates, pace and interests.</p><div className="page-hero-bottom"><span>{trips.length} CUSTOMISABLE JOURNEYS</span><span>PRICES PER PERSON</span></div></section><section className="section compact-top"><div className="shell"><JourneyFinder trips={trips} prices={prices} /><p className="image-note">Photographs are representative. Routes and experiences depend on conditions and availability.</p></div></section><MiniCta/></>;
}
