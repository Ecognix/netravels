import Link from "next/link";
import { createClient } from "../../lib/supabase/server";
import AdminRequests from "../../components/AdminRequests";
import SignOut from "../../components/SignOut";
import AdminPrices from "../../components/AdminPrices";
import { trips } from "../../lib/packages";
import { formatPrice } from "../../lib/prices";

export const metadata = { title: "Admin" };
export const dynamic = "force-dynamic";
export default async function Admin() {
  const supabase = await createClient();
  if (!supabase) return <section className="section page-top"><div className="shell"><h1>Admin setup <em>needed.</em></h1><p className="section-copy">Configure Supabase and administrator access before using this panel.</p></div></section>;
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return <section className="section page-top"><div className="shell"><h1>Team <em>sign in.</em></h1><p className="section-copy">Sign in with an authorised administrator account.</p><Link className="button button-dark" href="/auth?next=%2Fadmin">Sign in <i className="ar"/></Link></div></section>;
  const { data: admin, error: adminError } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (adminError) return <section className="section page-top"><div className="shell"><h1>Unable to check <em>access.</em></h1><p className="section-copy">The admin service could not verify your account. Check the Supabase setup.</p></div></section>;
  if (!admin) return <section className="section page-top"><div className="shell"><h1>Access <em>restricted.</em></h1><p className="section-copy">This account is not an administrator. Ask the site owner to grant access.</p><SignOut/></div></section>;
  const [bookings, prices, contacts, customers, analytics] = await Promise.all([
    supabase.from("booking_requests").select("*").order("created_at", { ascending: false }).limit(1000),
    supabase.from("package_prices").select("slug, price_inr"),
    supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(1000),
    supabase.rpc("admin_customers"), supabase.rpc("admin_analytics"),
  ]);
  return <section className="section page-top"><div className="shell"><div className="account-heading"><div><p className="eyebrow">NE TRAVELS / ADMIN</p><h1>Owner<br/><em>dashboard.</em></h1><p className="muted-text">Signed in as {user.email}</p></div><SignOut/></div><div className="admin-nav"><a href="#overview">Overview</a><a href="#prices">Prices</a><a href="#bookings">Bookings</a><a href="#customers">Users</a><a href="#contacts">Messages</a></div>
    <div id="overview" className="account-section-head"><h2>Analytics</h2></div>{analytics.error ? <p className="form-message error">Analytics could not be loaded. Check database setup.</p> : <><div className="admin-stats">{[["Users", analytics.data.users], ["Bookings", analytics.data.bookings], ["Travellers", analytics.data.travellers], ["Messages", analytics.data.enquiries], ["Estimated booking value", formatPrice(analytics.data.estimated_value)]].map(([label, value])=><div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div><p className="small-note">Estimated value is not revenue or a payment; it excludes cancelled bookings and older bookings without a recorded price.</p></>}
    <div id="prices" className="account-section-head"><h2>Package prices</h2></div>{prices.error ? <p className="form-message error">Prices could not be loaded.</p> : <AdminPrices trips={trips.map(({ slug, title })=>({ slug, title }))} initialPrices={Object.fromEntries(prices.data.map((p)=>[p.slug,p.price_inr]))}/>}
    <div id="bookings" className="account-section-head"><h2>Bookings</h2><span className="eyebrow">LATEST 1,000</span></div>{bookings.error ? <p className="form-message error">Bookings could not be loaded.</p> : <AdminRequests bookings={bookings.data}/>}
    <div id="customers" className="account-section-head"><h2>Users</h2><span className="eyebrow">LATEST 1,000</span></div>{customers.error ? <p className="form-message error">Users could not be loaded.</p> : <div className="admin-records">{customers.data.length ? customers.data.map((customer)=><article key={customer.id}><b>{customer.email || "Email unavailable"}</b><span>Joined {new Date(customer.created_at).toLocaleDateString("en-IN")} · {customer.id}</span></article>) : <p>No users yet.</p>}</div>}
    <div id="contacts" className="account-section-head"><h2>Contact messages</h2><span className="eyebrow">LATEST 1,000</span></div>{contacts.error ? <p className="form-message error">Messages could not be loaded.</p> : <div className="admin-records">{contacts.data.length ? contacts.data.map((contact)=><article key={contact.id}><b>{contact.subject}</b><span>{contact.name} · {contact.email}{contact.phone ? ` · ${contact.phone}` : ""} · {new Date(contact.created_at).toLocaleDateString("en-IN")}</span><p className="admin-notes">{contact.message}</p></article>) : <p>No messages yet.</p>}</div>}
  </div></section>;
}
