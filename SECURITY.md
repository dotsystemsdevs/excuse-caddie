# Security Policy

## Reporting a vulnerability

Please **do not** open a public issue for security-sensitive problems.

Instead, choose one of:

1. Open a [GitHub Security Advisory](https://github.com/dotsystemsdevs/excuse-caddie/security/advisories/new) on this repo.
2. Email `security@dotsystems.dev`.

We aim to acknowledge receipt within 48 hours and ship a fix for critical issues within 7 days.

## Scope

This site is a static-leaning Next.js app on Vercel with a small Redis-backed counter and leaderboard. The pieces that are worth poking at:

- `app/api/*` — rate-limited public endpoints (`/api/generated`, `/api/vote`, `/api/leaderboard`, `/api/sounds`)
- `lib/rate-limit.js` — per-IP throttling
- `lib/redis.js` — Upstash key helpers (counter, leaderboard, vote dedup)

Out of scope: third-party hosts (Vercel, Upstash), social-share targets, freesound.org clips.

## Supported versions

The site is a single-tenant deployment — only `main` is supported. Vulnerabilities in older mobile-app commits (pre-rewrite) won't be patched unless they affect the current web build.
