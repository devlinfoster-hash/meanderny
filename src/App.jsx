import { useEffect } from "react";

/* Contact address — defined once, reused for the mailto link. */
const CONTACT_EMAIL = "hello@mohawkvalleyalmanac.com";
const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  "MeanderNY correction"
)}`;

/* The Long Path North Gumroad listing — reused by the card and the hero CTA. */
const LONGPATH_NORTH_URL = "https://devlinfoster.gumroad.com/l/long-path-north";

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
   THE ONLY THING YOU EDIT TO ADD A GUIDE
   ----------------------------------------------------------------------------
   Add a guide = add one object to this array. The page maps over it.
   Available guides render as cards (in array order); coming-soon guides render
   as compact rows in the "Coming soon" section (also in array order).
   Fields:
     id        unique string (used as the React key)
     title     guide name (shown big on the card cover)
     region    one-line subtitle under the title on the cover
     blurb     one sentence of what's inside (shown in the card body)
     note      OPTIONAL small line under the blurb (e.g. edition / date checked)
     price     number, in dollars (only shown when status === "available")
     status    "available"  -> shows price + "Get the guide" button
               "coming-soon" -> listed as a compact row, no link
     url        the Gumroad product URL (only used when available)
     cover      OPTIONAL full-bleed image URL for the card header tile.
     coverImage OPTIONAL { src, srcSet, alt } portrait book cover shown on the
                right of the dark header tile (title/subtitle stay on the left).
     links      OPTIONAL array of { label, url } secondary links under the buy row
   ========================================================================== */
const GUIDES = [
  {
    id: "longpath-north",
    title: "Long Path North",
    region: "Schoharie Hills & Helderbergs · Sec 29–35",
    blurb:
      "Seven New York state forests where you can legally pitch a tent, with rated water sources, day-by-day itineraries, resupply stops, fire rules in plain English, and a bonus offline DEC map pack.",
    note: "First Edition · checked through September 2026",
    price: 11.99,
    status: "available",
    url: LONGPATH_NORTH_URL,
    cover: null,
    coverImage: {
      src: "/long-path-north-cover-400.jpg",
      srcSet:
        "/long-path-north-cover-400.jpg 1x, /long-path-north-cover-800.jpg 2x",
      alt: "Cover of Free & Legal Backcountry Camping North of the Catskills",
    },
    links: [
      {
        label: "Free companion page (Mohawk Valley Almanac)",
        url: "https://www.mohawkvalleyalmanac.com/backcountry-camping",
      },
    ],
  },
  {
    id: "catskills-fire-towers",
    title: "Catskills Fire Tower Challenge",
    region: "Catskill Park · the patch, done right",
    blurb:
      "The completion kit for the DEC's eight-tower challenge — best routes, parking, drive-times between towers, a printable log, and an offline map pack. Built to earn the patch without wasting a Saturday.",
    price: 11.99,
    status: "available",
    url: "https://devlinfoster.gumroad.com/l/catskills-fire-towers",
    cover: null,
  },
  {
    id: "rambles-1863",
    title: "Guide to Rambles from the Catskill Mountain House",
    region: "The Catskills · Written 1863, walked today",
    blurb:
      "The complete 1863 trail guide — reproduced in full — with a then-and-now walking companion and an illustrated four-station map. Free to read.",
    price: 0,
    priceLabel: "Free download",
    status: "available",
    url: "https://devlinfoster.gumroad.com/l/rambles-1863",
    cover: null,
  },
  {
    id: "longpath-catskills",
    title: "Long Path Catskills",
    region: "Catskill Forest Preserve · the southern companion",
    blurb:
      "The southern half of the trail, inside the blue line — legal sites, the lean-to system, and the rules that change the moment you enter the Forest Preserve.",
    price: 9,
    status: "coming-soon",
    url: "",
    cover: null,
  },
  {
    id: "catskill-waterfalls",
    title: "Catskill Waterfalls",
    region: "Catskill Park · find them, reach them, safely",
    blurb:
      "The falls worth chasing — where to actually park, how to reach each one legally, which are family-easy, and which have hurt people. Access and honest safety beta, not a scenery list.",
    price: null,
    status: "coming-soon",
    url: "",
    cover: null,
  },
];

/* ============================================================================
   RESTORED ANTIQUE MAPS
   ----------------------------------------------------------------------------
   Same shape as GUIDES (see above). Each entry is one historical Catskill map,
   carefully restored and offered as a high-resolution download on Gumroad.
   Image fields: cover (URL), coverAlt, coverW/coverH (intrinsic px, to reserve
   space and avoid layout shift).
   ========================================================================== */
const MAPS = [
  {
    id: "catskill-1879",
    title: "Catskill Mountains, 1879",
    region: "Restored antique survey · drawn 1879",
    blurb:
      "Walton Van Loan's earliest survey — the Catskill Mountain House alone, before the grand hotels multiplied. North & South Lake, Kaaterskill Falls, and the cliff-edge escarpment ledges. Restored in three editions: color, green, and black & white.",
    price: 11.99,
    status: "available",
    url: "https://devlinfoster.gumroad.com/l/catskill-1879",
    cover: "/map-1879-card.jpg",
    coverAlt:
      "Detail of Walton Van Loan's 1879 map showing North and South Lakes, the Catskill Mountain House and South Mountain",
    coverW: 1200,
    coverH: 800,
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
    region: "Restored antique survey · drawn 1882",
    blurb:
      "Van Loan's updated map — now adding the brand-new Hotel Kaaterskill and Laurel House. The same Catskill country three years later, with a grand hotel that had just been built. Restored in three editions, fully sourced from the Library of Congress.",
    price: 11.99,
    status: "available",
    url: "https://devlinfoster.gumroad.com/l/catskill-1882",
    domId: "framed-1882",
    cover: "/map-1882-card.jpg",
    coverAlt:
      "Detail of Walton Van Loan's 1882 map showing North and South Lakes, Kaaterskill Mountain and the escarpment",
    coverW: 1200,
    coverH: 800,
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

/* --- reusable brand artwork ------------------------------------------------ */

function Topo({ className }) {
  // faint contour-line texture; color is set via CSS `color` (currentColor)
  return (
    <svg
      className={className}
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.2">
        {Array.from({ length: 12 }).map((_, i) => (
          <path
            key={i}
            d={`M-20,${70 + i * 50} C 180,${20 + i * 50} 360,${150 + i * 50} 560,${
              80 + i * 50
            } S 900,${10 + i * 50} 980,${120 + i * 50}`}
          />
        ))}
      </g>
    </svg>
  );
}

function RouteMotif({ className }) {
  // the wandering trail line with trailhead/summit pins
  return (
    <svg className={className} viewBox="0 0 220 64" aria-hidden="true">
      <polyline
        points="10,52 50,38 86,42 120,18 156,26 210,10"
        fill="none"
        stroke="var(--gold)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="52" r="5.5" fill="var(--rust)" stroke="var(--paper)" strokeWidth="1.8" />
      <circle cx="50" cy="38" r="4.4" fill="var(--green2)" stroke="var(--paper)" strokeWidth="1.6" />
      <circle cx="86" cy="42" r="4.4" fill="var(--green2)" stroke="var(--paper)" strokeWidth="1.6" />
      <circle cx="120" cy="18" r="4.4" fill="var(--green2)" stroke="var(--paper)" strokeWidth="1.6" />
      <circle cx="156" cy="26" r="4.4" fill="var(--green2)" stroke="var(--paper)" strokeWidth="1.6" />
      <circle cx="210" cy="10" r="5.5" fill="var(--gold)" stroke="var(--paper)" strokeWidth="1.8" />
    </svg>
  );
}

function GuideCover({ guide }) {
  // Book-cover tile: dark panel with title/subtitle on the left and the real
  // portrait cover (with a soft shadow) on the right.
  if (guide.coverImage) {
    return (
      <div className={`cover cover--book ${guide.status}`}>
        <Topo className="cover-topo" />
        <div className="cover-vig" />
        <div className="cover-inner cover-inner--book">
          <span className="cover-eyebrow">MeanderNY Field Guide</span>
          <h3 className="cover-title">{guide.title}</h3>
          <span className="cover-region">{guide.region}</span>
        </div>
        <img
          className="cover-book"
          src={guide.coverImage.src}
          srcSet={guide.coverImage.srcSet}
          sizes="190px"
          width="119"
          height="190"
          loading="lazy"
          alt={guide.coverImage.alt}
        />
        {guide.status === "coming-soon" && <span className="cover-flag">Coming soon</span>}
      </div>
    );
  }
  // Full-bleed photo tile (restored maps).
  if (guide.cover) {
    return (
      <div className={`cover has-img ${guide.status}`}>
        <img
          src={guide.cover}
          alt={guide.coverAlt || `${guide.title} cover`}
          width={guide.coverW}
          height={guide.coverH}
          loading="lazy"
        />
        {guide.status === "coming-soon" && <span className="cover-flag">Coming soon</span>}
      </div>
    );
  }
  // Rendered panel with the route line-graph (guides without cover art yet).
  return (
    <div className={`cover ${guide.status}`}>
      <Topo className="cover-topo" />
      <div className="cover-vig" />
      <div className="cover-inner">
        <span className="cover-eyebrow">MeanderNY Field Guide</span>
        <RouteMotif className="cover-route" />
        <h3 className="cover-title">{guide.title}</h3>
        <span className="cover-region">{guide.region}</span>
      </div>
      {guide.status === "coming-soon" && <span className="cover-flag">Coming soon</span>}
    </div>
  );
}

function GuideCard({ guide, index }) {
  const available = guide.status === "available";
  return (
    <article id={guide.domId} className="card" style={{ animationDelay: `${index * 90}ms` }}>
      <GuideCover guide={guide} />
      <div className="card-body">
        <p className="card-blurb">{guide.blurb}</p>
        {guide.note && <p className="card-note">{guide.note}</p>}
        <div className="card-buy">
          {available ? (
            <>
              <span className={guide.priceLabel ? "price price--label" : "price"}>
                {guide.priceLabel ?? `$${guide.price}`}
              </span>
              <a className="btn" href={guide.url} target="_blank" rel="noopener noreferrer">
                {guide.cta || "Get the guide"} <span className="arr">→</span>
              </a>
            </>
          ) : (
            <span className="soon">Coming soon</span>
          )}
        </div>
        {available && guide.links && guide.links.length > 0 && (
          <div className="card-links">
            {guide.links.map((link) => (
              <a
                key={link.url}
                className="card-link"
                href={link.url}
                target="_blank"
                rel="noopener"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

/* --- shared chrome --------------------------------------------------------- */

function SiteHeader() {
  return (
    <>
      <header className="mny-mast">
        <a className="mny-word" href="/">
          MeanderNY
        </a>
        <nav className="mny-mast-nav" aria-label="Primary">
          <span className="mny-tag">A Catskill Meandering Project</span>
          <a href="/contact">Contact</a>
        </nav>
      </header>
      <div className="mny-rule" />
    </>
  );
}

function SiteFooter() {
  return (
    <footer className="foot">
      <div className="foot-row">
        <span className="foot-word">
          MeanderNY
          <span>The field-guide side of Catskill Meandering</span>
        </span>
        <span className="foot-meta">© 2026 · meanderny.com</span>
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
        Environmental Conservation, the New York–New Jersey Trail Conference, or Avenza
        Systems. Always confirm current rules, closures, and conditions with official sources
        before you head out.
      </p>
    </footer>
  );
}

/* --- pages ----------------------------------------------------------------- */

function HomeView() {
  const liveGuides = GUIDES.filter((g) => g.status === "available");
  const comingGuides = GUIDES.filter((g) => g.status === "coming-soon");

  return (
    <>
      {/* hero */}
      <section className="hero">
        <Topo className="hero-topo" />
        <div className="hero-vig" />
        <div className="hero-inner">
          <div className="hero-text">
            <span className="hero-eyebrow">Field Guides for New York's Outdoors</span>
            <h1>
              Field guides for getting <em>out there</em> in New York.
            </h1>
            <p>
              Carefully researched guides to camping, hiking and meandering New York's
              backcountry, built on official DEC and NYNJTC sources, with every detail we
              couldn't confirm clearly marked.
            </p>
            <a
              className="btn btn--hero"
              href={LONGPATH_NORTH_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              See the Long Path North guide <span className="arr">→</span>
            </a>
            <div className="hero-meta">
              <span>
                <i className="dot" />Sources shown, unknowns marked
              </span>
              <span>
                <i className="dot" />Companions to the official guides
              </span>
            </div>
          </div>
          <img
            className="hero-cover"
            src="/long-path-north-cover-800.jpg"
            width="800"
            height="1280"
            loading="eager"
            alt=""
            aria-hidden="true"
          />
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

      {/* guides */}
      <div id="guides" className="sec-head">
        <span className="sec-eyebrow">The Guides</span>
        <span className="sec-line" />
      </div>
      <div className="grid">
        {liveGuides.map((g, i) => (
          <GuideCard key={g.id} guide={g} index={i} />
        ))}
      </div>

      {/* coming soon */}
      <section id="coming-soon">
        <div className="sec-head">
          <span className="sec-eyebrow">Coming soon</span>
          <span className="sec-line" />
        </div>
        <ul className="soon-list">
          {comingGuides.map((g) => (
            <li className="soon-row" key={g.id}>
              <div className="soon-main">
                <div className="soon-head">
                  <h3 className="soon-title">{g.title}</h3>
                  <span className="soon-region">{g.region}</span>
                </div>
                <p className="soon-blurb">{g.blurb}</p>
              </div>
              <span className="soon-flag">Coming soon</span>
            </li>
          ))}
        </ul>
      </section>

      {/* restored antique maps */}
      <div id="maps" className="sec-head">
        <span className="sec-eyebrow">Restored Antique Maps</span>
        <span className="sec-line" />
      </div>
      <div className="grid grid--maps">
        {MAPS.map((m, i) => (
          <GuideCard key={m.id} guide={m} index={i} />
        ))}
      </div>

      {/* antique photographs and postcards */}
      <section id="photographs">
        <div className="sec-head">
          <span className="sec-eyebrow">Antique photographs and postcards</span>
          <span className="sec-line" />
        </div>
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
            Visit The Forgotten Press on Etsy <span className="arr">→</span>
          </a>
        </div>
        {/* TODO: thumbnail row — drop a <div className="strip-thumbs"> of 3–5
            postcard/photo <img>s (lazy, with alt text) here once scans are ready. */}
      </section>

      {/* who makes these */}
      <section className="maker">
        <span className="sec-eyebrow">Who makes these</span>
        <p>
          MeanderNY guides are made by Devlin Foster, a New York hiker. Land rules, water,
          distances, and coordinates come from official NYS DEC and NYNJTC sources, plus hiker
          reports and mapping data credited in each guide. When something can't be confirmed,
          the guide says so instead of guessing. These are unofficial companions to the
          official guides, not replacements for them.
        </p>
      </section>
    </>
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
    <section className="page">
      <h1 className="page-title">Contact and corrections</h1>
      <p className="page-text">
        Found a mistake, a business that has closed, or a trail that has changed? Email me.
        Please include the guide, the page or section, and what you saw. Corrections are folded
        into the next edition.
      </p>
      <a className="page-mail" href={CONTACT_MAILTO}>
        {CONTACT_EMAIL}
      </a>
      <p className="page-note">
        This address belongs to the Mohawk Valley Almanac, which hosts the companion page for
        Long Path North.
      </p>
    </section>
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
      link.href =
        "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&display=swap";
      document.head.append(pre1, pre2, link);
    }
  }, []);

  const path = typeof window !== "undefined" ? window.location.pathname : "/";
  const isContact = path === "/contact" || path === "/contact/";

  return (
    <div className="mny">
      <style>{CSS}</style>

      {/* page-wide faint contour texture */}
      <div className="mny-bg" aria-hidden="true">
        <Topo />
      </div>

      <div className="mny-wrap">
        <SiteHeader />
        {isContact ? <ContactView /> : <HomeView />}
        <SiteFooter />
      </div>
    </div>
  );
}

/* --- styles ---------------------------------------------------------------- */

const CSS = `
html{ scroll-behavior:smooth; }
.mny *{ box-sizing:border-box; }
.mny{
  --green:#33452f; --green2:#445c3c; --gold:#c2872f; --rust:#a8531e;
  --copper:#8a4417;
  --paper:#f5efe1; --paper2:#efe7d4; --paper3:#fffdf7;
  --ink:#26211b; --soft:#5d5446; --line:#cdc1a6; --cream:#e6dcc2;
  position:relative; min-height:100vh; background:var(--paper); color:var(--ink);
  font-family:'Lora',Georgia,serif; line-height:1.6; overflow-x:hidden;
  -webkit-font-smoothing:antialiased; text-rendering:optimizeLegibility;
}
.mny-bg{ position:fixed; inset:0; color:var(--line); opacity:0.38; pointer-events:none; z-index:0; }
.mny-bg svg{ width:100%; height:100%; }
.mny-wrap{ position:relative; z-index:1; max-width:1080px; margin:0 auto; padding:0 24px 64px; }

