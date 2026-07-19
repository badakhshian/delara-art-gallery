# Delara Art Gallery — artedelara.com

Next.js site for selling Delara Ahmadi Darani's original one-of-a-kind
artwork, with Stripe Checkout wired in.

## What's in here

```
app/
  page.js               → homepage (hero, exhibition strip, full grid)
  piece/[id]/page.jsx   → one page per artwork, auto-generated from lib/pieces.js
  api/checkout/route.js → creates a Stripe Checkout session when someone clicks "Buy now"
  api/webhook/route.js  → Stripe tells this route when a payment succeeds
components/             → Header, Footer, ArtworkCard, WallLabel, gallery, buy button
lib/pieces.js           → every piece: title, price, images, story, sold status
public/images/          → artwork photos and logos
```

## 1. Install dependencies

You need [Node.js](https://nodejs.org) 18+ installed. Then, in this folder:

```bash
npm install
```

## 2. Add your artwork details

Open `lib/pieces.js`. For each piece:

- Set `priceCents` (e.g. `420000` for $4,200.00). Leave it `null` to show
  "Inquire for price" with an email button instead of a buy button.
- Fill in `story` with the real text — right now it's a placeholder.
- Add more photos to `public/images/` and list them in that piece's `images`
  array (the first one is the main photo; extras appear as thumbnails).

## 3. Run it locally

```bash
npm run dev
```

Open http://localhost:3000 — you should see the site.

## 4. Connect Stripe (so "Buy now" actually charges a card)

1. Create a free account at https://dashboard.stripe.com if you don't have one
2. Go to **Developers → API keys**, copy the **Secret key**
3. Copy `.env.example` to `.env.local` and paste the key in as `STRIPE_SECRET_KEY`
4. Start in **test mode** first (Stripe's toggle, top right of the dashboard) —
   you can use card number `4242 4242 4242 4242` with any future expiry/CVC to
   test a purchase without moving real money
5. Once you're ready to accept real payments, switch to your **live** key

### Webhook (marks a piece "sold" automatically)

1. In Stripe: **Developers → Webhooks → Add endpoint**
2. Endpoint URL: `https://artedelara.com/api/webhook`
3. Select event: `checkout.session.completed`
4. Copy the **Signing secret** it gives you into `STRIPE_WEBHOOK_SECRET`

**Before you launch:** `lib/pieces.js` is a plain file, so the webhook can log
a sale but can't actually update "sold" status for visitors in real time.
Move this data into a real database (Supabase's free tier is a good fit)
before you start selling for real — otherwise two people could both "buy" the
same one-of-a-kind piece. The webhook file has a `TODO` marking exactly where
that change goes.

## 5. Deploy to Vercel

1. Push this project to a GitHub repository
2. Go to https://vercel.com → New Project → import that repo
3. In Vercel's project settings, add the same environment variables from
   `.env.local` (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`)
4. Deploy — Vercel builds and hosts it automatically on every push

## 6. Connect artedelara.com

1. In Vercel: **Project → Settings → Domains → Add** → enter `artedelara.com`
2. Vercel shows you one or two DNS records to add (usually an `A` record and
   a `CNAME` for `www`)
3. Log into wherever you bought the domain, open DNS settings, add those
   records exactly as shown
4. Propagation usually takes anywhere from a few minutes to a few hours;
   Vercel issues an SSL certificate automatically once it verifies

## Certificate of authenticity & QR code

Every piece's detail page now shows:

- A **QR code** that links to that piece's own page on your live site (once
  `NEXT_PUBLIC_SITE_URL` is set — see `.env.example`), so a collector can scan
  it to verify the piece
- A **"View certificate"** link to a printable Certificate of Authenticity at
  `/piece/[id]/certificate` — includes the piece's details, a signature line,
  the same QR code, and a "Print / Save as PDF" button (uses the browser's
  built-in print dialog, so no extra service is needed)

Each piece has a `certificateId` in `lib/pieces.js` (e.g. `ADG-0001`) — keep
these unique. This is what's shown on the certificate and encoded in the QR
link.

## Notes

- Payment emails/receipts are sent automatically by Stripe once configured
- The site currently has photos for 2 of 6 pieces — the rest show a
  placeholder gradient until you add images
- To add a brand-new piece: copy an existing block in `lib/pieces.js`, give
  it a unique `id`, and add its photo to `public/images/`
