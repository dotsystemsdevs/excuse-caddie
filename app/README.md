<p align="center">
  <img src="assets/logo.png" alt="Excuse Caddie" width="120" height="120" />
</p>

<h1 align="center">Excuse Caddie</h1>

<p align="center">
  <strong>Bad shot? Blame everything but yourself.</strong><br/>
  A golf excuse generator built with React Native.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.5.2-1A1A1A?style=for-the-badge" alt="Version" />
  &nbsp;
  <img src="https://img.shields.io/badge/license-MIT-1A1A1A?style=for-the-badge" alt="License" />
  &nbsp;
  <img src="https://img.shields.io/badge/platform-Android%20%7C%20iOS-1A1A1A?style=for-the-badge&logo=apple&logoColor=white" alt="Platform" />
</p>

---

## Screenshots

<p align="center">
  <img src="screenshots/ios/1.jpg" alt="Generate excuse" width="140" />
  <img src="screenshots/ios/2.jpg" alt="Categories" width="140" />
  <img src="screenshots/ios/3.jpg" alt="Leaderboard" width="140" />
  <img src="screenshots/ios/4.jpg" alt="Submit excuse" width="140" />
  <img src="screenshots/ios/5.jpg" alt="Settings" width="140" />
  <img src="screenshots/ios/6.jpg" alt="Shake to generate" width="140" />
</p>

---

## What It Does

Tap or shake your phone to generate a random golf excuse. Copy it, share it, blame anything but your swing.

- **270+ excuses** across 7 categories (Weather, Equipment, Course, Body, Mental, Blame, Luck)
- **Shake to generate** (just shake your phone for a new excuse)
- **Copy and share** with one tap
- **Per-excuse voting** (anonymous, deduplicated by random device UUID)
- **Global counter** shows total excuses generated across all users
- **Haptic feedback** on every action
- **Weekly local notifications** (opt-in): Thursday 18:00 and Sunday 10:00 with a random alibi
- **In-app rating prompt** after 5 generations (only asked once per install)
- **In-app updates** via Expo Updates
- **Works offline** for excuse generation; vote and counter sync when online
- **Android tablets and foldables**: adaptive layout, scrolls in landscape

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native + Expo SDK 54 (new architecture) |
| Language | JavaScript |
| Storage | AsyncStorage |
| Haptics | Expo Haptics |
| Sensors | Expo Sensors (shake detection) |
| Notifications | Expo Notifications (local only, weekly schedule) |
| Share card | react-native-view-shot (on-device 1080x1350 PNG capture) |
| Backend | Next.js API at excusecaddie.xyz (Supabase + Upstash KV under the hood) |
| Android target | API 36 (Android 16) via expo-build-properties |

No third-party analytics SDK. The only network calls go to our own backend.

---

## Getting Started

```bash
git clone https://github.com/dotsystemsdevs/excuse-caddie.git
cd excuse-caddie/app
npm install
npx expo start
```

```bash
npx expo run:android    # local Android build + install
npx expo run:ios        # local iOS build + install
npx expo start --web    # browser preview
```

**Requirements:** Node.js 18+, Expo CLI. For Android target SDK 36 builds you need Android SDK 36 installed locally or use EAS Build.

---

## Project Structure

```
App.js              Main app component (single file)
src/
  api.js            Backend client (excusecaddie.xyz votes + counter)
  constants.js      Config, palette, spacing, fonts
  excuses.js        270+ excuses with categories and tags
  excuse-ids.js     Stable hash IDs for vote deduplication
  utils.js          pickWeighted, helpers
  sounds.js         Mulligan tap sound playback
  notifications.js  Weekly local notification scheduling
  prefs.js          Local preference storage helpers
assets/             Icons, logo, splash, sound clips
screenshots/        App Store and Play Store screenshots
backend/            Backend schema and setup notes (lives on excusecaddie.xyz)
```

---

## Privacy and Data

**No accounts. No third-party tracking. No ads.**

What the app sends to our backend:
- An anonymous random UUID (generated on first launch, stored locally) is sent with each vote so one device counts as one vote per excuse.
- An anonymous counter bump request (no device ID attached) every time you tap Mulligan, so the global "alibis on the card" counter stays accurate.

What stays on your device:
- The UUID, notification preference, generation count, and rating-prompt timestamp.

What we do not collect:
- Names, emails, accounts, location, ad IDs, contacts, or any cross-app identifiers.

Full details: [Privacy Policy](https://dotsystemsdevs.github.io/app-legal-docs/app-golfexcuse/privacy.html).

---

## Legal

- [Privacy Policy](https://dotsystemsdevs.github.io/app-legal-docs/app-golfexcuse/privacy.html)
- [Terms of Service](https://dotsystemsdevs.github.io/app-legal-docs/app-golfexcuse/terms.html)

## License

MIT
