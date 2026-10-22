# Setup

```bash
npm install
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server at `/` |
| `npm test` | Vitest |
| `npm run build` | Typecheck, then production build into `dist/` |
| `npm run preview` | Serve the production build at `/` |

No env vars are required locally.

GitHub Pages publishes `main` from `.github/workflows/pages.yml`. The live site is [https://noowxela.github.io/shichen/](https://noowxela.github.io/shichen/). On that host, Vite uses `base` `/shichen/`.
