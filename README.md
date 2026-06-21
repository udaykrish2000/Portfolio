# Uday Krishna — Frontend Developer Portfolio

A production-ready, single-page, fully responsive portfolio. Built with plain HTML5, CSS3, and vanilla JavaScript — no build step, no framework, no dependencies.

## ✨ Highlights

- **Premium visual language** — dark glassmorphic UI, gradient mesh accents (blue → violet → cyan), ambient grid + blob background, cursor spotlight, smooth scroll reveals.
- **ATS-friendly & SEO-ready** — semantic `<header>/<nav>/<section>/<article>/<footer>`, proper heading hierarchy, Open Graph + Twitter meta tags, and a `schema.org/Person` JSON-LD block.
- **Accessible** — skip link, visible focus states, ARIA labels/roles on interactive widgets, keyboard-operable command palette and modal, `prefers-reduced-motion` support.
- **Fully interactive**
  - Animated hero with typing effect, canvas particles, mouse parallax, scroll cue
  - Filterable/searchable project grid with 3D tilt cards and a detail modal
  - Skill cards with category tabs and animated progress bars
  - Scroll-revealed experience timeline
  - Live GitHub repository panel (fetches `api.github.com`, falls back to cached data if offline/rate-limited)
  - Resume section with an animated ATS-score ring and a real downloadable PDF
  - Testimonial carousel, validated contact form (opens a pre-filled email), dark/light theme toggle
  - **Command palette** — press `Ctrl/Cmd + K` to jump to any section or run an action

## 📁 Project structure

```
portfolio/
├── index.html                  # All markup & SEO/schema metadata
├── styles/
│   └── main.css                 # Design tokens, layout, components, animations
├── scripts/
│   └── main.js                  # All interactivity (no dependencies)
├── assets/
│   ├── resume/
│   │   └── uday-krishna-resume.pdf
│   └── icons/
│       ├── favicon.svg
│       └── og-cover.svg
└── README.md
```

## 🔧 Customize it for yourself

1. **Identity** — replace the name, role, summary, and contact links in `index.html` (hero, about, footer, JSON-LD block) and in `meta`/Open Graph tags in `<head>`.
2. **GitHub username** — open `scripts/main.js` and change:
   ```js
   const GITHUB_USERNAME = "udaykrish2000";
   ```
   The repo panel fetches live data client-side; if the request fails (offline, rate-limited, or username unset) it quietly shows cached sample data instead of breaking the layout.
3. **Resume** — edit `build_resume.py`-style content directly, or simply swap in your own file at `assets/resume/uday-krishna-resume.pdf` (keep the same filename, or update the `href` in `index.html`).
4. **Colors / theme** — all colors are CSS variables at the top of `styles/main.css` (`:root` for dark, `[data-theme="light"]` for light). Change the three accent hexes (`--blue`, `--cyan`, `--violet`) to reskin instantly.
5. **Projects, skills, certifications, testimonials** — each is a discrete, repeatable HTML block in `index.html`; duplicate or remove entries as needed. No build step required.

## 🚀 Deploy

This is a static site — drag-and-drop deploy to any static host:

- **Vercel** — `vercel deploy` from this folder, or import the repo in the dashboard.
- **Netlify** — drag the folder into the Netlify dashboard, or `netlify deploy`.
- **GitHub Pages** — push to a repo and enable Pages on the `main` branch root.

No environment variables, no build command, no server required.

## ♿ Performance & accessibility notes

- Fonts are loaded from Google Fonts with `preconnect`; swap to self-hosted `woff2` files for full control over caching and an even higher Lighthouse score.
- All animation respects `prefers-reduced-motion: reduce`.
- The custom cursor and particle canvas are automatically disabled on touch devices.
- Contact form validates client-side and opens the visitor's email client with a pre-filled message — no backend or form service required. Swap in a form provider (e.g. Formspree, a serverless function) if you'd like submissions captured server-side.
