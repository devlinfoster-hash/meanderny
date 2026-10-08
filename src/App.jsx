import { useEffect } from "react";

/* Contact address — defined once, reused for the mailto link. */
const CONTACT_EMAIL = "hello@mohawkvalleyalmanac.com";
const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  "MeanderNY correction"
)}`;

/* Barnes & Noble: button text for B&N listings, and the author page. */
const BN_CTA = "Get it on Barnes & Noble";
const BN_AUTHOR_URL = "https://www.barnesandnoble.com/authors/devlin-foster?contributorId=33345836";

/* Set document title, meta description, and canonical URL for a client-rendered
   route. Returns a cleanup that restores the previous values. */
function setDocumentHead({ title, description, canonical }) {
  if (typeof document === "undefined") return () => {};
  const descEl = document.querySelector('meta[name="description"]');
  const canonEl = document.querySelector('link[rel="canonical"]');
  const prev = {
    title: document.title,
    description: descEl ? descEl.getAttribute("content") : null,
    canonical: canonEl ? canonEl.getAttribute("href") : null,
  };
  if (title !== undefined) document.title = title;
  if (description !== undefined && descEl) descEl.setAttribute("content", description);
  if (canonical !== undefined && canonEl) canonEl.setAttribute("href", canonical);
  return () => {
    document.title = prev.title;
    if (descEl && prev.description !== null) descEl.setAttribute("content", prev.description);
    if (canonEl && prev.canonical !== null) canonEl.setAttribute("href", prev.canonical);
  };
}

/* ============================================================================
   SERIES — one entry per book series. The homepage draws a section for each
   series that has guides in GUIDES: the route strip, the featured bundle and
   the book cards. Text here is the series' own copy; everything about the
   individual books comes from GUIDES.
     name       eyebrow above the series (also the hero eyebrow)
     heading    route-strip heading
     sub        route-strip sentence
     lead       sentence above the book cards
     note       OPTIONAL one line under the book cards
     start/end  labels under the two ends of the route strip
     accent     colour of the series bundle (see ACCENTS below)
   ========================================================================== */
const SERIES = {
  "long-path": {
    name: "The Long Path series",
    heading: "Manhattan to Altamont, in order",
    sub: "Each guide picks up where the last one ends, so you can plan a weekend, a section, or the whole way through.",
    lead: "Free & Legal Backcountry Camping, one guide for each stretch of the trail.",
    note: "Paperback editions planned.",
    start: "Washington Heights",
    end: "Altamont",
    accent: "teal",
  },
};

/* The series the hero features (its cover fan and "Get the complete series"). */
const FEATURED_SERIES = "long-path";

/* ============================================================================
   GUIDES — THE ONLY THING YOU EDIT TO ADD A GUIDE
   ----------------------------------------------------------------------------
   Add a guide = add one object here (and, for a book, one cover image in
   public/covers/). The layout reads everything from this list. See the README,
   "Add a guide", for a copy-paste template.

   Fields:
     id         unique string
     title      guide name
     subtitle   one line under the title (for a series book: "From to To")
     blurb      one sentence of what's inside
     price      OPTIONAL number in dollars; leave out (or null) to show the button with no
                price, e.g. for Barnes & Noble, which shows its own price.
                priceLabel (optional) replaces it, e.g. "Free download"
     url        the Gumroad product URL ("" = card shows without price or button)
     status     "available" -> card with price + button
                "coming-soon" -> compact row in "Coming soon", no link
     cover      OPTIONAL portrait cover, 800x1280 jpg in public/covers/
     accent     colour: "teal" | "amber" | "blue" | "rust" | "green" | "neutral"
                (series books only; guides outside a series are always neutral)
     cta        OPTIONAL button text (default "Get the guide")
     note       OPTIONAL small line under the blurb
     links      OPTIONAL [{ label, url }] secondary links under the button
     label      OPTIONAL small label above the title of a guide outside a series
                (default "MeanderNY Field Guide"; "" hides it)
     group      OPTIONAL key into MORE_GUIDE_GROUPS: splits "More guides" into
                headed groups (e.g. "field"); ungrouped guides go last
     section    OPTIONAL "also-by" -> the lower-key "Also by Devlin Foster" section
                near the bottom instead of "More guides"

   Series books (in the series section, cards ordered by `book`):
     series     key into SERIES, e.g. "long-path"
     book       book number -> "Book 1" label and card order
     short      short name for the route strip, e.g. "North"
     route      { sections: [first, last], miles, milesNote? }
                The route strip is ordered by first section; segment width = miles.

   A series bundle (one per series, shown as the featured box):
     kind: "bundle", series, title, blurb, price, url, badge, cta
     "$xx.xx separately" is added up automatically from the series' books.

   Guides without `series` go in "More guides" (or "Also by Devlin Foster" with
   section: "also-by").
   ========================================================================== */
const GUIDES = [
  {
    id: "long-path-bundle",
    kind: "bundle",
    series: "long-path",
    title: "The Complete 3-Guide Series",
    blurb:
      "All three guides in one download, as PDF and EPUB, covering Sections 1–35 plus a bonus chapter on Sections 36–40 toward the Northville-Placid Trail.",
    price: 19.99,
    badge: "Best value",
    cta: "See the bundle",
    status: "available",
    url: "https://devlinfoster.gumroad.com/l/long-path-bundle",
  },
  {
    id: "long-path-north",
    series: "long-path",
    book: 1,
    short: "North",
    title: "North of the Catskills",
    subtitle: "Gilboa to Altamont",
    route: { sections: [29, 35], miles: 78 },
    blurb:
      "Seven state-forest camps, the Helderberg finish, and a bonus chapter beyond Altamont.",
    price: 6.99,
    accent: "teal",
    cover: "/covers/north.jpg",
    cta: "View guide",
    status: "available",
    url: "https://devlinfoster.gumroad.com/l/long-path-north",
  },
  {
    id: "long-path-catskills",
    series: "long-path",
    book: 2,
    short: "Through",
    title: "Through the Catskills",
    subtitle: "Riggsville to West Conesville",
    route: { sections: [16, 28], miles: 116 },
    blurb: "Lean-tos, the Peekamoose permit zone, and plans for the high peaks.",
    price: 8.99,
    accent: "amber",
    cover: "/covers/through.jpg",
    cta: "View guide",
    status: "available",
    url: "https://devlinfoster.gumroad.com/l/long-path-catskills",
  },
  {
    id: "long-path-south",
    series: "long-path",
    book: 3,
    short: "South",
    title: "South of the Catskills",
    subtitle: "Manhattan to Riggsville",
    route: { sections: [1, 15], miles: 164, milesNote: "official, 171 camper's route" },
    blurb: "Shelters, parks and DEC land, two routes, and a bus-assisted start.",
    price: 8.99,
    accent: "blue",
    cover: "/covers/south.jpg",
    cta: "View guide",
    status: "available",
    url: "https://devlinfoster.gumroad.com/l/long-path-south",
  },
  {
    id: "fire-towers-catskills-hudson-valley",
    group: "field",
    title: "Fire Towers of the Catskills & Hudson Valley",
    label: "A Catskill Meandering Field Guide",
    subtitle: "20 Towers, Trailheads, Cab Schedules, Maps & Day Trips (Plus the Catskills Fire Tower Challenge)",
    cover: "/covers/fire-towers.jpg",
    status: "available",
    url: "https://www.barnesandnoble.com/w/fire-towers-of-the-catskills-hudson-valley-devlin-foster/1151609377",
    cta: BN_CTA,
  },
  {
    id: "rambles-1863",
    group: "field",
    title: "Guide to Rambles from the Catskill Mountain House",
    subtitle: "The Catskills · Written 1863, walked today",
    blurb:
      "The complete 1863 trail guide — reproduced in full — with a then-and-now walking companion and an illustrated four-station map. Free to read.",
    price: 0,
    priceLabel: "Free download",
    status: "available",
    url: "https://devlinfoster.gumroad.com/l/rambles-1863",
  },
  {
    id: "catskill-waterfalls",
    group: "field",
    title: "Catskill Waterfalls",
    subtitle: "Catskill Park · find them, reach them, safely",
    blurb:
      "What the pretty lists leave out: where to park now, whether you can swim, and which spots are genuinely dangerous.",
    status: "available",
    cover: "/covers/catskill-waterfalls.jpg",
    url: "https://www.barnesandnoble.com/w/catskill-waterfalls-devlin-foster/1151459185",
    cta: BN_CTA,
  },
  {
    id: "trails-that-say-yes",
    group: "field",
    title: "Trails That Say Yes",
    // label and subtitle as printed on the cover
    label: "A MeanderNY Guide",
    subtitle: "An Honest, Verified Guide to Wheelchair- and Low-Stamina-Friendly Trails in the Hudson Valley and Capital Region",
    cover: "/covers/trails-that-say-yes.jpg",
    blurb:
      "Every trail in this book says yes: wheelchair- and low-stamina-friendly trails, checked before you drive to find out.",
    status: "available",
    url: "https://www.barnesandnoble.com/w/trails-that-say-yes-devlin-foster/1151457321",
    cta: BN_CTA,
  },
  {
    id: "closer-than-you-think",
    group: "hudson-valley",
    title: "Closer Than You Think",
    // label and subtitle as printed on the cover
    label: "A Hudson Valley Almanac Guide",
    subtitle: "22 Upstate Saturdays",
    cover: "/covers/closer-than-you-think.jpg",
    blurb:
      "22 day-long Saturday loops through upstate farm country, from Greene County to Cooperstown and Lake George, with the stops in driving order.",
    status: "available",
    url: "https://www.barnesandnoble.com/w/closer-than-you-think-devlin-foster/1151458991",
    cta: BN_CTA,
  },
  {
    id: "choose-your-own-saturday",
    group: "hudson-valley",
    title: "Choose Your Own Saturday",
    // label and subtitle as printed on the cover
    label: "A Hudson Valley Almanac Guide",
    subtitle: "15 Themed Trails to Cideries, Sugarhouses, Orchards & Makers",
    cover: "/covers/choose-your-own-saturday.jpg",
    blurb:
      "15 themed trails through cideries, sugarhouses, orchards and makers, so you can pick your Saturday by what you feel like doing.",
    status: "available",
    url: "https://www.barnesandnoble.com/w/choose-your-own-saturday-devlin-foster/1151479117",
    cta: BN_CTA,
  },
  {
    id: "hudson-valley-finds",
    group: "hudson-valley",
    title: "Hudson Valley Finds",
    // label and subtitle as printed on the cover
    label: "A MeanderNY Guide",
    subtitle: "A Real Guide to Antiquing Across Six Counties",
    cover: "/covers/hudson-valley-finds.jpg",
    blurb:
      "A real guide to antiquing across six counties: six antiquing-day chapters and a full directory of shops.",
    status: "available",
    url: "https://www.barnesandnoble.com/w/hudson-valley-finds-devlin-foster/1151479099",
    cta: BN_CTA,
  },
  {
    id: "bad-weather-guide",
    group: "hudson-valley",
    title: "Bad Weather Guide",
    label: "A MeanderNY Guide",
    subtitle: "8 Rainy Afternoons: Tasting Rooms, Studios, Markets, Museums & Bookstores in the Hudson Valley, Catskills, and Capital Region",
    cover: "/covers/bad-weather-guide.jpg",
    status: "available",
    url: "https://www.barnesandnoble.com/w/bad-weather-guide-devlin-foster/1151609635",
    cta: BN_CTA,
  },
  {
    id: "shelf-life",
    group: "hudson-valley",
    title: "Shelf Life",
    label: "A MeanderNY Guide",
    subtitle: "Indie Bookshops of the Hudson Valley, Catskills, and Capital Region",
    cover: "/covers/shelf-life.jpg",
    status: "available",
    url: "https://www.barnesandnoble.com/w/shelf-life-devlin-foster/1151609632",
    cta: BN_CTA,
  },
  {
    id: "freezer-full-hudson-valley",
    group: "food",
    title: "Freezer Full (Hudson Valley)",
    label: "A Hudson Valley Almanac Guide",
    subtitle: "How to Buy a Half Cow, Quarter Beef, or Whole Hog from Hudson Valley Farms",
    cover: "/covers/freezer-full-hudson-valley.jpg",
    blurb:
      "A plain-English guide to buying a quarter, half, or whole animal straight from a Hudson Valley farm, with a 112-farm directory.",
    status: "available",
    url: "https://www.barnesandnoble.com/w/freezer-full-devlin-foster/1151584598",
    cta: BN_CTA,
  },
  {
    id: "freezer-full-mohawk-valley",
    group: "food",
    title: "Freezer Full (Mohawk Valley)",
    label: "A Mohawk Valley Almanac Guide",
    subtitle: "How to Buy a Half Cow, Quarter Beef, or Whole Hog from Mohawk Valley Farms",
    cover: "/covers/freezer-full-mohawk-valley.jpg",
    blurb:
      "A plain-English guide to buying a quarter, half, or whole animal straight from a Mohawk Valley farm, with a 100-farm directory.",
    status: "available",
    url: "https://www.barnesandnoble.com/w/freezer-full-devlin-foster/1151584565",
    cta: BN_CTA,
  },
  {
    id: "different-overlanding",
    title: "A Different Kind of Overlanding",
    blurb: "Weekend car camping and scenic drives in upstate New York.",
    price: null,
    status: "coming-soon",
    url: "",
  },
  {
    id: "world-kitchen-on-a-budget",
    section: "also-by",
    title: "The World Kitchen on a Budget",
    label: "",
    subtitle: "Global Recipes for Short Nights and Shorter Budgets", // as printed on the cover
    cover: "/covers/world-kitchen-on-a-budget.jpg",
    status: "available",
    url: "https://www.barnesandnoble.com/w/the-world-kitchen-on-a-budget-devlin-foster/1151323091",
    cta: BN_CTA,
  },
  {
    id: "when-the-numbers-change",
    section: "also-by",
    title: "When the Numbers Change",
    label: "",
    subtitle: "How to Keep a Household Going When Resources Get Tight", // as printed on the cover
    cover: "/covers/when-the-numbers-change.jpg",
    status: "available",
    url: "https://www.barnesandnoble.com/w/when-the-numbers-change-devlin-foster/1151359465",
    cta: BN_CTA,
  },
];

/* ============================================================================
   RESTORED ANTIQUE MAPS
   ----------------------------------------------------------------------------
   Same card as GUIDES (see above). Each entry is one historical Catskill map,
   carefully restored and offered as a high-resolution download on Gumroad.
   Image fields: image (URL), imageAlt, imageW/imageH (intrinsic px, to reserve
   space and avoid layout shift).
   ========================================================================== */
const MAPS = [
  {
    id: "catskill-1879",
    title: "Catskill Mountains, 1879",
    subtitle: "Restored antique survey · drawn 1879",
    blurb:
      "Walton Van Loan's earliest survey — the Catskill Mountain House alone, before the grand hotels multiplied. North & South Lake, Kaaterskill Falls, and the cliff-edge escarpment ledges. Restored in three editions: color, green, and black & white.",
    price: 11.99,
    status: "available",
    url: "https://devlinfoster.gumroad.com/l/catskill-1879",
    image: "/map-1879-card.jpg",
    imageAlt:
      "Detail of Walton Van Loan's 1879 map showing North and South Lakes, the Catskill Mountain House and South Mountain",
    imageW: 1200,
    imageH: 800,
    cta: "Get the Map",
    links: [
      {
        label: "More Catskill maps on Redbubble",
        url: "https://www.redbubble.com/people/CatskillMeander/shop?collections=4530751",
      },
    ],
  },
  {
    id: "catskill-1882",
    title: "Catskill Mountains, 1882",
    subtitle: "Restored antique survey · drawn 1882",
    blurb:
      "Van Loan's updated map — now adding the brand-new Hotel Kaaterskill and Laurel House. The same Catskill country three years later, with a grand hotel that had just been built. Restored in three editions, fully sourced from the Library of Congress.",
    price: 11.99,
    status: "available",
    url: "https://devlinfoster.gumroad.com/l/catskill-1882",
    domId: "framed-1882",
    image: "/map-1882-card.jpg",
    imageAlt:
      "Detail of Walton Van Loan's 1882 map showing North and South Lakes, Kaaterskill Mountain and the escarpment",
    imageW: 1200,
    imageH: 800,
    cta: "Get the Map",
    links: [
      {
        label: "Order it framed — $129",
        url: "https://www.etsy.com/listing/4521930209/framed-1882-catskills-map-restored-van",
      },
      {
        label: "Also on mugs, totes & stickers",
        url: "https://www.redbubble.com/shop/ap/181449127",
      },
    ],
  },
];

/* "More guides" groups, in display order. A guide joins one with `group: "<key>"`. */
const MORE_GUIDE_GROUPS = [
  { key: "field", title: "Field guides" },
  { key: "hudson-valley", title: "Hudson Valley guides" },
  { key: "food", title: "Food and farms" },
];

/* --- derived lists (layout reads these; edit GUIDES, not these) ------------ */

const NUMBER_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const numberWord = (n) => NUMBER_WORDS[n] ?? String(n);

const formatPrice = (p) => `$${Number.isInteger(p) ? p : p.toFixed(2)}`;

function seriesData(key) {
  const books = GUIDES.filter(
    (g) => g.series === key && g.kind !== "bundle" && g.status === "available"
  ).sort((a, b) => a.book - b.book);
  const bundle = GUIDES.find((g) => g.series === key && g.kind === "bundle");
  const alongTrail = books
    .filter((b) => b.route)
    .sort((a, b) => a.route.sections[0] - b.route.sections[0]);
  // sum in cents so 6.99 + 8.99 + 8.99 is exactly 24.97
  const separately = books.reduce((sum, b) => sum + Math.round(b.price * 100), 0) / 100;
  return { key, ...SERIES[key], books, bundle, alongTrail, separately };
}

const accentVar = (accent) => ({ "--accent": `var(--${accent || "neutral"})` });

const coverAlt = (g) => `Cover: ${g.title}`;

function listTitles(books) {
  const t = books.map((b) => b.title);
  return t.length > 1 ? `${t.slice(0, -1).join(", ")} and ${t[t.length - 1]}` : t[0] || "";
}

/* --- pieces ---------------------------------------------------------------- */

function CoverFan({ books, className, label }) {
  // up to three covers, fanned; the middle one sits on top
  const shown = books.filter((b) => b.cover).slice(0, 3);
  if (shown.length === 0) return null;
  return (
    <div className={`fan ${className || ""}`} role="img" aria-label={label}>
      {shown.map((b, i) => (
        <img
          key={b.id}
          className={`fan-cv fan-cv--${["a", "b", "c"][i]}${shown.length === 1 ? " fan-cv--solo" : ""}`}
          src={b.cover}
          width="800"
          height="1280"
          alt=""
          loading="eager"
        />
      ))}
    </div>
  );
}

function Price({ guide }) {
  if (guide.priceLabel == null && guide.price == null) return null;
  return (
    <span className={guide.priceLabel ? "price price--label" : "price"}>
      {guide.priceLabel ?? formatPrice(guide.price)}
    </span>
  );
}

function CardLinks({ links }) {
  if (!links || links.length === 0) return null;
  return (
    <div className="card-links">
      {links.map((link) => (
        <a key={link.url} className="card-link" href={link.url} target="_blank" rel="noopener">
          {link.label}
        </a>
      ))}
    </div>
  );
}

function GuideCard({ guide }) {
  const isBook = Boolean(guide.series);
  const r = guide.route;
  return (
    <article
      id={guide.domId}
      className={`card${guide.cover ? " card--book" : ""}${guide.image ? " card--img" : ""}`}
      style={accentVar(isBook ? guide.accent : "neutral")}
    >
      {guide.cover && (
        <img
          className="card-cv"
          src={guide.cover}
          width="800"
          height="1280"
          loading="lazy"
          alt={coverAlt(guide)}
        />
      )}
      {guide.image && (
        <img
          className="card-img"
          src={guide.image}
          width={guide.imageW}
          height={guide.imageH}
          loading="lazy"
          alt={guide.imageAlt || `${guide.title} cover`}
        />
      )}
      <div className="card-body">
        {isBook && guide.book && <div className="bk">Book {guide.book}</div>}
        {!isBook && !guide.image && (guide.label ?? "MeanderNY Field Guide") && (
          <div className="bk">{guide.label ?? "MeanderNY Field Guide"}</div>
        )}
        <h3>{guide.title}</h3>
        {isBook && r ? (
          <ul className="card-facts">
            <li>
              <b>{guide.subtitle}</b> · Sections {r.sections[0]}–{r.sections[1]}
            </li>
            <li>
              About <b>{r.miles} miles</b>
              {r.milesNote ? ` ${r.milesNote}` : ""}
            </li>
          </ul>
        ) : (
          guide.subtitle && <p className="card-sub">{guide.subtitle}</p>
        )}
        {guide.blurb && <p className="card-blurb">{guide.blurb}</p>}
        {guide.note && <p className="card-note">{guide.note}</p>}
      </div>
      {guide.url && (
        <div className="card-foot">
          <Price guide={guide} />
          <a className="btn" href={guide.url} target="_blank" rel="noopener noreferrer">
            {guide.cta || "Get the guide"}
          </a>
        </div>
      )}
      <CardLinks links={guide.links} />
    </article>
  );
}

function RouteStrip({ s }) {
  if (s.alongTrail.length === 0) return null;
  return (
    <section className="route" aria-labelledby={`route-${s.key}`}>
      <div className="wrap">
        <div className="eyebrow">One trail, {numberWord(s.alongTrail.length)} books</div>
        <h2 id={`route-${s.key}`}>{s.heading}</h2>
        <p className="sub">{s.sub}</p>
        <div className="bar" aria-hidden="true">
          {s.alongTrail.map((b) => (
            <i key={b.id} style={{ flex: b.route.miles, ...accentVar(b.accent) }} />
          ))}
        </div>
        <div className="legs">
          {s.alongTrail.map((b) => (
            <span key={b.id} style={{ flex: b.route.miles, ...accentVar(b.accent) }}>
              {b.short} · §{b.route.sections[0]}–{b.route.sections[1]}
            </span>
          ))}
        </div>
        <div className="ends">
          <span>{s.start}</span>
          <span>{s.end}</span>
        </div>
      </div>
    </section>
  );
}

function Bundle({ s }) {
  const b = s.bundle;
  if (!b || b.status !== "available") return null;
  return (
    <div className="bundle" style={accentVar(s.accent)}>
      <CoverFan books={s.books} className="fan--mini" label={`The ${numberWord(s.books.length)} guide covers together`} />
      <div>
        {b.badge && <span className="badge">{b.badge}</span>}
        <h3>{b.title}</h3>
        <p>{b.blurb}</p>
        <p className="price">
          {formatPrice(b.price)}
          {s.separately > b.price && <s>{formatPrice(s.separately)} separately</s>}
        </p>
        <a className="btn" href={b.url} target="_blank" rel="noopener noreferrer">
          {b.cta || "See the bundle"}
        </a>
      </div>
    </div>
  );
}

function SeriesSection({ s }) {
  return (
    <div className="series" id={s.key}>
      <RouteStrip s={s} />
      <section className="sec">
        <div className="wrap">
          <Bundle s={s} />
          <div className="sec-head sec-head--after">
            <div className="eyebrow">{s.bundle ? "Or buy one at a time" : s.name}</div>
            <h2>The guides</h2>
            <p className="lead">{s.lead}</p>
          </div>
          <div className="grid grid--books">
            {s.books.map((g) => (
              <GuideCard key={g.id} guide={g} />
            ))}
          </div>
          {s.note && <p className="series-note">{s.note}</p>}
        </div>
      </section>
    </div>
  );
}

/* --- shared chrome --------------------------------------------------------- */

function SiteHeader() {
  return (
    <header className="top">
      <div className="wrap">
        <a className="mark" href="/">
          Meander<b>NY</b>
        </a>
        <nav className="top-nav" aria-label="Primary">
          <span className="top-tag">A Catskill Meandering Project</span>
          <a href="/contact">Contact</a>
        </nav>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-row">
          <span className="foot-word">
            Meander<b>NY</b>
            <span>The field-guide side of Catskill Meandering</span>
          </span>
          <span className="foot-meta">
            © 2026 · meanderny.com · New York’s Upper Hudson Valley
          </span>
        </div>
        <nav className="foot-nav" aria-label="Footer">
          <a href="/">Guides</a>
          <a href="/contact">Contact</a>
        </nav>
        <p className="foot-fam">
          Also from Catskill Meandering:{" "}
          <a href="https://hudsonvalleyalmanac.com/" target="_blank" rel="noopener">
            Hudson Valley Almanac
          </a>{" "}
          ·{" "}
          <a href="https://www.mohawkvalleyalmanac.com/" target="_blank" rel="noopener">
            Mohawk Valley Almanac
          </a>
        </p>
        <p className="foot-disc">
          Unofficial field guides. Not affiliated with or endorsed by the NYS Department of
          Environmental Conservation or the New York–New Jersey Trail Conference. Always confirm
          current rules, closures, and conditions with official sources before you head out.
        </p>
      </div>
    </footer>
  );
}

/* --- pages ----------------------------------------------------------------- */

function HomeView() {
  const seriesKeys = Object.keys(SERIES).filter((k) => GUIDES.some((g) => g.series === k));
  const allSeries = seriesKeys.map(seriesData);
  const featured = allSeries.find((s) => s.key === FEATURED_SERIES) || allSeries[0];
  const moreGuides = GUIDES.filter(
    (g) => !g.series && !g.section && g.status === "available"
  );
  const groupKeys = MORE_GUIDE_GROUPS.map((grp) => grp.key);
  const moreGroups = [
    ...MORE_GUIDE_GROUPS.map((grp) => ({
      ...grp,
      guides: moreGuides.filter((g) => g.group === grp.key),
    })),
    { key: "other", guides: moreGuides.filter((g) => !groupKeys.includes(g.group)) },
  ].filter((grp) => grp.guides.length > 0);
  const alsoBy = GUIDES.filter((g) => g.section === "also-by" && g.status === "available");
  const comingGuides = GUIDES.filter((g) => g.status === "coming-soon");

  return (
    <main>
      {/* hero */}
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <div className="eyebrow">Field Guides for New York's Outdoors</div>
            <h1>
              Field guides for getting <em>out there</em> in New York.
            </h1>
            <p className="lede">
              Carefully researched guides to camping, hiking and meandering New York's
              backcountry, built on official DEC and NYNJTC sources, with every detail we
              couldn't confirm clearly marked.
            </p>
            <div className="cta">
              {featured?.bundle && (
                <a
                  className="btn"
                  href={featured.bundle.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get the complete series
                </a>
              )}
              <a className="btn ghost" href="#guides">
                Browse the guides
              </a>
            </div>
            <div className="hero-meta">
              <span>
                <i className="dot" />Sources shown, unknowns marked
              </span>
              <span>
                <i className="dot" />Companions to the official guides
              </span>
            </div>
          </div>
          {featured && (
            <CoverFan
              books={featured.books}
              label={`Covers of the ${featured.name.replace(/^The /, "").replace(/ series$/, "")} guides: ${listTitles(featured.books)}`}
            />
          )}
        </div>
      </section>

      {/* in-page nav */}
      <nav className="mny-nav" aria-label="On this page">
        <a href="#guides">Guides</a>
        <span className="mny-nav-sep" aria-hidden="true">·</span>
        <a href="#coming-soon">Coming soon</a>
        <span className="mny-nav-sep" aria-hidden="true">·</span>
        <a href="#maps">Maps</a>
        <span className="mny-nav-sep" aria-hidden="true">·</span>
        <a href="#photographs">Photographs</a>
      </nav>

      <div id="guides">
        {allSeries.map((s) => (
          <SeriesSection key={s.key} s={s} />
        ))}

        {/* guides outside a series */}
        {moreGuides.length > 0 && (
          <section className="sec sec--band" id="more-guides">
            <div className="wrap">
              <div className="eyebrow eyebrow--neutral">More guides</div>
              {moreGroups.map((grp) => (
                <div className="guide-group" key={grp.key}>
                  {grp.title && <h3 className="group-title">{grp.title}</h3>}
                  <div className="grid">
                    {grp.guides.map((g) => (
                      <GuideCard key={g.id} guide={g} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="wrap">
        {/* coming soon */}
        {comingGuides.length > 0 && (
          <section id="coming-soon" className="sec sec--tight">
            <div className="eyebrow eyebrow--neutral">Coming soon</div>
            <ul className="soon-list">
              {comingGuides.map((g) => (
                <li className="soon-row" key={g.id}>
                  <div className="soon-main">
                    <div className="soon-head">
                      <h3 className="soon-title">{g.title}</h3>
                      {g.subtitle && <span className="soon-region">{g.subtitle}</span>}
                    </div>
                    <p className="soon-blurb">{g.blurb}</p>
                  </div>
                  <span className="soon-flag">Coming soon</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* restored antique maps */}
        <section id="maps" className="sec sec--tight">
          <div className="eyebrow eyebrow--neutral">Restored Antique Maps</div>
          <div className="grid grid--maps">
            {MAPS.map((m) => (
              <GuideCard key={m.id} guide={m} />
            ))}
          </div>
        </section>

        {/* antique photographs and postcards */}
        <section id="photographs" className="sec sec--tight">
          <div className="eyebrow eyebrow--neutral">Antique photographs and postcards</div>
          <div className="strip">
            <p className="strip-text">
              Restored 1900s photographs, postcards, and historical trail guides of the
              Catskills.
            </p>
            <a
              className="btn"
              href="https://www.etsy.com/shop/TheForgottenPress"
              target="_blank"
              rel="noopener"
            >
              Visit The Forgotten Press on Etsy
            </a>
          </div>
          {/* TODO: thumbnail row — drop a <div className="strip-thumbs"> of 3–5
              postcard/photo <img>s (lazy, with alt text) here once scans are ready. */}
        </section>

        {/* other books by the author */}
        {alsoBy.length > 0 && (
          <section id="also-by" className="sec sec--tight also">
            <div className="eyebrow eyebrow--neutral">Also by Devlin Foster</div>
            <div className="grid">
              {alsoBy.map((g) => (
                <GuideCard key={g.id} guide={g} />
              ))}
            </div>
            <a className="also-all" href={BN_AUTHOR_URL} target="_blank" rel="noopener">
              All my books on Barnes &amp; Noble
            </a>
          </section>
        )}

        {/* who makes these */}
        <section className="maker">
          <div className="eyebrow">Who makes these</div>
          <p>
            MeanderNY guides are made by Devlin Foster, a New York hiker. Land rules, water,
            distances, and coordinates come from official NYS DEC and NYNJTC sources, plus hiker
            reports and mapping data credited in each guide. When something can't be confirmed,
            the guide says so instead of guessing. These are unofficial companions to the
            official guides, not replacements for them.
          </p>
        </section>
      </div>
    </main>
  );
}

function ContactView() {
  useEffect(
    () =>
      setDocumentHead({
        title: "Contact and corrections — MeanderNY",
        description:
          "Report a mistake, a closed business, or a changed trail in a MeanderNY field guide. Corrections are folded into the next edition.",
        canonical: "https://www.meanderny.com/contact",
      }),
    []
  );

  return (
    <main className="wrap">
      <section className="page">
        <div className="eyebrow">Contact</div>
        <h1 className="page-title">Contact and corrections</h1>
        <p className="page-text">
          Found a mistake, a business that has closed, or a trail that has changed? Email me.
          Please include the guide, the page or section, and what you saw. Corrections are
          folded into the next edition.
        </p>
        <a className="page-mail" href={CONTACT_MAILTO}>
          {CONTACT_EMAIL}
        </a>
        <p className="page-note">
          This address belongs to the Mohawk Valley Almanac, which hosts the companion page for
          North of the Catskills.
        </p>
      </section>
    </main>
  );
}

/* --- the app --------------------------------------------------------------- */

export default function App() {
  useEffect(() => {
    // Load fonts (harmless if index.html already includes them).
    const id = "mny-fonts";
    if (!document.getElementById(id)) {
      const pre1 = document.createElement("link");
      pre1.rel = "preconnect";
      pre1.href = "https://fonts.googleapis.com";
      const pre2 = document.createElement("link");
      pre2.rel = "preconnect";
      pre2.href = "https://fonts.gstatic.com";
      pre2.crossOrigin = "anonymous";
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = FONTS_URL;
      document.head.append(pre1, pre2, link);
    }
  }, []);

  const path = typeof window !== "undefined" ? window.location.pathname : "/";
  const isContact = path === "/contact" || path === "/contact/";

  return (
    <div className="mny">
      <style>{CSS}</style>
      <SiteHeader />
      {isContact ? <ContactView /> : <HomeView />}
      <SiteFooter />
    </div>
  );
}

const FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;1,400;1,500&family=Poppins:wght@500;600;700;800&display=swap";

/* --- styles ---------------------------------------------------------------- */
/* Colours follow the device's light/dark setting. Accents are named tokens so
   each one has a light and a dark value; a guide's `accent` picks one. */

const CSS = `
html{ scroll-behavior:smooth; }
.mny *{ box-sizing:border-box; }
.mny{
  color-scheme:light dark;
  --bg:#f6f1e4; --bg2:#ece5d2; --card:#fffdf6; --ink:#0c2a30; --muted:#4b6366; --line:#d9d0b8;
  --teal:#0b7f7a; --amber:#b9690c; --blue:#2563c9; --rust:#a8461b; --green:#3d6b2f; --neutral:#5f7275;
  --accent:var(--teal); --btn:#0c2a30; --btnink:#f6f1e4;
  --shadow:0 10px 30px rgba(12,42,48,.12);
  --head:"Poppins","Avenir Next","Segoe UI",system-ui,-apple-system,sans-serif;
  --serif:"Lora",Georgia,"Times New Roman",serif;
  --body:system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
  min-height:100vh; background:var(--bg); color:var(--ink);
  font-family:var(--body); line-height:1.6; overflow-x:hidden;
  -webkit-font-smoothing:antialiased; -webkit-text-size-adjust:100%;
}
@media (prefers-color-scheme:dark){
  .mny{
    --bg:#071417; --bg2:#0b1f24; --card:#0e262c; --ink:#f4efe0; --muted:#a9bfc0; --line:#1c3a40;
    --teal:#2de0d2; --amber:#f2a93b; --blue:#58a4ff; --rust:#f08a5d; --green:#8fd16f; --neutral:#9fb3b4;
    --btn:#2de0d2; --btnink:#06191c;
    --shadow:0 10px 30px rgba(0,0,0,.45);
  }
}
.mny a{ color:inherit; }
.mny :focus-visible{ outline:3px solid var(--teal); outline-offset:3px; border-radius:6px; }
.wrap{ width:min(1100px, 100% - 40px); margin-inline:auto; }
.eyebrow{ font:700 .78rem/1.2 var(--head); letter-spacing:.2em; text-transform:uppercase; color:var(--accent); }
.eyebrow--neutral{ color:var(--neutral); }
.mny h1, .mny h2, .mny h3{ font-family:var(--head); }
.mny h2{ font-weight:800; font-size:clamp(1.4rem,3vw,2rem); line-height:1.15; margin:.4rem 0 .5rem; }

