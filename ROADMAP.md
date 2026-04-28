# Roadmap

A loose backlog. Nothing here is committed — open an issue or PR if you want to push something forward.

The mobile-app roadmap from before the Next.js rewrite has been retired; that history lives in the git log if you want to dig.

---

## Recently shipped

- Per-excuse URLs (`/1` … `/268`) so a shared link survives the trip across Reddit, X, iMessage
- Dynamic 1200×630 OG images per excuse via `next/og`
- Reddit share button (Reddit was already the top referrer)
- Web Share API on mobile with clipboard fallback
- Sitemap (269 URLs) + robots.txt
- JSON-LD `WebSite` / `WebApplication` / `Organization` for brand recognition

## Now

| Item | Why | Status |
|------|-----|--------|
| Reach 300 excuses | Crowd-sourced excuse list is the moat | open ([#issue](https://github.com/dotsystemsdevs/excuse-caddie/issues)) |
| Per-category browse pages (`/weather`, `/equipment`, …) | More indexable surface for organic SEO | idea |

## Soon

| Item | Why |
|------|-----|
| "Excuse of the day" fixed page | Stable URL for daily share habit |
| Server-rendered share fallback | The share buttons currently populate the URL only after JS hydrates |
| Localization (Swedish first) | Bigger reach |
| Light/dark theme toggle | Polish |

## Maybe

| Item | Notes |
|------|-------|
| Generate a shareable PNG card with the chosen excuse on it | More striking on mobile than a link preview |
| `/api/random.json` | A tiny public API so other golf apps can pull excuses |
| `vote_excuse` decay so the leaderboard reflects recent rounds | Avoid stale top-20 |
| Optional haptics on mobile generate | Tiny moment of delight |

## Out of scope

- Native mobile apps (we shipped one, retired it; the web app does the job)
- User accounts or auth — the no-account vibe is part of the product
- Tracking beyond anonymous Vercel Analytics events

---

## Priority guide

| Level | Meaning |
|-------|---------|
| **P1** | Critical — fix before next deploy |
| **P2** | Important — current sprint |
| **P3** | Nice to have — future backlog |

If you want to claim something here, open an issue and say so before opening the PR — saves people stepping on each other.
