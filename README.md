# Engineering portfolio — local draft

An evidence-labeled static portfolio for software architecture and AI systems. Career periods follow the Saramin résumé reviewed on 2026-11-02; commercial technical descriptions are attributed to a separate user-supplied résumé. Historical operating counts and performance figures are labeled with their evidentiary limits.

Live site: https://engineering-portfolio-b9p.pages.dev/

Requirements: Node.js. No install or paid runtime service required.

```sh
npm run build
npm run check
python3 -m http.server 8877 --directory dist
```

Open the local URL after the server starts. Output is in `dist/`. Edit `content/projects.json`, `content/career.json` and `assets/` to update approved material. Local research notes, browser QA artifacts and project-discovery output are ignored and must remain private.

Cloudflare Pages tracks the `main` branch; build command: `npm run build`; output directory: `dist`; `SITE_URL` is the production HTTPS origin. Changes pushed to `main` trigger a new build. The sanitized English résumé excludes private contact details.