/* header */
.top{ border-bottom:1px solid var(--line); background:var(--bg2); }
.top .wrap{ display:flex; align-items:center; justify-content:space-between; gap:12px; padding:14px 0; }
.mark{ font:800 1.15rem/1 var(--head); letter-spacing:.12em; text-transform:uppercase; text-decoration:none; }
.mark b, .foot-word b{ color:var(--teal); font-weight:800; }
.top-nav{ display:flex; align-items:center; gap:18px; flex-wrap:wrap; justify-content:flex-end; }
.top-tag{ font:600 .72rem/1.2 var(--head); letter-spacing:.14em; text-transform:uppercase; color:var(--muted); }
.top-nav a{ font:700 .78rem/1 var(--head); letter-spacing:.14em; text-transform:uppercase; text-decoration:none; color:var(--teal); }
.top-nav a:hover{ text-decoration:underline; text-underline-offset:4px; }

/* buttons */
.btn{
  display:inline-block; padding:14px 22px; border-radius:999px; font:700 .95rem/1 var(--head);
  text-decoration:none; background:var(--btn); color:var(--btnink) !important; border:2px solid var(--btn);
  transition:transform .15s ease; text-align:center;
}
.btn:hover{ transform:translateY(-2px); }
.btn.ghost{ background:transparent; color:var(--ink) !important; border-color:var(--line); }
.btn.ghost:hover{ border-color:var(--teal); }

