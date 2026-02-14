# Legal pages for Golf Excuse Generator (app-golfexcuse)

These files belong in the [app-legal-docs](https://github.com/dotsystemsdevs/app-legal-docs) repo so that Privacy and Terms links in the app work.

## Add to app-legal-docs

1. Open the repo: https://github.com/dotsystemsdevs/app-legal-docs  
2. Create a new folder **`app-golfexcuse`** in the root (same level as `lotty`, `mulligan`, etc.).  
3. Copy **`privacy.html`** and **`terms.html`** from this folder into `app-golfexcuse/`.  
4. Commit and push. GitHub Pages will serve them at:
   - **Privacy**: https://dotsystemsdevs.github.io/app-legal-docs/app-golfexcuse/privacy.html  
   - **Terms**: https://dotsystemsdevs.github.io/app-legal-docs/app-golfexcuse/terms.html  

The Golf Excuse Generator app already points to these URLs via `LEGAL_BASE_URL` in `src/constants.js`.
