# Design

Source files and references for the Excuse Caddie app's visual identity and store listings. Nothing here is shipped — these are working files for the App Store / Play Store submissions.

## Folders

- **`logo-source/`** — Master logo file (`loggany.png`, 1024×1024 PNG). The variants in [`app/assets/`](../app/assets/) (icon, adaptive-icon, splash-icon, logo) are derived from this.
- **`store-screenshots/`** — Phone screenshot assets uploaded to the App Store and Google Play. 9:16 portrait. Figma exports from the screenshot-design session.
- **`references/`** — Raw reference images, mockups, and design iterations used during the screenshot copy/layout work.

## Updating the logo

If `loggany.png` changes, re-flatten it onto the fairway-green background (`#508560`) for the iOS app icon (App Store rejects transparency) and copy to:

- `app/assets/icon.png` — flattened on `#508560`
- `app/assets/adaptive-icon.png` — transparent OK (Android composites)
- `app/assets/splash-icon.png` — transparent OK
- `app/assets/logo.png` — transparent OK (used inside the app)
