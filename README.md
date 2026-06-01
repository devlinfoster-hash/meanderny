# MeanderNY Storefront

A one-page storefront for the MeanderNY field guides. Plain Vite + React, no
backend, no database — the guide list is a single array in `src/App.jsx`.
Same toolchain as Hudson Valley Almanac (React + Vite + Vercel, auto-deploy from
a GitHub push).

## Run it locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build into /dist
```

## Deploy to Vercel (one time)

1. Create a new GitHub repo (e.g. `meanderny`) and push these files to `main`.
2. In Vercel: **Add New… → Project → Import** the repo.
   - Framework preset: **Vite** (auto-detected)
   - Build command: `npm run build`  ·  Output dir: `dist`  (both auto-filled)
3. Deploy. Every push to `main` redeploys automatically — same as HVA.
4. **Connect the domain:** Vercel → Project → **Settings → Domains → Add**
   `meanderny.com`. Follow Vercel's DNS instructions at Namecheap (either point
   the nameservers to Vercel, or add the A / CNAME records Vercel gives you).

No `vercel.json` is needed — this is a single page with no client-side routing,
so Vercel's default static serving works as-is.

## Add a guide (the only edit you'll usually make)

Open `src/App.jsx` and add one object to the `GUIDES` array at the top:

```js
{
  id: "ny-firetowers",
  title: "NY Firetowers",
  region: "Statewide · the towers worth the climb",
  blurb: "One sentence on what's inside.",
  price: 9,                 // only shown when status is "available"
  status: "available",      // or "coming-soon"
  url: "https://devlinfoster.gumroad.com/l/your-slug",
  cover: null,              // optional image URL; null = rendered green panel
}
```

- `status: "coming-soon"` shows a muted card with a "Coming soon" corner flag and
  no link — good for showing the roadmap without a broken button.
- `cover` is optional. Leave it `null` and the card draws its own branded cover
  panel from the title/region. Set it to an image URL (e.g. a Gumroad cover PNG)
  to use real art instead.

Commit, push, and Vercel redeploys.

## Brand tokens (kept in sync with the guide covers)

Greens `#33452f` / `#445c3c`, gold `#c2872f`, rust `#a8531e`, paper `#f5efe1`.
Headings & body: **Lora**. Labels/buttons: **Barlow Condensed**.
