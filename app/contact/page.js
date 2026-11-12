import ContactForm from "../../components/ContactForm";

export const metadata = { title: "Contact" };
export default async function Contact({ searchParams }) {
  const params = await searchParams;
  const subject = typeof params.subject === "string" ? params.subject.slice(0, 150) : "";
  return <section className="section page-top"><div className="shell contact-grid"><div><p className="eyebrow">LET’S MAKE SOMETHING MEMORABLE</p><h1>Every journey<br/>starts with <em>hello.</em></h1><p className="section-copy">Questions or a change to your booking? Send our team a message using the form. Include your booking reference when relevant.</p><p className="contact-mail">Phone: +91 XXXXX XXXXX</p><p className="small-note">Sample number only — replace before launch; this is not a working phone line.</p></div><ContactForm initialSubject={subject}/></div></section>;
}
