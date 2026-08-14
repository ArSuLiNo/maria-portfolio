# Maria Dikman — Portfolio

Static one-page portfolio site. No build step, no dependencies.

## Structure

```
index.html      markup + all copy
styles.css      design system and layout
script.js       sticky nav state + reveal on scroll
assets/         images sourced from the original Canva site
```

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8000
```

## Deploy

Any static host works. Drag the folder into Netlify, or:

```bash
npx vercel --prod
```

## Editing content

All copy lives in `index.html`. Case studies follow the same four blocks:
Situation, What I owned, What I did, Outcome. Keep that order — the layout
places the fourth block full width as the accent.

Design tokens (colors, fonts, spacing rhythm) are the CSS custom properties
at the top of `styles.css`.
