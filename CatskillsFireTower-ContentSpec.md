# Catskills Fire Tower Challenge — Guide Content Spec (Build Blueprint)

**Product:** MeanderNY field guide #3 (sold on Gumroad, $9).
**Pipeline:** Same as guide #1 — `build_longpath.py` → HTML → Playwright PDF → merge
with map pack → `add_toc_pagenums.py` once → cover images. Adapt data + copy, keep
architecture.
**One-line positioning:** *Not a list of eight towers — the kit that gets you the
patch, efficiently and safely.* The free DEC page already lists the towers; this is
the planner, the honest beta, the offline maps, and the printable log.

---

## ⭐ RESEARCH STANDARD (same bar as always — read first)

Only verified facts. The backbone here is officially published, so use it:

- **Primary sources to verify against:** the DEC Catskills Fire Tower Challenge page
  (per-tower hike directions, rules, dates), NYNJTC official trail maps, the Catskill
  Center / Catskill Fire Tower Project (history, cab-stewardship schedule), and town
  pages for the two new towers.
- **Do NOT state distances, elevation gain, or times from memory or a single blog.**
  Reconcile to DEC's stated directions; where routes vary (Hunter especially), pick a
  named route and give that route's numbers — never an average.
- All the approximate figures in this spec are **starting points flagged VERIFY** —
  confirm each before it goes in as fact.
- Flag anything unconfirmed rather than padding for completeness.
- Unaffiliated with DEC. Companion to the official challenge, not a replacement.

---

## PAGE STRUCTURE (TOC order)

Mirrors guide #1's flow. When you build, update the `orig` list + `GUIDE_PAGES` in
`add_toc_pagenums.py` to match the final page counts, and run that script exactly once.

1. **Cover** — green panel, route/contour motif, title. (cover_thumb 1280×720 + cover_square 600×600.)
2. **01 · What this guide is — and isn't** — companion to the free DEC challenge;
   what you get here that the DEC page doesn't; unaffiliated note.
3. **02 · The Challenge, in plain English** — the rules, the Jan 1–Dec 31 window, how
   to submit (online form or mailed PDF + one photo), the postmark-by-Jan-5 deadline,
   the patch, and the first-1,000-finishers prize. Kills the "am I doing this right" worry.
4. **03 · The eight towers at a glance** — overview map + the summary table (below).
5. **04 · How to read a tower card** — legend for the card fields + the rating keys.
6. **05 · The eight towers** — the heart. One card each, south/east → using the card
   template below. Order them by a deliberate logic (suggest: difficulty ladder, or
   geographic cluster — pick one and state it).
7. **06 · The difficulty ladder** — easiest → hardest, so people sequence smartly.
8. **07 · The logistics planner** — the moat. Drive times between trailheads, natural
   clusters, and 3–4 named itineraries (see below).
9. **08 · Seasonal strategy** — cab-open window, winter road gates/snow, heat & bugs,
   rattlesnake season, mud season.
10. **09 · Navigation, safety & Leave No Trace** — basics + tie-in to the LNT bonus-prize photo.
11. **10 · Your tracking log** — printable passport/log page (complements the DEC form).
12. **11 · Sources & disclaimer** — DEC, NYNJTC, Catskill Center; unaffiliated.
13. **BONUS · The Fire Tower Map Pack** — reuse `build_mappack.py`: NYNJTC/DEC fire-tower
    GeoPDF/map links per tower + the Avenza offline-GPS setup steps.

---

## THE SUMMARY TABLE (page 03)

Columns: Tower · Town/County · Round-trip · Difficulty · Drive-up? · One-line note.
Starting data (ALL flagged **VERIFY** against DEC before publish):

| Tower | Town | RT (approx) | Difficulty | Drive-up | Note |
|---|---|---|---|---|---|
| Upper Esopus | Catskills Visitor Center, Mt Tremper (Ulster) | very short walk | easiest | ~yes | Short walk from the car; the "free" one |
| Red Hill | Denning / Claryville (Ulster) | ~3 mi | moderate (easy) | no | Last staffed Catskill tower; built 1921 |
| Balsam Lake | Hardenburgh (Ulster) | ~6 mi | moderate | no | 360° view; westernmost peak |
| Overlook | Woodstock (Ulster) | ~5 mi | moderate | no | Carriage road past the Mountain House ruins; lot fills |
| Tremper | Shandaken / Phoenicia (Ulster) | ~6 mi | moderate–difficult | no | Rattlesnakes reported; switchback old road |
| Hunter | Hunter (Greene) | route-dependent | hardest | no | Highest; **confirm cab repair after Feb 2026 storm** |
| Mt Utsayantha | Stamford (Delaware) | drive or short hike | easy–moderate | ~yes (seasonal gravel road) | New 2026; 1930s tower, restored 2005 |
| Bramley Mtn | Delhi (Delaware) | ~4 mi | moderate | no | New 2026; reopened May 2025 |

---

## PER-TOWER CARD TEMPLATE (the data dict)

Build each tower as a Python dict near the top of the build script, same as the camp
dicts in `build_longpath.py`. Fields:

