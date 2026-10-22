# SDD: GitHub Pages for Shichen

- **Repo:** `01_project/zzz_not_active/shichen`
- **Status:** `implemented`
- **Date:** 2026-10-22
- **Related:** [architecture.md](../architecture.md), [001-3d-shichen-explainer.md](./001-3d-shichen-explainer.md)

## 1. Context / current architecture

Shichen is a single-page Vite + React + React Three Fiber app. `vite.config.ts` has no `base`. There is no Pages workflow. The repo is on `main` at [github.com/noowxela/shichen](https://github.com/noowxela/shichen). Hosting was out of scope in the architecture note.

The portfolio gallery is a separate change. It waits until this site answers at its Pages URL.

## 2. Problem and non-goals

**Problem:** The app has no public URL. GitHub Pages is how the other static Vite apps in this workspace are published.

**Non-goals:**

- Adding the project to the portfolio gallery
- A custom domain
- Changing the clock, the copy, or the data

## 3. Questions asked and answers

| Question | Answer |
| --- | --- |
| What ships first? | This Pages deploy. The portfolio card comes after the live URL works. |

## 4. Proposed approach, pros / cons, rejected alternatives

**Approach:** Set Vite `base` to `/shichen/` only when `GITHUB_ACTIONS` is set. Add `.github/workflows/pages.yml` that runs `npm ci`, `npm run build`, and deploys `dist/` with the Pages actions. Enable Pages with the GitHub Actions source, then push `main`.

**Pros:**

- Local `npm run dev` and `npm run preview` stay at `/`
- Same shape as Hanabi: project site, artifact is `dist/`
- A push to `main` republishes the site

**Cons / risks:**

- Asset paths break if the repo is renamed and `base` is not updated with it
- The first workflow run fails if Pages is not set to GitHub Actions before it deploys

**Rejected alternatives:**

| Alternative | Why not |
| --- | --- |
| Hardcode `base: '/shichen/'` for every command | Local dev would only work under that path |
| Upload a hand-built `dist/` | The workflow republishes on each push to `main` |
| Fold this into the portfolio gallery spec | The user asked for this deploy on its own, before the gallery card |

## 5. Acceptance criteria and verification

- [x] `https://noowxela.github.io/shichen/` returns 200
- [x] The HTML references scripts and styles under `/shichen/assets/`
- [x] The page renders the clock wheel and the Chinese side panel
- [x] `npm run build` still succeeds locally with `base` `/`

Verified 2026-10-22. `curl -sI https://noowxela.github.io/shichen/` is 200, and the HTML loads `/shichen/assets/index-BRyDb7ld.js` and `/shichen/assets/index-C6iygOi4.css`. A local build without `GITHUB_ACTIONS` emits `/assets/...`. In the browser the title is 十二时辰 · 活时钟, the WebGL canvas is 1834×917, and the side panel shows 午时 for 12:21. Choosing 子时 selects that period, releases 跟随现在, and the panel heading becomes 子时 · 夜半 (23:00–01:00).

## 6. Status history

| Date | Status | Note |
| --- | --- | --- |
| 2026-10-22 | approved | User asked to deploy this site before the portfolio card |
| 2026-10-22 | implemented | Pages is live at /shichen/; local build stays at / |
