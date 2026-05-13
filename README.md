# Excuse Caddie

> A quiet alibi service for the modern golfer. Two surfaces, one excuse pool.

[![Version](https://img.shields.io/badge/app-v1.5.0-1F3528?style=for-the-badge)](app/ROADMAP.md)
[![Excuses](https://img.shields.io/badge/excuses-416-E8C547?style=for-the-badge&labelColor=1F3528)](app/src/excuses.js)
[![Website](https://img.shields.io/badge/web-excusecaddie.xyz-1F3528?style=for-the-badge)](https://excusecaddie.xyz)
[![License](https://img.shields.io/badge/license-MIT-1F3528?style=for-the-badge)](LICENSE)

[**📱 App Store**](https://apps.apple.com/us/app/bogey-blamer-golf-excuses/id6759191239) · [**🤖 Google Play**](https://play.google.com/store/apps/details?id=com.dotsystems.appgolfexcuse) · [**🌐 Website**](https://excusecaddie.xyz)

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

| | Status |
|---|---|
| First release on App Store | ✅ v1.3.0 (Feb 2026) |
| First release on Google Play | ✅ v1.3.0 (Feb 2026) |
| 400+ excuses in the pool | ✅ 416 |
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
