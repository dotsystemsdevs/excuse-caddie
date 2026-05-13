# Strategy & Health Check

A managerial view of the Excuse Caddie project — what's in good shape, what's lacking, and what the next 6 months should look like. Updated 2026-05-13.

For the day-to-day backlog see [`app/ROADMAP.md`](app/ROADMAP.md) and [`webb/ROADMAP.md`](webb/ROADMAP.md). This document is the level above that — strategy, not tickets.

---

## Where we are right now

| Surface | Version | Status |
|---|---|---|
| iOS app | 1.5.0 (build 6) | **In Apple review** (submitted 2026-05-13) |
| Android app | 1.5.0 (versionCode 7) | Build pending, not yet on Play Store |
| Website | live | [excusecaddie.xyz](https://excusecaddie.xyz), Next 16 |
| Backend | live | Supabase + Redis (voting, leaderboard, generated counter) |

**Shipped in 1.5.0:** rebrand to Excuse Caddie, sounds on Mulligan, on-device share card (works offline), tighter home layout, 270 excuses, ASO-optimized store listings, new logo, all dependabot advisories cleared.

---

## Project health

### What's in good shape ✅

- **Single excuse pool, two surfaces.** Same 270 excuses power the website and the app. Source of truth lives in both `webb/lib/excuses.js` and `app/src/excuses.js` (mirrored manually for now — see "drift risk" below).
- **No accounts, no ads, no tracking.** The product position is clean. App Privacy declarations match what the code actually does (Device ID for functionality, Product Interaction for analytics, neither linked to identity).
- **Offline-first.** Excuse generation, sound, and share card capture all work without internet. Only the leaderboard ticker needs a network call.
- **Brand consistency.** After the 1.5.0 rename pass, "Excuse Caddie" is the name everywhere except the App Store URL slug (which only updates on the next listing rename in App Store Connect).
- **Repo hygiene.** Root is clean (`app/`, `webb/`, `design/`, `LICENSE`, `README.md`). Design assets are organized. ROADMAPs exist for both surfaces.
- **Security.** Zero dependabot advisories across `app/`, `webb/`, and `app/backend/`.

### What's lacking ⚠️

- **Zero automated tests.** No unit, integration, or smoke tests anywhere. Means every refactor is "hope and click around."
- **CI is just dependabot auto-merge.** No `npm test`, no lint, no typecheck in PRs. Bad code can land on `main` undetected.
- **`App.js` is a 1074-line monolith.** Components, styles, and logic all in one file. Hard to navigate, easy to introduce regressions during refactors. Should split into `components/` (~6 files) and `screens/Home.js`.
- **Excuse pool drift risk.** `app/src/excuses.js` and `webb/lib/excuses.js` are duplicated by hand. Already drifted twice this version. Should be one shared file consumed by both surfaces (npm workspace, or a generated JSON file).
- **No analytics beyond a row count.** We know how many excuses were generated. We don't know which ones, retention, daily active users, what country, where the funnel breaks. Hard to make product decisions blind.
- **No app review prompt.** The single biggest organic-growth lever for a free app, missing. Queued for 1.5.1.
- **No localization.** English-only. The brand humor translates poorly to non-English markets — needs adaptation, not just translation. Sweden is the obvious first non-EN market.
- **No widget / lockscreen surface.** "Excuse of the day" as a widget would be a daily-touch retention loop. Currently the only way to use the app is to actively open it.
- **Backend is a small black box.** `app/backend/` has minimal docs. If the Redis instance or Supabase project goes down, recovery instructions don't exist in the repo.
- **Store assets are static and English-only.** Six screenshots, no localized variants, no A/B testing.

---

## The plan — next 6 months

### 30 days (now → mid-June 2026)

**Theme: ship what we built, prove the loops work.**

1. **Get 1.5.0 approved on iOS.** Apple review is in flight; usually 24–48 h.
2. **Submit 1.5.0 to Google Play.** Android build + the closed-test-to-production form (answers written, awaiting submission).
3. **Ship 1.5.1 with `expo-store-review`.** Trigger after 5 Mulligan taps. This is the highest-leverage change of the year — a free app with 0 review prompts gets ~10× fewer reviews than one with a well-placed prompt.
4. **Set up basic CI.** GitHub Action that runs `npm install` and `npm run build` on every PR for `webb/`. For `app/` run `npx expo-doctor` and `npx tsc --noEmit` (once we add types) or at minimum a `node -e "require('./src/excuses')"` sanity check.
5. **Add Vercel Analytics or PostHog to the webb.** Free tier, anonymous, lets us see DAU and which excuses get shared.

### 60 days (mid-June → mid-July 2026)

**Theme: don't let the codebase rot.**

6. **Split `App.js`.** Target structure:
   ```
   app/src/
     App.js                (~150 lines, just composition)
     screens/Home.js       (~400 lines)
     components/CTAButton.js
     components/ThumbButton.js
     components/SharePill.js
     components/TopTicker.js
     components/StoryShareCard.js
     components/PaperGrain.js
     components/CountUp.js
   ```
7. **Single source of truth for excuses.** Move `excuses.js` to a root `shared/` folder, symlink or copy via a `prebuild` script so both surfaces consume it. Eliminates the drift bug we hit twice in 1.5.0.
8. **First real tests.** Smoke tests only — does the bundle build, does the API return 200, do the React components render without throwing. Aim for a 30-minute investment, not a coverage chase.
9. **Settings screen in the app.** One toggle: mute the Mulligan sound. (Currently sounds are unconditional; not everyone wants noise.)
10. **Backend runbook.** A two-page doc in `app/backend/README.md` explaining how to recover if Supabase or Upstash dies. Where the env vars live, how to rotate them, how to restore from backup.

### 90 days (mid-July → mid-August 2026)

**Theme: pick the first growth surface.**

Pick **one** of the following based on what 60-day analytics show. Do not do all three.

- **A) Localization (Swedish).** If analytics show meaningful Swedish traffic on the webb, port the 270 excuses to a Swedish variant. Native humor, not Google Translate. Submit to App Store as a separate localization on the same binary.
- **B) Widget.** If retention is the weak metric, ship an iOS WidgetKit + Android Glance widget showing the "excuse of the day." Two new platform surfaces, but high daily-touch.
- **C) Per-category browse in the app.** If session-length is the weak metric, port the webb's `/c/[category]` pages into the app (8 category pills below the card). Lets users self-serve a "more like this" loop.

