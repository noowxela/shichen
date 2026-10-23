# Risks

- The Pages site is served at `/shichen/`. Renaming the GitHub repo without changing the Vite `base` breaks script and style URLs.
- The UI loads Noto Sans SC and Noto Serif SC from Google Fonts. A blocked font request falls back to the browser’s default face.