/* hero */
.hero{ padding:clamp(40px,7vw,88px) 0 clamp(36px,6vw,72px);
  background:radial-gradient(900px 400px at 85% 0%, color-mix(in srgb, var(--teal) 16%, transparent), transparent 70%), var(--bg); }
.hero-grid{ display:grid; grid-template-columns:1.1fr .9fr; gap:clamp(24px,5vw,64px); align-items:center; }
.hero h1{ font-weight:800; font-size:clamp(2rem,5.2vw,3.6rem); line-height:1.08; margin:.5rem 0 1rem; letter-spacing:-.01em; }
.hero h1 em{ font:italic 500 1em/1 var(--serif); color:var(--teal); }
.lede{ font-size:clamp(1.05rem,1.8vw,1.25rem); color:var(--muted); max-width:34em; margin:0 0 1.6rem; }
.cta{ display:flex; flex-wrap:wrap; gap:12px; }
.hero-meta{ margin-top:24px; display:flex; gap:10px 26px; flex-wrap:wrap; font:600 .72rem/1.3 var(--head); letter-spacing:.14em; text-transform:uppercase; color:var(--muted); }
.hero-meta span{ display:inline-flex; align-items:center; gap:9px; }
.dot{ width:6px; height:6px; border-radius:50%; background:var(--teal); display:inline-block; }

