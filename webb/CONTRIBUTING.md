# Contributing

Thanks for helping. The project's small, the bar's low — open a PR.

## Quick start

```bash
git clone https://github.com/dotsystemsdevs/excuse-caddie.git
cd excuse-caddie
npm install
npm run dev
```

Open `http://localhost:3000`. Redis is optional — without it, the counter shows 0 and votes are stored in-memory for the session.

```bash
npm run build   # production build
npm run lint
```

## What to work on

- **More excuses** — see [`lib/excuses.js`](lib/excuses.js). Open an issue with the `add-excuses` template and list yours, or PR directly.
- **UI polish** — keep it single-screen, no accounts, no tracking, no scroll.
- **Leaderboard / votes** — keep them fast and resilient when Redis is offline.
- **Distribution** — anything that makes a shared link more clickable (better OG images, dynamic share-cards, localization).

See [`ROADMAP.md`](ROADMAP.md) for the running backlog.

## Adding excuses

The bar:

- **Short.** Ideally under ~60 chars. The card is small and the screenshot ends up on Reddit; long lines die.
- **Specific.** "Bad swing" is weak. "Glove's too tight." is golf.
- **Family-friendly-ish.** Caddie-room snark is fine, slurs are not.
- **One tag.** Pick the closest category from the existing nine in `CATEGORIES`. If none fit, add a category in the same PR.

The order in `lib/excuses.js` doesn't matter — `getExcuseId` hashes the text, and `getExcuseNumber` resolves to the array index, so URLs (`/1`…`/N`) shift if you reorder. Append at the end of the relevant category if you want existing share links to stay stable.

## Style rules

- Keep components in plain JS (no TS yet — this repo is intentionally low-friction).
- Default to writing no comments. Only explain *why* if it's surprising.
- Prefer **boring, readable** UI. No neon, no busy effects.
- Avoid large dependencies unless they clearly pay off.
- Don't add a build step that doesn't run on `npm run dev` out of the box.

## Local environment

Redis is optional. If not configured, the app falls back to safe defaults.

Use `.env.example` → `.env.local` for Upstash credentials. Don't commit `.env*` files; the `.gitignore` already covers them.

## Pull requests

- Branch off `main`.
- One topic per PR — small PRs land faster.
- Run `npm run lint` and `npm run build` before pushing.
- The repo uses GitHub Actions / Vercel previews; your PR will get a preview deploy URL automatically.

## Questions

Open an issue with the `feature` or `bug` template, or just ping the maintainer in a draft PR.