```python
{
  "name": "Overlook Mountain Fire Tower",
  "mountain": "Overlook Mountain",
  "town": "Woodstock",
  "county": "Ulster",
  # tower facts (verify w/ Catskill Center)
  "tower_height_ft": None,        # VERIFY
  "built": None,                  # VERIFY (year)
  "restored": None,               # VERIFY
  "tower_history": "",            # 2–3 lines, paraphrased
  # the hike — pick ONE named route, give ITS numbers
  "route_name": "Overlook Spur Trail",
  "trailhead": "Meads Mountain Rd, Woodstock",
  "rt_miles": None,               # VERIFY against DEC directions
  "elev_gain_ft": None,           # VERIFY
  "time_est": "",                 # VERIFY
  "difficulty": "moderate",       # easiest / easy / moderate / mod-difficult / hardest
  "route_variants": "",           # esp. Hunter: Spruceton vs Becker Hollow vs Devil's Path
  # logistics
  "trailhead_gps": "",            # VERIFY (lat,long)
  "parking": "",                  # capacity + "fills early?" + fee? + road surface
  "winter_access": "",            # gated road? unplowed? seasonal closure?
  "cell_water": "",               # cell coverage, water availability
  # experience
  "view": "",                     # what you actually see from the cab
  "cab_access": "",               # interpreter-open days only (see seasonal note)
  "safety_flags": "",             # rattlesnakes / exposure / steepness
  "worth_it": "",                 # honest one-liner: who it's for, when to go
  # links
  "dec_url": "",
  "map_url": "",                  # NYNJTC or DEC GeoPDF
}
```

Card rating keys (define in the legend, page 04):
- **Difficulty:** Easiest · Easy · Moderate · Mod–Difficult · Hardest.
- **Drive-up flag:** ● full hike / ◑ short walk / ○ drive-to-summit option.
- **Cab status:** open (interpreter days) / climbable-but-cab-locked / closed.

---

## THE LOGISTICS PLANNER (page 07 — this is the moat)

This is what justifies $9 over the free per-tower blogs. Include:

- **Drive-time matrix** between the eight trailheads (VERIFY drive times).
- **Natural clusters:** the original five sit in the central Catskills (Ulster/Greene);
  the two new towers (Bramley, Utsayantha) are a Delaware County pair best done together;
  Upper Esopus is a quick add-on near Phoenicia/Mt Tremper.
- **3–4 named itineraries**, e.g.:
  - *The long single day* — the original cluster knocked out in one big push (cite that
    hikers have chained five in a day, but be honest about the effort).
  - *The relaxed two-weekend plan* — pacing for normal humans / families.
  - *The Delaware County run* — Bramley + Utsayantha as a paired day.
  - *The winter-feasible subset* — which towers are realistically safe/legal to reach in
    snow (VERIFY road gates), which to avoid.

---

## SEASONAL STRATEGY (page 08)

- **Cab-open window:** interpreters open the tower cabs only on weekends + holiday Mondays,
  roughly Memorial Day → Indigenous Peoples' Day (**VERIFY current schedule**). You can
  still climb the stairs off-season, but the cab may be locked — say so plainly.
- **Winter:** gated/unplowed access roads; some trailheads effectively close. VERIFY per tower.
- **Summer:** heat on exposed climbs (Tremper, Overlook), black-fly season, rattlesnake
  activity (Tremper).
- **Mud season / storm damage:** flag the Hunter cab status until repair is confirmed.

---

## VERIFICATION CHECKLIST (do these before publish — the landmines)

- [ ] **Bramley + Utsayantha:** trail length, parking, and whether Utsayantha's gravel
      summit road is seasonally gated. Thinnest data — confirm directly.
- [ ] **Cab-open schedule** (current year dates) from the Catskill Center.
- [ ] **Hunter cab repair status** after the Feb 2026 windstorm damage.
- [ ] **Hunter route choice** — pick Spruceton OR Becker Hollow OR Devil's Path and give
      that route's real numbers; do not blend.
- [ ] **Every distance/elevation/time** reconciled to DEC's posted directions.
- [ ] **All trailhead GPS + parking** confirmed (Overlook lot fills; note overflow reality).
- [ ] **Every external link** fetched and confirmed live (DEC pages shift paths — same as
      the map-pack lesson from guide #1).
- [ ] **Patch submission details + deadline** confirmed for the current challenge year.

---

## BONUS MAP PACK (reuse build_mappack.py)

Same pattern as guide #1's DEC Map Pack: one entry per tower with the NYNJTC or DEC
GeoPDF/map link + Avenza Map Store search name + the offline-GPS setup steps. Button-label
logic unchanged (`.pdf` → "Download GeoPDF"; `/places-to-go/maps/` → "Open map → GeoPDF";
else → "Open DEC page → GeoPDF"). Near-zero marginal effort, real added value.

---

## GUMROAD PUBLISHING (same as guide #1)

- Digital product (not "E-book"), flat **$9**, Discover OFF, sell via your own link.
- Description: hook → what's inside (the planner + log + map pack, not just "8 towers")
  → "works alongside the free DEC challenge" → price anchor → unaffiliated disclaimer.
- Upload Complete → Guide → Map Pack PDFs to one product. Cover + square thumbnail in slots.
- Test purchase after publish. Clean slug, e.g. `catskills-fire-towers`.
- Add the card to the meanderny.com `GUIDES` array (status flips to "available" with the URL).

---

## BUILD REMINDERS (from the scripts)

- f-strings → **double all literal CSS braces `{{ }}`**.
- Fields passing through `html.escape()` use literal unicode chars, not HTML entities.
- After merging guide + map pack, run `add_toc_pagenums.py` **once** (not idempotent).
- Update `add_toc_pagenums.py`'s `orig` list + `GUIDE_PAGES` to the new structure.
- Verify page counts after every rebuild; keep title/footers/metadata consistent on rename.

---

## TIMING NOTE

The challenge runs Jan 1–Dec 31 with completers ramping from First Day Hikes in January
through the summer/fall peak. Launching now (early summer) still catches the bulk of this
year's cohort before the deadline. Don't sit on it past peak season.