/* cover fan (hero + bundle) */
.fan{ position:relative; height:clamp(300px,42vw,470px); }
.fan-cv{ position:absolute; width:44%; height:auto; aspect-ratio:5/8; object-fit:cover; border-radius:8px; box-shadow:var(--shadow); border:1px solid var(--line); }
.fan-cv--a{ left:2%; top:9%; transform:rotate(-7deg); }
.fan-cv--b{ left:28%; top:0; transform:rotate(1deg); z-index:2; }
.fan-cv--c{ right:2%; top:11%; transform:rotate(8deg); }
.fan-cv--solo{ left:28%; top:0; transform:none; }
.fan--mini{ height:auto; width:clamp(150px,22vw,230px); aspect-ratio:1/0.82; }
.fan--mini .fan-cv{ top:auto; bottom:0; width:46%; border-radius:6px; }
.fan--mini .fan-cv--a{ left:0; transform:rotate(-6deg); }
.fan--mini .fan-cv--b{ left:27%; bottom:6%; transform:none; }
.fan--mini .fan-cv--c{ right:0; transform:rotate(6deg); }

/* in-page nav */
.mny-nav{
  position:sticky; top:0; z-index:5;
  display:flex; align-items:center; justify-content:center; gap:16px; flex-wrap:wrap;
  padding:13px 20px; background:color-mix(in srgb, var(--bg) 92%, transparent); backdrop-filter:blur(6px);
  border-block:1px solid var(--line);
  font:700 .78rem/1 var(--head); letter-spacing:.16em; text-transform:uppercase;
}
.mny-nav a{ color:var(--ink); text-decoration:none; padding:4px 2px; }
.mny-nav a:hover{ color:var(--teal); }
.mny-nav-sep{ color:var(--line); }
#guides, #more-guides, #coming-soon, #maps, #photographs, #framed-1882, .series{ scroll-margin-top:56px; }

