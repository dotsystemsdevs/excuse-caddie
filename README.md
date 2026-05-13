# Excuse Caddie

> A quiet alibi service for the modern golfer. Two surfaces, one excuse pool.

[![Version](https://img.shields.io/badge/app-v1.5.0-1F3528?style=for-the-badge)](app/ROADMAP.md)
[![Excuses](https://img.shields.io/badge/excuses-270-E8C547?style=for-the-badge&labelColor=1F3528)](app/src/excuses.js)
[![Generated](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fexcusecaddie.xyz%2Fapi%2Fgenerated&query=%24.total&label=generated&color=E8C547&labelColor=1F3528&style=for-the-badge&suffix=%20alibis)](https://excusecaddie.xyz)
[![Website](https://img.shields.io/badge/web-excusecaddie.xyz-1F3528?style=for-the-badge)](https://excusecaddie.xyz)
[![License](https://img.shields.io/badge/license-MIT-1F3528?style=for-the-badge)](LICENSE)

<p>
  <a href="https://apps.apple.com/us/app/bogey-blamer-golf-excuses/id6759191239">
    <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="Download on the App Store" height="50" />
  </a>
  &nbsp;&nbsp;
  <img src="https://img.shields.io/badge/Coming%20Soon-Google%20Play-1F3528?style=for-the-badge&logo=googleplay&logoColor=E8C547" alt="Coming soon to Google Play" height="50" />
  &nbsp;&nbsp;
  <a href="https://www.instagram.com/excusecaddie/">
    <img src="https://img.shields.io/badge/%40excusecaddie-E1306C?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram @excusecaddie" height="50" />
  </a>
</p>

---

## Screenshots

<p align="center">
  <img src="design/store-screenshots/Group%20189.png" width="160" alt="Played like garbage today?" />
  <img src="design/store-screenshots/Group%20190.png" width="160" alt="We've got 400 excuses ready." />
  <img src="design/store-screenshots/Group%20192.png" width="160" alt="One tap. New alibi." />
  <img src="design/store-screenshots/Group%20193.png" width="160" alt="Or just shake the phone." />
  <img src="design/store-screenshots/Group%20196.png" width="160" alt="Shank club — group chat." />
  <img src="design/store-screenshots/Group%20195.png" width="160" alt="No witnesses." />
</p>

---

## Milestones

| Milestone | Status |
|---|---|
| 🍎 **[Live on the App Store](https://apps.apple.com/us/app/bogey-blamer-golf-excuses/id6759191239)** | ✅ since v1.3.0 (Feb 2026) |
| 🤖 **Live on Google Play** | ⏳ submitted, awaiting first approval |
| 📷 **[Instagram @excusecaddie](https://www.instagram.com/excusecaddie/)** | ✅ live |
| 🌐 **[Website excusecaddie.xyz](https://excusecaddie.xyz)** | ✅ live |
| Alibis generated (live counter) | [![Generated](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fexcusecaddie.xyz%2Fapi%2Fgenerated&query=%24.total&label=&color=E8C547&labelColor=1F3528&style=flat-square&suffix=%20served)](https://excusecaddie.xyz) |
| 250+ excuses in the pool | ✅ 270 |
| Offline-first share cards | ✅ v1.5.0 (May 2026) |
| Rebrand to **Excuse Caddie: Golf Alibis** | ✅ v1.5.0 |
| In-app review prompt | ⏳ planned for v1.5.1 |
| Settings screen (sound toggle) | ⏳ planned for v1.6 |
| Swedish localization | 📌 backlog |
| iOS / Android widget | 📌 backlog |

For the full 6-month plan see [`STRATEGY.md`](STRATEGY.md). Per-surface backlogs live in [`app/ROADMAP.md`](app/ROADMAP.md) and [`webb/ROADMAP.md`](webb/ROADMAP.md).

---

## Repo layout

- **[`webb/`](webb/)** — Next.js 16 website live at [excusecaddie.xyz](https://excusecaddie.xyz)
- **[`app/`](app/)** — React Native / Expo phone app (Excuse Caddie: Golf Alibis)
- **[`design/`](design/)** — Source logo, App Store / Play Store screenshots, and design references (not shipped)
- **[`STRATEGY.md`](STRATEGY.md)** — Managerial view: health check, 30/60/90-day plan, 6-month outlook

Each project folder is self-contained with its own `package.json`, README, and tooling. Run `npm install` and the project's dev command inside whichever one you're working on.

## Web (`webb/`)

```bash
cd webb
npm install
npm run dev
```

See [`webb/README.md`](webb/README.md) for the full story.

## App (`app/`)

```bash
cd app
npm install
npx expo start
```

See [`app/README.md`](app/README.md) for the full story.

## License

[MIT](LICENSE) — both surfaces.