/* masthead */
.mny-mast{ display:flex; align-items:baseline; justify-content:space-between; gap:16px; padding:28px 0 14px; }
.mny-word{ font-family:'Barlow Condensed',sans-serif; text-transform:uppercase; letter-spacing:0.26em; font-weight:700; font-size:19px; color:var(--green); text-decoration:none; }
.mny-tag{ font-family:'Barlow Condensed',sans-serif; text-transform:uppercase; letter-spacing:0.16em; font-size:11.5px; color:var(--soft); }
.mny-mast-nav{ display:flex; align-items:baseline; gap:18px; flex-wrap:wrap; }
.mny-mast-nav a{ font-family:'Barlow Condensed',sans-serif; text-transform:uppercase; letter-spacing:0.16em; font-size:12px; font-weight:600; color:var(--copper); text-decoration:none; transition:color .2s ease; }
.mny-mast-nav a:hover{ color:var(--rust); }
.mny-rule{ height:1px; background:var(--line); }

/* hero */
.hero{ position:relative; margin-top:22px; border-radius:7px; overflow:hidden; background:var(--green); color:var(--paper); }
.hero-topo{ position:absolute; inset:0; width:100%; height:100%; color:var(--paper); opacity:0.15; }
.hero-vig{ position:absolute; inset:0; background:radial-gradient(120% 115% at 24% 26%, rgba(68,92,60,0) 0%, rgba(18,26,16,0.5) 100%); }
.hero-inner{ position:relative; padding:52px 48px 48px; display:flex; align-items:center; gap:44px; }
.hero-text{ flex:1 1 auto; min-width:0; }
.hero-cover{ flex:0 0 auto; width:auto; height:330px; align-self:center; display:block; border-radius:6px; box-shadow:0 22px 46px -18px rgba(0,0,0,0.62), 0 4px 12px rgba(0,0,0,0.3); }
.hero-eyebrow{ font-family:'Barlow Condensed',sans-serif; text-transform:uppercase; letter-spacing:0.3em; font-size:12px; font-weight:600; color:var(--gold); }
.hero h1{ font-weight:700; font-size:46px; line-height:1.06; letter-spacing:-0.015em; margin:18px 0 0; max-width:16ch; }
.hero h1 em{ color:var(--gold); font-style:italic; font-weight:600; }
.hero p{ font-size:17px; color:var(--cream); margin:18px 0 0; max-width:52ch; line-height:1.55; }
.hero-meta{ margin-top:26px; display:flex; gap:26px; flex-wrap:wrap; font-family:'Barlow Condensed',sans-serif; text-transform:uppercase; letter-spacing:0.12em; font-size:12px; color:var(--cream); }
.hero-meta span{ display:inline-flex; align-items:center; gap:9px; }
.dot{ width:6px; height:6px; border-radius:50%; background:var(--gold); display:inline-block; }

