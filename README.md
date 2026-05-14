# Excuse Caddie

> A quiet alibi service for the modern golfer. One excuse pool, two surfaces.

**Live at [excusecaddie.xyz](https://excusecaddie.xyz)**

[![Version](https://img.shields.io/badge/app-v1.5.0-1F3528?style=for-the-badge)](app/ROADMAP.md)
[![Excuses](https://img.shields.io/badge/excuses-270-E8C547?style=for-the-badge&labelColor=1F3528)](app/src/excuses.js)
[![Generated](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fexcusecaddie.xyz%2Fapi%2Fgenerated&query=%24.total&label=served&color=E8C547&labelColor=1F3528&style=for-the-badge&suffix=%20alibis)](https://excusecaddie.xyz)
[![License](https://img.shields.io/badge/license-MIT-1F3528?style=for-the-badge)](LICENSE)

<p>
  <a href="https://apps.apple.com/us/app/bogey-blamer-golf-excuses/id6759191239">
    <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="Download on the App Store" height="48" />
  </a>
  &nbsp;
  <img src="https://img.shields.io/badge/Coming%20Soon-Google%20Play-1F3528?style=for-the-badge&logo=googleplay&logoColor=E8C547" alt="Coming soon to Google Play" height="48" />
  &nbsp;
  <a href="https://www.instagram.com/excusecaddie/">
    <img src="https://img.shields.io/badge/instagram-E1306C?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram @excusecaddie" height="48" />
  </a>
  &nbsp;
  <a href="https://www.tiktok.com/@excusecaddie">
    <img src="https://img.shields.io/badge/tiktok-000000?style=for-the-badge&logo=tiktok&logoColor=white" alt="TikTok @excusecaddie" height="48" />
  </a>
</p>

---

## Screenshots

<p align="center">
  <img src="design/store-screenshots/Group%20189.png" width="155" alt="Played like garbage today?" />
  <img src="design/store-screenshots/Group%20190.png" width="155" alt="We've got 400 excuses ready." />
  <img src="design/store-screenshots/Group%20192.png" width="155" alt="One tap. New alibi." />
  <img src="design/store-screenshots/Group%20193.png" width="155" alt="Or just shake the phone." />
  <img src="design/store-screenshots/Group%20196.png" width="155" alt="Shank club — group chat." />
  <img src="design/store-screenshots/Group%20195.png" width="155" alt="No witnesses." />
</p>

---

## Milestones

| Milestone | Status |
|---|---|
| Live on the App Store | Shipped v1.3.0 (Feb 2026), v1.5.0 in review |
| Live on Google Play | Build submitted, awaiting first approval |
| Live website at [excusecaddie.xyz](https://excusecaddie.xyz) | Shipped |
| [Instagram](https://www.instagram.com/excusecaddie/) and [TikTok](https://www.tiktok.com/@excusecaddie) | Live |
| Alibis served (live counter) | [![Generated](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fexcusecaddie.xyz%2Fapi%2Fgenerated&query=%24.total&label=&color=E8C547&labelColor=1F3528&style=flat-square)](https://excusecaddie.xyz) |
| 270 hand-written excuses | Shipped |
| Offline-first share cards | Shipped v1.5.0 |
| In-app review prompt | Planned for v1.5.1 |
| Settings screen (sound toggle) | Planned for v1.6 |
| Swedish localization | Backlog |
| iOS / Android widget | Backlog |

For the 6-month plan see [`STRATEGY.md`](STRATEGY.md). Per-surface backlogs in [`app/ROADMAP.md`](app/ROADMAP.md) and [`webb/ROADMAP.md`](webb/ROADMAP.md).

---

## Repo layout

- [`webb/`](webb/) — Next.js 16 website live at [excusecaddie.xyz](https://excusecaddie.xyz)
- [`app/`](app/) — React Native / Expo app (Excuse Caddie: Golf Alibis)
- [`design/`](design/) — Source logo, App Store / Play Store screenshots, references
- [`STRATEGY.md`](STRATEGY.md) — Health check, 30/60/90-day plan, 6-month outlook

Each project folder is self-contained — own `package.json`, README, and tooling.

## Run the website

```bash
cd webb
npm install
npm run dev
```

See [`webb/README.md`](webb/README.md).

## Run the app

```bash
cd app
npm install
npx expo start
```

See [`app/README.md`](app/README.md).

## Press

Press kit, boilerplate, and contact: [excusecaddie.xyz/press](https://excusecaddie.xyz/press).

## License

[MIT](LICENSE) — both surfaces.