### 6 months out (Q4 2026)

**Theme: become a small business, not a project.**

- **Watch app.** Tap to roll on the wrist on the tee.
- **Apple Vision / spatial preview.** Niche but listing-eligible.
- **Partnership / sponsored excuse.** "Brought to you by [golf brand]" once per session. The first non-ad monetization path that doesn't poison the experience.
- **iMessage sticker pack** with the top 20 excuses as illustrated stickers.
- **Cross-app deep-link from webb → app.** If someone lands on `excusecaddie.xyz/42` from mobile, prompt to open in the app. Catches the share-loop and increases install conversion.

---

## Out of scope (still)

- User accounts, login, profiles — the no-account vibe is the brand
- Ads or in-app purchases — the app is and stays free
- Subscriptions — same
- Daily push notifications — friction at install (the "Allow notifications" popup) outweighs the retention benefit for a humor app
- Cross-app tracking SDKs — undermines the privacy claim in store listings

---

## How decisions get made

Two principles when adding anything to this list:

1. **Brand fits or it doesn't ship.** The voice is dry, cocky, golf-clubhouse. Any new feature that requires a different voice (notifications, gamified XP bars, onboarding tutorials) usually means the feature is wrong for the product, not that the voice is wrong.
2. **Friction kills humor.** Anything that takes more than one tap to land a punchline is a regression. The Mulligan button → excuse loop is the product. Defend it.
