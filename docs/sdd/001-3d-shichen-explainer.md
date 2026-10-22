# SDD: 3D living clock explainer

- **Repo:** `shichen`
- **Status:** `implemented`
- **Date:** 2026-09-10
- **Related:** [architecture.md](../architecture.md), [http://114.xixik.com/shichen/](http://114.xixik.com/shichen/) as topic outline only

## 1. Context / current architecture

The folder held only `shichen.txt` (URL) and a GB2312 HTML dump `shichen.doc`. There was no app, no SDD, and no architecture. The source page is a long encyclopedia of tables; it does not make the twelve-way split of a day feel spatial.

## 2. Problem and non-goals

**Problem:** People bounce off a wall of tables. They need one interaction that answers “what 时辰 is it?” and then lets them walk the other eleven, including nested units and cultural TCM notes.

**Non-goals:**

- Cloning or scraping the xixik HTML
- Bazi / 八字 charts, true solar time, or “when the civil day flips”
- English UI in v1
- A day-cycle world or zodiac-ring as the primary control
- Medical advice or treatment claims

## 3. Questions asked and answers

| Question | Answer |
| --- | --- |
| Main 3D interaction? | Living clock / sundial: 12 wedges, follows real time, drag to rotate, tap a wedge to learn that 时辰 |
| How much of the original page in v1? | Almost the full page: core mapping + nested units + 五行 + 黄帝内经-style 养生/经络 as cultural notes with a “not medical advice” disclaimer |

## 4. Proposed approach, pros / cons, rejected alternatives

**Approach:** Vite + React + R3F clock wheel. Earthly-branch compass layout: 子 at north (top), 卯 east (right), 午 south (bottom), 酉 west (left). Each wedge is two hours (30°). 子 straddles midnight (23:00–01:00). Side panel is HTML. Copy is rewritten; standard 23:00 start for 子, not the 00–02 split that appears in one section of the dump. Fix dump typos (`戊时` → `戌时`, `日映` → `日昳`).

**Pros:**

- The wheel is the 12-way split; “now” is the aha
- Long 养生 text stays readable in HTML
- Midnight mapping is isolated in one tested function

**Cons / risks:**

- 子 wrapping midnight is easy to get wrong
- TCM copy is sensitive — short notes + disclaimer
- Copyright: rewrite, do not paste the dump
- Weak WebGL: twelve text buttons as a fallback

**Rejected alternatives:**

| Alternative | Why not |
| --- | --- |
| Day-cycle 3D world as primary | User chose the clock wheel |
| Zodiac animal ring as primary | Same |
| Recreate xixik layout | Does not teach; copyright |
| Next.js / Notion backend | Single static explainer |

## 5. Acceptance criteria and verification

- [x] On load, highlighted wedge equals the machine’s current 时辰; panel title matches
- [x] All twelve wedges show time range, ancient name, zodiac, wuxing, meridian, 宜忌
- [x] Drag across midnight: 亥 → 子 → 丑 without a wrong sector (strip + `hourToShichen` tests)
- [x] “跟随现在” returns from explore mode to live time
- [x] Wellness block shows the disclaimer
- [x] Narrow viewport: CSS stacks canvas then scrollable panel (`max-width: 860px`)
- [x] Vitest covers midnight, hour boundaries, and the twelve-button HUD
- [x] `npm run build` succeeds. System Chrome headless aborted in this environment, so the 3D canvas was not click-tested here — run `npm run dev` and drag the disc locally.

## 6. Status history

| Date | Status | Note |
| --- | --- | --- |
| 2026-09-10 | draft | Spec written from plan Q&A |
| 2026-09-10 | approved | Plan approval treated as SDD approval |
| 2026-09-10 | implemented | Vite + R3F explainer shipped in-repo |