/* route strip */
.route{ padding:clamp(28px,5vw,56px) 0; background:var(--bg2); border-bottom:1px solid var(--line); }
.route .sub{ margin:0 0 1.4rem; color:var(--muted); max-width:40em; }
.bar{ display:flex; height:16px; border-radius:999px; overflow:hidden; gap:3px; }
.bar i{ display:block; background:var(--accent); }
.legs{ display:flex; gap:3px; margin-top:10px; font:600 .8rem/1.3 var(--head); }
.legs span{ padding-inline:2px; color:var(--accent); min-width:0; }
.ends{ display:flex; justify-content:space-between; margin-top:6px; font:600 .72rem/1 var(--head); letter-spacing:.14em; text-transform:uppercase; color:var(--muted); }

/* sections */
.sec{ padding:clamp(40px,6vw,76px) 0; }
.sec--tight{ padding:clamp(28px,4vw,48px) 0 0; }
.sec--band{ background:var(--bg2); border-block:1px solid var(--line); }
.sec-head--after{ margin-top:clamp(40px,6vw,64px); }
.lead{ color:var(--muted); max-width:40em; margin:0; }
.series-note{ margin:18px 0 0; font:600 .78rem/1.4 var(--head); letter-spacing:.14em; text-transform:uppercase; color:var(--muted); }

