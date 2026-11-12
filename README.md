# NE Travels

A standalone Next.js website for six customizable Northeast India journeys, with email/password authentication, a non-payment booking flow and an admin dashboard.

## Local development

1. Use Node.js 20.9 or later and run `npm install`.
2. Copy `.env.example` to `.env.local` and fill in the values below.
3. Run `npm run dev`. Open the URL printed by Next.js.

Without Supabase configuration, public pages show clearly labelled sample prices but sign-in, bookings and contact messages cannot be saved.

## Supabase setup

1. Create a dedicated Supabase project. Run `supabase/schema.sql` once, followed by `supabase/upgrade-admin.sql`, in its SQL editor. For an existing installation, run only `upgrade-admin.sql`. Row-level security lets travellers see their own bookings and only explicit administrators see all bookings, contact messages and users or change statuses and prices. The customer-list function is restricted to authorised administrators.
2. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from the project's API settings. Never expose a service-role key to the browser or commit credentials.
3. Enable email/password authentication. Set the Supabase Site URL to the deployed site and add `https://YOUR-DOMAIN/auth/callback` and `http://localhost:3000/auth/callback` to the allowed redirect URLs. Configure an appropriate production SMTP service, email confirmation and rate limits in Supabase Auth.
4. Sign up and confirm the intended admin user, then grant access in the Supabase SQL editor using its exact account email:

   ```sql
   insert into public.admin_users (user_id)
   select id from auth.users where lower(email) = lower('admin@ecognix.in')
   on conflict (user_id) do nothing;
   ```

   Sign in as that user and visit `/admin`. The email address itself is not a privilege; membership in `admin_users` is required. Check that the query inserted a row. Do not grant the public or authenticated roles write access to this table. The dashboard lists the most recent 1,000 users, bookings and contact messages; analytics totals are calculated in the database.

5. Google sign-in is deliberately disabled as a visual placeholder; configure an OAuth provider and implement its flow before enabling it.

## Booking and support

The six seeded INR prices are **sample prices per person**, not real offers. Replace each in `/admin` before launch. New bookings snapshot the current price, are marked booked immediately, and take no payment. No inventory or availability check is performed; transport, accommodation and services must be confirmed by the team. The admin panel is the source of truth for bookings and contact messages; neither sends email. Analytics show estimated booking value, not collected revenue.

The phone shown on the contact page is a deliberately non-working placeholder; replace it with a real business number before launch. Set `NVIDIA_API_KEY` on the server to enable AI support via `minimaxai/minimax-m3.1-flash`. Chat messages are sent to NVIDIA, and the assistant cannot create or change bookings. The key must never be placed in a `NEXT_PUBLIC_` variable. Without a key, chat displays an explicit unavailable message.

Before public launch, configure rate limiting and abuse protection for the public contact form, Supabase Auth and AI endpoint, monitor logs and quotas, and have a privacy policy reviewed. Supabase RLS does not itself prevent spam or protect the NVIDIA API from excessive use.

## Vercel

Create a separate Vercel project. If deploying from this repository's `ne-travels` folder, set **Root Directory** to `ne-travels`; if deploying the standalone `netravels` repository, use the repository root. Add the environment variables for each environment and redeploy after changing them. Add the actual production and preview callback URLs to Supabase's allowlist. Use a dedicated production database, restrictive redirect URL allowlists, and production SMTP; verify signup, email confirmation, booking, owner isolation, admin access, price changes, contact messages and chat end to end before launch.

The itineraries and seasonal advice are illustrative. Confirm suppliers, permits, prices, inclusions, availability, cancellation terms and the privacy policy with the business before publishing. Images are credited, with source and licence links, on the photo credits page; image crops do not guarantee that each depicted site is included in a journey.
