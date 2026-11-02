# Engineering portfolio — local draft

An evidence-labeled static portfolio for architecture and AI systems. The user's designated technical résumé supports commercial descriptions; the Saramin résumé is the sole authority for employment periods and was reviewed after user login on 2026-11-02. This draft is not cleared for public deployment.

Requirements: Node.js. No install or paid runtime service required.

```sh
npm run build
npm run check
python3 -m http.server 8877 --directory dist
```

Open the local URL in Aside after the server starts. This environment denied binding a server, so real HTTP navigation still needs verification. Output is in `dist/`; keep `docs/` internal. Edit `content/projects.json` and `assets/` to update approved material; see `docs/content-update-guide.md`, `docs/evidence-ledger.md`, `docs/qa-report.md` and `docs/publication-review.md`.

Cloudflare Pages output directory: `dist`; build command: `npm run build`. The English résumé is provided as a sanitized PDF. Final review, actual domain configuration, full HTTP browser QA and production deployment remain outstanding. Internal evidence files are deliberately excluded from the public repository.
