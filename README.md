# shichen

A single-page Chinese explainer for the twelve *shichen* (时辰). A 3D clock wheel maps each double-hour onto the modern 24-hour clock, and a side panel holds the longer cultural notes.

The wheel follows local time. Drag it to explore another hour, or tap a wedge to open that period. **跟随现在** returns the clock to the current time. 子 sits at the top and straddles midnight (23:00–01:00).

## Run

```bash
npm install
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm test` | Vitest |
| `npm run build` | Typecheck, then production build |
| `npm run preview` | Serve the production build |

## Stack

Vite, React 19, TypeScript, React Three Fiber, and Three.js. There is no backend. The twelve periods live in `src/data/shichen.ts`.

## Layout

| Path | Role |
| --- | --- |
| `src/scene/` | 3D clock wheel |
| `src/ui/` | Chinese HUD and detail panel |
| `src/lib/time.ts` | Hour-to-shichen mapping |
| `src/data/` | Period records and shared notes |
| `docs/` | Architecture and the design note for the clock |
| `shichen.doc`, `shichen.txt` | Topic notes only. The app does not load them. |

Copy in the app is rewritten. It is not a scrape of the outline linked from `shichen.txt`. Cultural TCM notes are not medical advice.
