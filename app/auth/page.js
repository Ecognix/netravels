import AuthForm from "../../components/AuthForm";

export const metadata = { title: "Sign in" };
export default async function Auth({ searchParams }) {
  const params = await searchParams;
  return <section className="section page-top"><div className="shell account-layout"><div><p className="eyebrow">YOUR TRAVEL ACCOUNT</p><h1>Good journeys<br/><em>begin here.</em></h1><p className="section-copy">A little space for your travel plans, enquiries and everything still to come.</p></div><AuthForm next={params.next || "/account"} callbackError={params.error === "confirmation"}/></div></section>;
}
