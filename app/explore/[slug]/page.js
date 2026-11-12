import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "../../../components/Icon";
import { MiniCta } from "../../../components/Site";
import { regions } from "../../../lib/explore";
import { regionDetails } from "../../../lib/explore-details";
import { regionImages, placeImages } from "../../../lib/explore-media";
import { trips } from "../../../lib/packages";

export function generateStaticParams() {
  return regions.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const region = regions.find((r) => r.slug === slug);
  return region ? { title: `${region.name} travel guide`, description: region.summary } : {};
}

export default async function RegionPage({ params }) {
  const { slug } = await params;
  const i = regions.findIndex((r) => r.slug === slug);
  if (i < 0) notFound();
  const r = regions[i];
  const d = regionDetails[slug];
  const related = trips.filter((t) => t.state === r.name);
  const others = regions.filter((x) => x.slug !== slug).slice(0, 4);

  return (
    <>
      <section className="trip-hero region-hero">
        <img src={regionImages[slug]} alt={`${r.name} landscape`} />
        <div className="hero-shade" />
        <div className="shell trip-hero-content">
          <Link href="/explore" className="back-link"><i className="ar down back-arrow" /> All destinations</Link>
          <p className="eyebrow light-eyebrow">{r.tag.toUpperCase()}</p>
          <h1>{r.name}</h1>
          <p>{r.summary}</p>
        </div>
      </section>
      <section className="trip-facts"><div className="shell fact-grid">
        <div><span>CAPITAL</span><strong>{d.capital}</strong></div>
        <div><span>BEST TIME</span><strong>{r.best}</strong></div>
        <div><span>IDEAL TRIP</span><strong>{d.ideal}</strong></div>
        <div><span>TERRAIN</span><strong>{d.altitude}</strong></div>
      </div></section>

      <section className="section"><div className="shell region-layout">
        <div>
          <p className="eyebrow">ABOUT {r.name.toUpperCase()}</p>
          <h2>What makes it <em>special.</em></h2>
          {d.overview.map((p) => <p className="detail-intro" key={p}>{p}</p>)}
          <div className="chip-row static">{r.vibe.map((v) => <Link key={v} href={`/explore?vibe=${encodeURIComponent(v)}`} className="chip">{v}</Link>)}</div>
        </div>
        <aside className="quick-box">
          <h3>Quick facts</h3>
          <div className="aside-row"><span>Languages</span><strong>{d.languages}</strong></div>
          <div className="aside-row"><span>Getting there</span><strong>{r.distance}</strong></div>
          <div className="aside-row"><span>Stay</span><strong>{d.stay}</strong></div>
          <Link className="button button-dark wide-button" href={`/journeys?state=${encodeURIComponent(r.name)}`}>See {r.name} journeys <i className="ar" /></Link>
        </aside>
      </div></section>

      <section className="section soft-section"><div className="shell">
        <p className="eyebrow">PLACES TO VISIT</p>
        <h2>Where to <em>go.</em></h2>
        <div className="place-grid">
          {r.places.map(([name, text]) => (
            <article className="place-card" key={name}>
              {placeImages[name] ? <img src={placeImages[name]} alt={name} loading="lazy" /> : <div className="place-fallback"><Icon name="mountain" /></div>}
              <div><h3>{name}</h3><p>{text}</p></div>
            </article>
          ))}
        </div>
      </div></section>

      <section className="section"><div className="shell info-columns">
        <div><span className="info-icon"><Icon name="compass" /></span><h3>How to reach</h3><p>{d.reach}</p></div>
        <div><span className="info-icon"><Icon name="calendar" /></span><h3>Festivals</h3><ul>{d.festivals.map((f) => <li key={f}>{f}</li>)}</ul></div>
        <div><span className="info-icon"><Icon name="rupee" /></span><h3>What to eat</h3><ul>{d.food.map((f) => <li key={f}>{f}</li>)}</ul></div>
        <div><span className="info-icon"><Icon name="star" /></span><h3>Local tips</h3><ul>{[r.tip, ...d.extras].map((f) => <li key={f}>{f}</li>)}</ul></div>
      </div></section>

      {related.length > 0 ? (
        <section className="explore-teaser"><div className="shell"><p className="eyebrow light-eyebrow">JOURNEYS IN {r.name.toUpperCase()}</p><h2>Ready to <em>go?</em></h2><div className="related-trips">{related.map((t) => <Link key={t.slug} href={`/journeys/${t.slug}`} className="related-trip"><img src={t.image} alt="" loading="lazy" /><div><span>{t.duration}</span><h3>{t.title}</h3><p>{t.short}</p></div></Link>)}</div></div></section>
      ) : (
        <section className="explore-teaser"><div className="shell"><p className="eyebrow light-eyebrow">CUSTOM ROUTE</p><h2>No set journey here yet.<br /><em>We can plan one.</em></h2><p className="section-copy light-copy">Tell us your dates and group size and we will build a {r.name} itinerary around you.</p><Link className="button button-light" href="/contact">Plan {r.name} with us <i className="ar" /></Link></div></section>
      )}

      <section className="section"><div className="shell"><p className="eyebrow">KEEP EXPLORING</p><h2>More of the <em>Northeast.</em></h2><div className="state-grid state-grid-sm">{others.map((o) => (
        <Link key={o.slug} href={`/explore/${o.slug}`} className="state-card"><img src={regionImages[o.slug]} alt="" loading="lazy" /><div className="state-shade" /><div className="state-body"><span>{o.tag}</span><h3>{o.name}</h3><em className="state-more">Explore <i className="ar" /></em></div></Link>
      ))}</div></div></section>
      <MiniCta />
    </>
  );
}
