import { useEffect } from "react";

/* ============================================================================
   THE ONLY THING YOU EDIT TO ADD A GUIDE
   ----------------------------------------------------------------------------
   Add a guide = add one object to this array. The page maps over it.
   Fields:
     id        unique string (used as the React key)
     title     guide name (shown big on the card cover)
     region    one-line subtitle under the title on the cover
     blurb     one sentence of what's inside (shown in the card body)
     price     number, in dollars (only shown when status === "available")
     status    "available"  -> shows price + "Get the guide" button
               "coming-soon" -> shows a muted "Coming soon" state, no link
     url        the Gumroad product URL (only used when available)
     cover      OPTIONAL image URL. If set, it replaces the rendered green
                panel with your real cover art. Leave null to use the panel.
   ========================================================================== */
const GUIDES = [
  {
    id: "longpath-north",
    title: "Long Path North",
    region: "Schoharie Hills & Helderbergs · Sec 29–35",
    blurb:
      "Seven New York state forests where you can legally pitch a tent — with rated water sources, fire rules in plain English, and a bonus offline DEC map pack.",
    price: 9,
    status: "available",
    url: "https://devlinfoster.gumroad.com/l/longpath-camping",
    cover: null,
  },
  {
    id: "rambles-1863",
    title: "Guide to Rambles from the Catskill Mountain House",
    region: "The Catskills · Written 1863, walked today",
    blurb:
      "The complete 1863 trail guide — reproduced in full — with a then-and-now walking companion and an illustrated four-station map. Free to read.",
    price: 0,
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
    id: "catskills-fire-towers",
    title: "Catskills Fire Tower Challenge",
    region: "Catskill Park · the patch, done right",
    blurb:
      "The completion kit for the DEC's eight-tower challenge — best routes, parking, drive-times between towers, a printable log, and an offline map pack. Built to earn the patch without wasting a Saturday.",
    price: 9,
    status: "available",
    url: "https://devlinfoster.gumroad.com/l/catskills-fire-towers",
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
  {
    id: "catskill-3500-trailless",
    title: "The Trailless 3500s",
    region: "Catskill 3500 Club · the bushwhack peaks",
    blurb:
      "A de-risking kit for the trailless high peaks — GPX tracks, canister approaches, bail-out points, and brutally honest beta on the nettle and the navigation, so you summit and get back out.",
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
   ========================================================================== */
const MAPS = [
  {
    id: "catskill-1879",
    title: "Catskill Mountains, 1879",
    region: "Restored antique survey · drawn 1879",
    blurb:
      "Walton Van Loan's earliest survey — the Catskill Mountain House alone, before the grand hotels multiplied. North & South Lake, Kaaterskill Falls, and the cliff-edge escarpment ledges. Restored in three editions: color, green, and black & white.",
    price: 8,
    status: "available",
    url: "https://devlinfoster.gumroad.com/l/catskill-1879",
    cover: "/thumb_1879_title.png",
    cta: "Get the Map",
  },
  {
    id: "catskill-1882",
    title: "Catskill Mountains, 1882",
    region: "Restored antique survey · drawn 1882",
    blurb:
      "Van Loan's updated map — now adding the brand-new Hotel Kaaterskill and Laurel House. The same Catskill country three years later, with a grand hotel that had just been built. Restored in three editions, fully sourced from the Library of Congress.",
    price: 9,
    status: "available",
    url: "https://devlinfoster.gumroad.com/l/catskill-1882",
    cover: "/thumb_1882_title.png",
    cta: "Get the Map",
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
  if (guide.cover) {
    return (
      <div className={`cover has-img ${guide.status}`}>
        <img src={guide.cover} alt={`${guide.title} cover`} />
        {guide.status === "coming-soon" && <span className="cover-flag">Coming soon</span>}
      </div>
    );
  }
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
    <article className="card" style={{ animationDelay: `${index * 90}ms` }}>
      <GuideCover guide={guide} />
      <div className="card-body">
        <p className="card-blurb">{guide.blurb}</p>
        <div className="card-buy">
          {available ? (
            <>
              <span className="price">
                ${guide.price}
              </span>
              <a className="btn" href={guide.url} target="_blank" rel="noopener noreferrer">
                {guide.cta || "Get the guide"} <span className="arr">→</span>
              </a>
            </>
          ) : (
            <span className="soon">Coming soon</span>
          )}
        </div>
      </div>
    </article>
  );
}

/* --- the page -------------------------------------------------------------- */

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

  return (
    <div className="mny">
      <style>{CSS}</style>

      {/* page-wide faint contour texture */}
      <div className="mny-bg" aria-hidden="true">
        <Topo />
      </div>

      <div className="mny-wrap">
        {/* masthead */}
        <header className="mny-mast">
          <span className="mny-word">MeanderNY</span>
          <span className="mny-tag">A Catskill Meandering Project</span>
        </header>
        <div className="mny-rule" />

        {/* hero */}
        <section className="hero">
          <Topo className="hero-topo" />
          <div className="hero-vig" />
          <RouteMotif className="hero-route" />
          <div className="hero-inner">
            <span className="hero-eyebrow">Field Guides for New York's Outdoors</span>
            <h1>
              Field guides for getting <em>out there</em> in New York.
            </h1>
            <p>
              Carefully researched guides to camping, hiking and meandering New York's
              backcountry — every legal detail, water source, and distance checked against
              official DEC sources before it makes the page.
            </p>
            <div className="hero-meta">
              <span>
                <i className="dot" />Verified, not aggregated
              </span>
              <span>
                <i className="dot" />Companions to the official guides
              </span>
            </div>
          </div>
        </section>

        {/* guides */}
        <div className="sec-head">
          <span className="sec-eyebrow">The Guides</span>
          <span className="sec-line" />
        </div>
        <div className="grid">
          {GUIDES.map((g, i) => (
            <GuideCard key={g.id} guide={g} index={i} />
          ))}
        </div>

        {/* restored antique maps */}
        <div className="sec-head">
          <span className="sec-eyebrow">Restored Antique Maps</span>
          <span className="sec-line" />
        </div>
        <div className="grid">
          {MAPS.map((m, i) => (
            <GuideCard key={m.id} guide={m} index={i} />
          ))}
        </div>

        {/* who makes these */}
        <section className="maker">
          <span className="sec-eyebrow">Who makes these</span>
          <p>
            MeanderNY guides are made by Devlin Foster, a New York hiker who's walked these
            trails. Every legal claim, water source, distance, and coordinate is checked against
            official NYS DEC and NYNJTC sources — never blog aggregators or guesswork. If a fact
            can't be verified, it doesn't go in. These are unofficial companions to the official
            guides, not replacements for them.
          </p>
        </section>

        {/* footer */}
        <footer className="foot">
          <div className="foot-row">
            <span className="foot-word">
              MeanderNY
              <span>The field-guide side of Catskill Meandering</span>
            </span>
            <span className="foot-meta">© 2026 · meanderny.com</span>
          </div>
          <p className="foot-disc">
            Unofficial field guides. Not affiliated with or endorsed by the NYS Department of
            Environmental Conservation, the New York–New Jersey Trail Conference, or Avenza
            Systems. Always confirm current rules, closures, and conditions with official sources
            before you head out.
          </p>
        </footer>
      </div>
    </div>
  );
}

/* --- styles ---------------------------------------------------------------- */

const CSS = `
.mny *{ box-sizing:border-box; }
.mny{
  --green:#33452f; --green2:#445c3c; --gold:#c2872f; --rust:#a8531e;
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
.mny-word{ font-family:'Barlow Condensed',sans-serif; text-transform:uppercase; letter-spacing:0.26em; font-weight:700; font-size:19px; color:var(--green); }
.mny-tag{ font-family:'Barlow Condensed',sans-serif; text-transform:uppercase; letter-spacing:0.16em; font-size:11.5px; color:var(--soft); }
.mny-rule{ height:1px; background:var(--line); }

/* hero */
.hero{ position:relative; margin-top:22px; border-radius:7px; overflow:hidden; background:var(--green); color:var(--paper); }
.hero-topo{ position:absolute; inset:0; width:100%; height:100%; color:var(--paper); opacity:0.15; }
.hero-vig{ position:absolute; inset:0; background:radial-gradient(120% 115% at 24% 26%, rgba(68,92,60,0) 0%, rgba(18,26,16,0.5) 100%); }
.hero-route{ position:absolute; top:30px; right:36px; width:200px; height:58px; opacity:0.92; }
.hero-inner{ position:relative; padding:56px 48px 50px; }
.hero-eyebrow{ font-family:'Barlow Condensed',sans-serif; text-transform:uppercase; letter-spacing:0.3em; font-size:12px; font-weight:600; color:var(--gold); }
.hero h1{ font-weight:700; font-size:46px; line-height:1.06; letter-spacing:-0.015em; margin:18px 0 0; max-width:16ch; }
.hero h1 em{ color:var(--gold); font-style:italic; font-weight:600; }
.hero p{ font-size:17px; color:var(--cream); margin:18px 0 0; max-width:56ch; line-height:1.55; }
.hero-meta{ margin-top:28px; display:flex; gap:26px; flex-wrap:wrap; font-family:'Barlow Condensed',sans-serif; text-transform:uppercase; letter-spacing:0.12em; font-size:12px; color:var(--cream); }
.hero-meta span{ display:inline-flex; align-items:center; gap:9px; }
.dot{ width:6px; height:6px; border-radius:50%; background:var(--gold); display:inline-block; }

/* section header */
.sec-head{ display:flex; align-items:center; gap:16px; margin:56px 0 24px; }
.sec-eyebrow{ font-family:'Barlow Condensed',sans-serif; text-transform:uppercase; letter-spacing:0.2em; font-size:12px; font-weight:600; color:var(--rust); }
.sec-line{ flex:1; height:1px; background:var(--line); }

/* guide grid */
.grid{ display:grid; grid-template-columns:repeat(auto-fill, minmax(300px,1fr)); gap:26px; }
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
.cover-flag{
  position:absolute; top:15px; right:-32px; transform:rotate(45deg);
  background:var(--rust); color:var(--paper);
  font-family:'Barlow Condensed',sans-serif; text-transform:uppercase; letter-spacing:0.12em;
  font-size:10px; font-weight:600; padding:4px 38px; box-shadow:0 2px 6px rgba(0,0,0,0.18);
}

/* card body */
.card-body{ padding:18px 20px 20px; display:flex; flex-direction:column; gap:16px; flex:1; }
.card-blurb{ font-size:14.5px; color:var(--soft); line-height:1.55; margin:0; flex:1; }
.card-buy{ display:flex; align-items:center; justify-content:space-between; gap:12px; }
.price{ font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:23px; color:var(--ink); }
.soon{ font-family:'Barlow Condensed',sans-serif; text-transform:uppercase; letter-spacing:0.14em; font-size:12.5px; font-weight:600; color:var(--rust); }
.btn{
  font-family:'Barlow Condensed',sans-serif; text-transform:uppercase; letter-spacing:0.1em;
  font-size:13px; font-weight:600; background:var(--green); color:var(--paper);
  padding:10px 17px; border-radius:999px; text-decoration:none; white-space:nowrap;
  transition:background .2s ease;
}
.btn:hover{ background:var(--green2); }
.btn .arr{ display:inline-block; transition:transform .2s ease; }
.btn:hover .arr{ transform:translateX(3px); }

/* who makes these */
.maker{ margin-top:58px; background:var(--paper2); border:1px solid var(--line); border-left:4px solid var(--gold); border-radius:7px; padding:26px 30px; }
.maker p{ margin:11px 0 0; font-size:15px; color:var(--ink); line-height:1.62; max-width:74ch; }

/* footer */
.foot{ margin-top:48px; border-top:1px solid var(--line); padding-top:24px; display:flex; flex-direction:column; gap:14px; }
.foot-row{ display:flex; justify-content:space-between; align-items:baseline; gap:16px; flex-wrap:wrap; }
.foot-word{ font-family:'Barlow Condensed',sans-serif; text-transform:uppercase; letter-spacing:0.2em; font-weight:700; font-size:14px; color:var(--green); }
.foot-word span{ display:block; text-transform:none; letter-spacing:0; font-weight:400; font-style:italic; font-size:12.5px; color:var(--soft); font-family:'Lora',serif; margin-top:4px; }
.foot-meta{ font-family:'Barlow Condensed',sans-serif; text-transform:uppercase; letter-spacing:0.14em; font-size:12px; color:var(--soft); }
.foot-disc{ font-size:12px; color:var(--soft); line-height:1.55; max-width:82ch; margin:0; }

@media (max-width:640px){
  .hero-inner{ padding:40px 26px 36px; }
  .hero h1{ font-size:33px; }
  .hero-route{ display:none; }
  .grid{ grid-template-columns:1fr; }
  .mny-mast{ flex-direction:column; gap:2px; }
}
@media (prefers-reduced-motion: reduce){
  .card{ animation:none; opacity:1; transform:none; }
  .btn .arr{ transition:none; }
}
`;
