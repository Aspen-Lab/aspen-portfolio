# aspen-portfolio

Personal portfolio for Aspen W. — Product Designer at Axel (Gordian Software, YC W19).

Built with Next.js 16 (App Router), TypeScript, Tailwind 4, and Motion (formerly Framer Motion). Deployed to Vercel.

## Stack

- **Framework**: Next.js 16 · React 19 · TypeScript
- **Styling**: Tailwind CSS 4 (CSS-first theme tokens in `src/app/globals.css`)
- **Motion**: `motion` (v12) via `motion/react`
- **Fonts**: Fraunces (display) + Plus Jakarta Sans (body), via `next/font/google`

## Develop

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## Edit

- **Case studies** live in `src/lib/work.ts`. Add, reorder, or rewrite there — the home grid and `/work/[slug]` route both read from this file.
- **Theme tokens** (colors, fonts, spacing) live in `src/app/globals.css` under `@theme`.
- **Sections**: `Hero`, `SelectedWork`, `About`, `Footer` in `src/components/`.
- **Cover images**: drop into `public/work/<slug>.jpg` and replace the placeholder block in `SelectedWork.tsx` and the case-study page with a `<Image>` component.

## Deploy

Push the repo to GitHub, then on [vercel.com/new](https://vercel.com/new) import the repo. No env vars needed; defaults are correct.

## TODO before going live

- [ ] Set real social URLs in `src/components/Footer.tsx` (currently `#`)
- [ ] Add cover images for each case study
- [ ] Replace placeholder hero text if you want a different angle
- [ ] Add a real domain in `metadataBase` inside `layout.tsx` (for OG)