/* bundle */
.bundle{ display:grid; grid-template-columns:auto 1fr; gap:clamp(18px,4vw,40px); align-items:center; background:var(--card); border:2px solid var(--accent); border-radius:20px; padding:clamp(18px,3.5vw,34px); box-shadow:var(--shadow); }
.bundle h3{ font-weight:800; font-size:clamp(1.25rem,2.6vw,1.7rem); line-height:1.2; margin:.6rem 0 .5rem; }
.bundle p{ margin:0 0 1rem; color:var(--muted); }
.bundle .price{ display:block; color:var(--ink); }
.badge{ display:inline-block; font:700 .72rem/1 var(--head); letter-spacing:.14em; text-transform:uppercase; background:var(--accent); color:var(--btnink); padding:6px 10px; border-radius:999px; }
.price{ font:800 1.5rem/1 var(--head); color:var(--ink); }
.price s{ font-weight:600; font-size:1rem; color:var(--muted); margin-left:8px; }
.price--label{ font-size:1rem; font-weight:700; line-height:1.3; }

/* cards */
.grid{ display:grid; grid-template-columns:repeat(auto-fill, minmax(280px,1fr)); gap:22px; margin-top:26px; }
.group-title{ font-weight:700; font-size:1.05rem; margin:clamp(28px,4vw,40px) 0 0; padding-bottom:8px; border-bottom:1px solid var(--line); }
.eyebrow + .guide-group .group-title{ margin-top:14px; }
.guide-group .grid{ margin-top:18px; }
.grid--books{ grid-template-columns:repeat(3,1fr); }
.grid--maps{ grid-template-columns:repeat(2,1fr); }
.card{ background:var(--card); border:1px solid var(--line); border-top:5px solid var(--accent); border-radius:16px; padding:20px; display:flex; flex-direction:column; box-shadow:var(--shadow); min-width:0; }
.card-cv{ display:block; width:62%; height:auto; margin:0 auto 16px; aspect-ratio:5/8; object-fit:cover; border-radius:8px; border:1px solid var(--line); box-shadow:var(--shadow); }
.card-img{ display:block; width:calc(100% + 40px); height:auto; margin:-20px -20px 16px; aspect-ratio:3/2; object-fit:cover; border-radius:11px 11px 0 0; }
.bk{ font:700 .72rem/1.35 var(--head); letter-spacing:.18em; text-transform:uppercase; color:var(--accent); }
.card h3{ font-weight:700; font-size:1.15rem; line-height:1.25; margin:.5rem 0; }
.card-facts{ list-style:none; margin:0 0 .9rem; padding:0; font-size:.92rem; color:var(--muted); }
.card-facts li{ padding:.15rem 0; }
.card-facts b{ color:var(--ink); font-weight:600; }
.card-sub{ margin:0 0 .7rem; font:italic 500 .95rem/1.4 var(--serif); color:var(--muted); }
.card-blurb{ margin:0 0 1.1rem; font-size:.95rem; color:var(--muted); }
.card-note{ margin:-.6rem 0 1.1rem; font-size:.82rem; font-style:italic; color:var(--muted); }
.card-body{ display:flex; flex-direction:column; }
.card-foot{ margin-top:auto; display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap; }
.card-foot .btn:only-child{ margin-left:auto; }
.also .card{ box-shadow:none; border-top-width:1px; background:transparent; padding:16px 18px; }
.also .card h3{ font-size:1rem; }
.also .card-cv{ width:42%; box-shadow:none; }
.also .btn{ background:transparent; color:var(--ink) !important; border-color:var(--line); }
.also .btn:hover{ border-color:var(--teal); }
.also .grid{ margin-top:18px; }
.also-all{ display:inline-flex; align-items:center; min-height:44px; margin-top:12px; font:700 .9rem/1.3 var(--head); color:var(--ink); text-underline-offset:4px; }
.also-all:hover{ color:var(--teal); }
.card-foot .btn{ padding:11px 18px; font-size:.85rem; }
.card-links{ display:flex; flex-direction:column; margin-top:8px; }
.card-link{ align-self:flex-start; display:inline-flex; align-items:center; min-height:44px; font-size:.92rem; line-height:1.3; text-underline-offset:3px; color:var(--ink); }
.card-link:hover{ color:var(--teal); }