/* in-page nav */
.mny-nav{
  position:sticky; top:0; z-index:5;
  display:flex; align-items:center; justify-content:center; gap:16px; flex-wrap:wrap;
  margin-top:18px; padding:13px 0;
  background:rgba(245,239,225,0.94); backdrop-filter:blur(4px);
  border-bottom:1px solid var(--line);
  font-family:'Barlow Condensed',sans-serif; text-transform:uppercase;
  letter-spacing:0.16em; font-size:14px; font-weight:600;
}
.mny-nav a{ color:var(--green); text-decoration:none; padding:4px 2px; transition:color .2s ease; }
.mny-nav a:hover{ color:var(--copper); }
.mny-nav-sep{ color:var(--line); }
#guides, #coming-soon, #maps, #photographs, #framed-1882{ scroll-margin-top:72px; }

/* section header */
.sec-head{ display:flex; align-items:center; gap:16px; margin:56px 0 24px; }
.sec-eyebrow{ font-family:'Barlow Condensed',sans-serif; text-transform:uppercase; letter-spacing:0.2em; font-size:12px; font-weight:600; color:var(--copper); }
.sec-line{ flex:1; height:1px; background:var(--line); }

/* guide grid */
.grid{ display:grid; grid-template-columns:repeat(auto-fill, minmax(300px,1fr)); gap:26px; }
.grid--maps{ grid-template-columns:repeat(2, 1fr); }
.card{
  background:var(--paper3); border:1px solid var(--line); border-radius:7px; overflow:hidden;
  display:flex; flex-direction:column;
  opacity:0; transform:translateY(14px); animation:rise .6s cubic-bezier(.2,.7,.2,1) forwards;
  transition:transform .25s ease, box-shadow .25s ease, border-color .25s ease;
}
.card:hover{ transform:translateY(-5px); box-shadow:0 18px 36px -20px rgba(38,33,27,0.55); border-color:var(--green2); }
@keyframes rise{ to{ opacity:1; transform:translateY(0); } }

