import { trips } from "../../lib/packages";

export const metadata = { title: "Photo credits" };
export default function PhotoCredits() {
  return <section className="section page-top"><div className="shell prose-page"><p className="eyebrow">WITH THANKS</p><h1>Photo <em>credits.</em></h1><p>These images are sourced from Wikimedia Commons. They may be cropped on this site to fit the layout; source images and licence terms are linked below.</p>{trips.map(({ slug, credit })=><div key={slug}><h2>{credit.title}</h2><p>By {credit.author}. <a className="text-link" href={credit.source}>Original image <i className="ar"/></a> · <a className="text-link" href={credit.licenseUrl}>{credit.license} <i className="ar"/></a></p></div>)}</div></section>;
}
