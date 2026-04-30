# Excuse Caddie

A quiet alibi service for the modern golfer. Two surfaces, one excuse pool.

## Repo layout

- **[`webb/`](webb/)** — Next.js 15 website live at [excusecaddie.xyz](https://excusecaddie.xyz)
- **[`app/`](app/)** — React Native / Expo phone app (Bogey Blamer / Golf Excuse Generator)

Each folder is its own self-contained project with its own `package.json`, README, and tooling. Run `npm install` and the project's dev command inside whichever one you're working on.

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