/* card cover (rendered panel) */
.cover{ position:relative; aspect-ratio:3/2; background:var(--green); color:var(--paper); overflow:hidden; }
.cover.has-img img{ width:100%; height:100%; object-fit:cover; display:block; }
.cover-topo{ position:absolute; inset:0; width:100%; height:100%; color:var(--paper); opacity:0.15; }
.cover-vig{ position:absolute; inset:0; background:radial-gradient(135% 105% at 50% 24%, rgba(68,92,60,0) 0%, rgba(18,26,16,0.5) 100%); }
.cover-inner{ position:relative; height:100%; padding:22px 22px 20px; display:flex; flex-direction:column; }
.cover-eyebrow{ font-family:'Barlow Condensed',sans-serif; text-transform:uppercase; letter-spacing:0.22em; font-size:9.5px; font-weight:600; color:var(--gold); }
.cover-route{ width:118px; height:34px; margin:10px 0 0; }
.cover-title{ font-weight:700; font-size:25px; line-height:1.06; letter-spacing:-0.01em; margin:auto 0 0; }
.cover-region{ font-style:italic; font-size:12.5px; color:var(--cream); margin-top:7px; }
.cover.coming-soon .cover-vig{ background:linear-gradient(180deg, rgba(38,33,27,0.30), rgba(38,33,27,0.52)); }
/* book-cover variant: text left, portrait cover on the right */
.cover-inner--book{ width:56%; padding-right:6px; }
.cover-book{ position:absolute; top:50%; right:20px; transform:translateY(-50%); height:82%; max-height:190px; width:auto; border-radius:3px; box-shadow:0 12px 24px -8px rgba(0,0,0,0.6), 0 2px 6px rgba(0,0,0,0.35); }
.cover-flag{
  position:absolute; top:15px; right:-32px; transform:rotate(45deg);
  background:var(--rust); color:var(--paper);
  font-family:'Barlow Condensed',sans-serif; text-transform:uppercase; letter-spacing:0.12em;
  font-size:10px; font-weight:600; padding:4px 38px; box-shadow:0 2px 6px rgba(0,0,0,0.18);
}

