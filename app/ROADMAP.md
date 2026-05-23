# App Roadmap

Loose backlog for the Excuse Caddie native app (`app/`). The website roadmap lives in [`../webb/ROADMAP.md`](../webb/ROADMAP.md). Nothing here is committed — open an issue or PR to push something forward.

**Current version:** `1.5.2` (build 10 / versionCode 11)
**Version source of truth:** [`app.json`](app.json) (`expo.version`, `ios.buildNumber`, `android.versionCode`) and [`package.json`](package.json).

---

## Recently shipped (1.5.2)

Bundled with 1.5.1 changes (1.5.1 was built but never had a code commit, so the diff covers both).

- **Android 16 large-screen support.** Removed top-level `orientation: portrait` lock (iOS still locked to portrait on iPhone via `infoPlist`). `<View>` body wrapped in `<ScrollView>` with `flexGrow: 1` so portrait keeps the CTA pinned to the bottom while landscape and tablet sizes get scroll headroom instead of crushed content. New `$.mainCompact` style trims padding when `useWindowDimensions().height < 500`.
- **Edge-to-edge fix for Android 15+.** Added `expo-build-properties` plugin with `compileSdkVersion: 36`, `targetSdkVersion: 36`, `buildToolsVersion: "36.0.0"` so the app opts into Android 16 and the edge-to-edge deprecated-API warning in Play Console clears.
- **Weekly notifications.** Two scheduled per week: Thursday 18:00 (pre-weekend prep) and Sunday 10:00 (peak golf day). Picks a random excuse and rotates titles. Off by default; opt-in via the "Notifications" toggle in the footer. Local only, no server roundtrip.
- **In-app review prompt.** Uses `expo-store-review` after 5 Mulligan taps. Only asked once per install; the OS rate-limits beyond that.
- **Cleanup.** Removed unused `expo-web-browser` dep + plugin, removed dead `expo-file-system` import, removed unused `SCREEN_W` constant.

## Recently shipped (1.5.0)

- Renamed from "Bogey Blamer" to **Excuse Caddie: Golf Alibis** across app, App Store, and Play Store listings
- New logo + app icon (flattened on fairway-green for App Store)
- Sound on every Mulligan tap (10 bundled clips, picks one at random)
- On-device share card capture (`react-native-view-shot`) — replaces the old web-hosted PNG fetch, so sharing now works fully offline
- Tightened home layout — logo + wordmark anchored near the top, less floating vertical air
- Single Share button replaces the per-app share pills
- Two new excuses added (now 270 total)
- App Store + Play Store listings rewritten with ASO-optimized copy

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