/* coming soon rows */
.soon-list{ list-style:none; margin:20px 0 0; padding:0; display:flex; flex-direction:column; gap:12px; }
.soon-row{ display:flex; align-items:center; justify-content:space-between; gap:20px; background:var(--card); border:1px solid var(--line); border-left:5px solid var(--neutral); border-radius:16px; padding:16px 22px; }
.soon-main{ min-width:0; }
.soon-head{ display:flex; align-items:baseline; gap:12px; flex-wrap:wrap; }
.soon-title{ font-weight:700; font-size:1.05rem; margin:0; }
.soon-region{ font:italic 500 .9rem/1.4 var(--serif); color:var(--muted); }
.soon-blurb{ margin:6px 0 0; font-size:.92rem; color:var(--muted); max-width:84ch; }
.soon-flag{ flex:0 0 auto; font:700 .72rem/1 var(--head); letter-spacing:.14em; text-transform:uppercase; color:var(--btnink); background:var(--neutral); padding:6px 10px; border-radius:999px; white-space:nowrap; }

/* photographs strip */
.strip{ display:flex; align-items:center; justify-content:space-between; gap:24px; margin-top:20px; background:var(--card); border:1px solid var(--line); border-radius:16px; padding:22px 28px; box-shadow:var(--shadow); }
.strip-text{ margin:0; font-size:1rem; max-width:62ch; }
.strip .btn{ flex:0 0 auto; }