/* card body */
.card-body{ padding:18px 20px 20px; display:flex; flex-direction:column; gap:16px; flex:1; }
.card-blurb{ font-size:14.5px; color:var(--soft); line-height:1.55; margin:0; }
.card-note{ font-size:12px; font-style:italic; color:var(--soft); margin:-6px 0 0; }
.card-buy{ display:flex; align-items:center; justify-content:space-between; gap:12px; margin-top:auto; }
.price{ font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:23px; color:var(--ink); }
.price--label{ font-size:14px; font-weight:600; line-height:1.3; min-width:0; flex:1 1 auto; }
.soon{ font-family:'Barlow Condensed',sans-serif; text-transform:uppercase; letter-spacing:0.14em; font-size:12.5px; font-weight:600; color:var(--copper); }
.card-links{ display:flex; flex-direction:column; gap:2px; margin:2px 0 0; }
.card-link{ align-self:flex-start; display:inline-flex; align-items:center; min-height:44px; font-size:15px; line-height:1.3; color:var(--copper); text-decoration:underline; text-underline-offset:2px; transition:color .2s ease; }
.card-link:hover{ color:var(--rust); }
.btn{
  display:inline-block;
  font-family:'Barlow Condensed',sans-serif; text-transform:uppercase; letter-spacing:0.1em;
  font-size:13px; font-weight:600; background:var(--green); color:var(--paper);
  padding:10px 17px; border-radius:999px; text-decoration:none; white-space:nowrap;
  transition:background .2s ease;
}
.btn:hover{ background:var(--green2); }
.btn .arr{ display:inline-block; transition:transform .2s ease; }
.btn:hover .arr{ transform:translateX(3px); }
.btn--hero{ margin-top:24px; background:var(--gold); color:var(--ink); font-size:14px; padding:12px 22px; }
.btn--hero:hover{ background:#b07a28; }

/* coming soon rows */
.soon-list{ list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:12px; }
.soon-row{ display:flex; align-items:center; justify-content:space-between; gap:20px; background:var(--paper3); border:1px solid var(--line); border-left:3px solid var(--cream); border-radius:7px; padding:16px 22px; }
.soon-main{ min-width:0; }
.soon-head{ display:flex; align-items:baseline; gap:12px; flex-wrap:wrap; }
.soon-title{ font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:20px; letter-spacing:0.01em; color:var(--green); margin:0; }
.soon-region{ font-style:italic; font-size:13px; color:var(--soft); }
.soon-blurb{ margin:6px 0 0; font-size:14px; color:var(--soft); line-height:1.5; max-width:84ch; }
.soon-flag{ flex:0 0 auto; font-family:'Barlow Condensed',sans-serif; text-transform:uppercase; letter-spacing:0.14em; font-size:12px; font-weight:600; color:var(--copper); white-space:nowrap; }

/* photographs strip */
.strip{ display:flex; align-items:center; justify-content:space-between; gap:24px; background:var(--paper2); border:1px solid var(--line); border-left:4px solid var(--gold); border-radius:7px; padding:22px 28px; }
.strip-text{ margin:0; font-size:16px; color:var(--ink); line-height:1.55; max-width:62ch; }
.strip .btn{ flex:0 0 auto; }

/* who makes these */
.maker{ margin-top:58px; background:var(--paper2); border:1px solid var(--line); border-left:4px solid var(--gold); border-radius:7px; padding:26px 30px; }
.maker p{ margin:11px 0 0; font-size:15px; color:var(--ink); line-height:1.62; max-width:74ch; }

/* footer */
.foot{ margin-top:48px; border-top:1px solid var(--line); padding-top:24px; display:flex; flex-direction:column; gap:14px; }
.foot-row{ display:flex; justify-content:space-between; align-items:baseline; gap:16px; flex-wrap:wrap; }
.foot-word{ font-family:'Barlow Condensed',sans-serif; text-transform:uppercase; letter-spacing:0.2em; font-weight:700; font-size:14px; color:var(--green); }
.foot-word span{ display:block; text-transform:none; letter-spacing:0; font-weight:400; font-style:italic; font-size:12.5px; color:var(--soft); font-family:'Lora',serif; margin-top:4px; }
.foot-meta{ font-family:'Barlow Condensed',sans-serif; text-transform:uppercase; letter-spacing:0.14em; font-size:12px; color:var(--soft); }
.foot-nav{ display:flex; gap:18px; flex-wrap:wrap; font-family:'Barlow Condensed',sans-serif; text-transform:uppercase; letter-spacing:0.14em; font-size:12px; font-weight:600; }
.foot-nav a{ color:var(--soft); text-decoration:none; transition:color .2s ease; }
.foot-nav a:hover{ color:var(--copper); }
.foot-fam{ font-size:12.5px; color:var(--soft); line-height:1.55; margin:0; }
.foot-fam a{ color:var(--copper); text-decoration:underline; text-underline-offset:2px; transition:color .2s ease; }
.foot-fam a:hover{ color:var(--rust); }
.foot-disc{ font-size:12px; color:var(--soft); line-height:1.55; max-width:82ch; margin:0; }

/* simple content page (contact) */
.page{ margin-top:48px; max-width:62ch; }
.page-title{ font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:36px; line-height:1.08; letter-spacing:-0.01em; color:var(--green); margin:0 0 18px; }
.page-text{ font-size:16px; color:var(--ink); line-height:1.62; margin:0 0 24px; }
.page-mail{ font-family:'Barlow Condensed',sans-serif; font-weight:600; font-size:21px; letter-spacing:0.02em; color:var(--copper); text-decoration:underline; text-underline-offset:3px; transition:color .2s ease; }
.page-mail:hover{ color:var(--rust); }
.page-note{ font-size:14px; color:var(--soft); line-height:1.6; margin:18px 0 0; }

@media (max-width:900px){
  .grid--maps{ grid-template-columns:repeat(2, 1fr); }
}
@media (max-width:640px){
  .hero-inner{ padding:22px 20px 24px; flex-direction:column; gap:0; }
  .hero-cover{ display:none; }
  .hero h1{ font-size:29px; margin-top:10px; }
  .hero p{ font-size:15.5px; margin-top:10px; }
  .btn--hero{ margin-top:14px; white-space:normal; }
  .hero-meta{ margin-top:12px; gap:8px 18px; }
  .mny-nav{ margin-top:10px; padding:9px 0; gap:6px 10px; font-size:11.5px; letter-spacing:0.12em; }
  .sec-head{ margin:22px 0 16px; }
  .grid{ grid-template-columns:1fr; }
  .grid--maps{ grid-template-columns:1fr; }
  .mny-mast{ flex-direction:column; gap:2px; }
  .soon-row{ flex-direction:column; align-items:flex-start; gap:8px; }
  .strip{ flex-direction:column; align-items:flex-start; }
  .strip .btn{ white-space:normal; text-align:center; }
}
@media (prefers-reduced-motion: reduce){
  html{ scroll-behavior:auto; }
  .card{ animation:none; opacity:1; transform:none; }
  .btn .arr{ transition:none; }
}
`;
