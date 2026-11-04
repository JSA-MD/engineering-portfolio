# Jinseong Ahn — Engineering portfolio

An evidence-labeled static portfolio for software architecture and AI systems. Career periods follow the Saramin résumé reviewed on 2026-11-02; commercial technical descriptions are attributed to a separate user-supplied résumé. Historical operating counts and performance figures are labeled with their evidentiary limits.

Live site: https://engineering-portfolio-b9p.pages.dev/

Requirements: Node.js. No install or paid runtime service required.

```sh
npm run build
npm run check
python3 -m http.server 8877 --directory dist
```

Open the local URL after the server starts. Output is in `dist/`. Career periods are maintained in `content/career.json`; project descriptions, outcomes and credited media are in `content/career-projects.json`; detailed case studies are in `content/projects.json`. `scripts/sections.mjs` renders the project-first career and work pages. Run both commands above after changing content, and include only approved material. Local research notes, browser QA artifacts and project-discovery output are ignored and must remain private.

Cloudflare Pages tracks the `main` branch; build command: `npm run build`; output directory: `dist`; `SITE_URL` is the production HTTPS origin. Changes pushed to `main` trigger a new build.

The design switch offers Overview, Modern and Classic layouts; the separate theme button controls light/dark colors. Both preferences are stored only in the visitor's browser and apply across pages. Overview and light are the defaults when no preference has been saved. Existing saved style choices are preserved.

To add a design, append a unique lowercase `id`, English `name`, and Korean `nameKo` to `content/design-styles.json`, then add its visual rules under `html[data-style=your-id]` in `assets/site.css` (including both light and dark color modes). Keep existing style IDs and rules to preserve visitors' saved choices. The build generates the switch and supports persistence for every registered style; run `npm run build` and `npm run check`, then verify both color modes and mobile scrolling.
