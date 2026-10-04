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

`vercel.json` sends every URL to the app, except `/journal/<slug>`, which serves the
static article at `public/journal/<slug>/index.html`.

## Add a guide (the only edit you'll usually make)

Everything on the homepage is drawn from the `GUIDES` list at the top of
`src/App.jsx`: the series cards, the route strip, the bundle box, the hero cover
fan and "More guides". You never touch the layout.

### A new Long Path book = one entry + one cover

1. Save the cover as an 800×1280 JPG in `public/covers/`, e.g. `public/covers/adirondacks.jpg`.
2. Add one object to `GUIDES`:

```js
{
  id: "long-path-adirondacks",
  series: "long-path",          // puts it in the Long Path section
  book: 4,                      // "Book 4" label; cards are ordered by this
  short: "Adirondacks",         // label in the route strip
  title: "Toward the Adirondacks",
  subtitle: "Altamont to Northville",           // "From to To"
  route: { sections: [36, 40], miles: 60 },     // strip order + segment width
  blurb: "One sentence on what's inside.",
  price: 8.99,
  accent: "rust",               // teal | amber | blue | rust | green
  cover: "/covers/adirondacks.jpg",
  cta: "View guide",
  status: "available",          // or "coming-soon" (shows as a row, no link)
  url: "https://devlinfoster.gumroad.com/l/your-slug",
},
```

3. Commit and push. The card, the route-strip segment and the bundle's
   "$xx.xx separately" total update by themselves.

The bundle entry (`kind: "bundle"`) keeps its own title and blurb ("The Complete
3-Guide Series", "All three guides…"), so edit that copy when the bundle's
contents change.

### A guide outside a series

Leave out `series`, `book`, `short` and `route`. It appears under **More
guides** with the neutral accent. `cover` is optional there.
Leave `url` empty (`""`) to show the card without a price or button until the
store link is ready.

```js
{
  id: "ny-firetowers",
  title: "NY Firetowers",
  subtitle: "Statewide · the towers worth the climb",
  blurb: "One sentence on what's inside.",
  price: 9,
  status: "available",
  url: "https://devlinfoster.gumroad.com/l/your-slug",
}
```

### A new series

Add an entry to `SERIES` (heading, route-strip copy, start/end labels, accent)
and use its key as `series` on the books. It gets its own section automatically.

## Design tokens

Matches the Gumroad landing page (`reference/gumroad-landing.html`, a design
reference only; not served). Light and dark follow the device setting.

- Light: background `#f6f1e4` / `#ece5d2`, cards `#fffdf6`, ink `#0c2a30`, muted `#4b6366`, lines `#d9d0b8`.
- Dark: background `#071417` / `#0b1f24`, cards `#0e262c`, ink `#f4efe0`, muted `#a9bfc0`, lines `#1c3a40`.
- Book accents: Book 1 teal `#0b7f7a` / `#2de0d2`, Book 2 amber `#b9690c` / `#f2a93b`,
  Book 3 blue `#2563c9` / `#58a4ff`. Spares for new books: rust, green. Guides outside a
  series use neutral.
- Type: headings, labels and buttons in **Poppins**; accent words in **Lora** italic;
  body text in the system sans-serif.
