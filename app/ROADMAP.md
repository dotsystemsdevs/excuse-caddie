# App Roadmap

Loose backlog for the Excuse Caddie native app (`app/`). The website roadmap lives in [`../webb/ROADMAP.md`](../webb/ROADMAP.md). Nothing here is committed — open an issue or PR to push something forward.

**Current version:** `1.5.0` (build 6 / versionCode 7)
**Version source of truth:** [`app.json`](app.json) (`expo.version`, `ios.buildNumber`, `android.versionCode`) and [`package.json`](package.json).

---

## Recently shipped (1.5.0)

- Renamed from "Bogey Blamer" to **Excuse Caddie: Golf Alibis** across app, App Store, and Play Store listings
- New logo + app icon (flattened on fairway-green for App Store)
- Sound on every Mulligan tap (10 bundled clips, picks one at random)
- On-device share card capture (`react-native-view-shot`) — replaces the old web-hosted PNG fetch, so sharing now works fully offline
- Tightened home layout — logo + wordmark anchored near the top, less floating vertical air
- Single Share button replaces the per-app share pills
- Two new excuses added (now 416 total)
- App Store + Play Store listings rewritten with ASO-optimized copy

## Next up (1.5.1)

| Item | Why | Notes |
|------|-----|-------|
| In-app review prompt | 10x more reviews than organic asks | Use `expo-store-review`. Trigger after ~5 Mulligan taps. Only once per user (the OS rate-limits). |
| Verify share-card text rendering on Android | The new `react-native-view-shot` capture may render fonts slightly differently across devices | Smoke test on a few real Android phones |
| Audit unused dependencies | `expo-web-browser` and `expo-application` look unused | Light KB savings, cleaner manifest |

## Soon

| Item | Why |
|------|-----|
| Settings screen | One toggle: mute the Mulligan sound. Currently the sound is unconditional. |
| Localization (Swedish) | The webb is English-only — the app could match or test SV first |
| Better empty/error states for the leaderboard ticker | Currently shows "Be the first to vote" — could be more personality |
| Onboarding card on first launch | One-card explainer of shake-to-generate (most-missed feature) |

## Maybe

| Item | Notes |
|------|-------|
| Daily push notification | "Today's alibi is ready" — high-impact but adds permission friction. Skip unless retention metrics demand it. |
| Widget (iOS / Android) | Excuse-of-the-day on the home screen. Cool but extra binary surface to maintain. |
| Apple Watch companion | Tap from the wrist on the tee. Cute, probably overkill. |
| Haptic patterns per excuse category | Different vibration for "Body" vs "Weather" excuses. Tiny moment of delight. |

## Out of scope

- User accounts or auth — the no-account vibe is part of the product
- In-app purchases or subscriptions — the app is and stays free
- Cross-app tracking or analytics SDKs beyond the minimal device-ID + interaction counts already declared in App Privacy