/* who makes these */
.maker{ margin:clamp(40px,6vw,64px) 0 clamp(40px,6vw,64px); padding-top:18px; border-top:3px solid var(--teal); max-width:52em; }
.maker p{ margin:10px 0 0; color:var(--muted); }

/* footer */
.foot{ border-top:1px solid var(--line); background:var(--bg2); padding:26px 0 34px; color:var(--muted); font-size:.85rem; }
.foot .wrap{ display:flex; flex-direction:column; gap:14px; }
.foot-row{ display:flex; justify-content:space-between; align-items:baseline; gap:10px 24px; flex-wrap:wrap; }
.foot-word{ font:800 1rem/1 var(--head); letter-spacing:.12em; text-transform:uppercase; color:var(--ink); }
.foot-word span{ display:block; margin-top:6px; text-transform:none; letter-spacing:0; font:italic 500 .85rem/1.3 var(--serif); color:var(--muted); }
.foot-meta{ font:600 .72rem/1.4 var(--head); letter-spacing:.12em; text-transform:uppercase; }
.foot-nav{ display:flex; gap:18px; flex-wrap:wrap; font:700 .75rem/1 var(--head); letter-spacing:.14em; text-transform:uppercase; }
.foot-nav a{ text-decoration:none; color:var(--ink); }
.foot-nav a:hover{ color:var(--teal); }
.foot-fam, .foot-disc{ margin:0; line-height:1.55; max-width:82ch; }
.foot-fam a{ color:var(--ink); text-underline-offset:3px; }

/* simple content page (contact) */
.page{ padding:clamp(40px,7vw,88px) 0; max-width:40em; }
.page-title{ font-weight:800; font-size:clamp(2rem,4.4vw,3rem); line-height:1.1; margin:.5rem 0 1rem; }
.page-text{ font-size:1.05rem; color:var(--muted); margin:0 0 1.4rem; }
.page-mail{ font:700 1.2rem/1.3 var(--head); color:var(--teal) !important; text-underline-offset:4px; word-break:break-word; }
.page-note{ font-size:.92rem; color:var(--muted); margin:1.2rem 0 0; }

@media (max-width:900px){
  .hero-grid{ grid-template-columns:1fr; }
  .hero .fan{ max-width:520px; width:100%; margin-inline:auto; }
  .grid--books{ grid-template-columns:1fr; }
  .card--book{ display:grid; grid-template-columns:34% 1fr; column-gap:18px; }
  .card--book .card-cv{ width:100%; margin:0 0 14px; grid-row:span 1; }
  .card--book .card-foot, .card--book .card-links{ grid-column:1 / -1; }
}
@media (max-width:640px){
  .top-tag{ display:none; }
  .bundle{ grid-template-columns:1fr; text-align:center; }
  .fan--mini{ margin-inline:auto; }
  .cta .btn{ width:100%; }
  .legs{ font-size:.7rem; }
  .grid--maps{ grid-template-columns:1fr; }
  .mny-nav{ gap:6px 10px; padding:10px 12px; font-size:.68rem; letter-spacing:.12em; }
  .soon-row{ flex-direction:column; align-items:flex-start; gap:8px; }
  .strip{ flex-direction:column; align-items:flex-start; padding:20px; }
  .strip .btn{ width:100%; }
}
@media (prefers-reduced-motion:reduce){
  html{ scroll-behavior:auto; }
  .btn{ transition:none; }
  .btn:hover{ transform:none; }
}
`;
