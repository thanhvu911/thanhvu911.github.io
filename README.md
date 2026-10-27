# Thanh Vu · Portfolio

Personal portfolio built with [Astro](https://astro.build) and Tailwind CSS. Static, fast, and deployed to GitHub Pages.

## Run it locally

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # production build into dist/
```

## Where to edit things

| What | File |
|---|---|
| Name, tagline, bio, projects, experience, skills, certifications | `src/data/portfolio.ts` |
| Project images | `src/assets/projects/<project-slug>/` (then list them in the project's `images` in `portfolio.ts`) |
| Hero photo | `src/assets/photo/thanh-hero.jpg` (square, shown in a circle) |
| Resume downloads | `public/thanh-vu-resume-data-engineer.pdf`, `public/thanh-vu-resume-data-analyst.pdf` |
| Social share image | `public/og.png` (1200×630) |
| Colors and font | `src/styles/global.css` (`@theme` block) |

The contact form opens the visitor's email app with the message filled in, since GitHub Pages has no server to send email.

## Deploy to GitHub Pages

1. Push this folder to the `thanhvu911.github.io` repository (this replaces what is there now), or to any repo.
2. In the repo: **Settings → Pages → Source: GitHub Actions**.
3. Every push to `main` builds and publishes via `.github/workflows/deploy.yml`.

If you deploy to a repo other than `thanhvu911.github.io`, add `base: '/<repo-name>'` in `astro.config.mjs`.
