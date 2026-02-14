# Rättslig granskning av kommentarer i appen

Granskning genomförd från ett rättsligt perspektiv. Inget saknas; nedan sammanfattas vad som finns och vad som lagts till.

---

## Befintliga kommentarer (App.js)

| Kommentar | Rättslig bedömning |
|-----------|--------------------|
| "Din logga: byt till require('./assets/...')" | Neutral, ingen rättslig påverkan. |
| "Inledande laddningsskärm: visa minst SPLASH_MIN_MS..." | Teknisk, ok. |
| "Läs om vi redan frågat om betyg (AsyncStorage)" | Bra – tydliggör att betyg-status lagras lokalt. |
| "Visa betygsprompt efter N genereringar..." | Ok. |
| "Clipboard may be unavailable (e.g. permission)" | Teknisk, ok. |
| "fetch or reload failed; user stays on current version" | Teknisk, ok. |
| "Design: tokens + PALETTE..." | Ingen rättslig relevans. |

Ingen av dessa kommentarer ger löften, garantier eller ställningstaganden som strider mot Privacy Policy eller Terms.

---

## Befintliga kommentarer (src/constants.js)

| Kommentar | Rättslig bedömning |
|-----------|--------------------|
| "Single source of truth..." | Ok. |
| "Visa betygsprompt efter N genereringar" | Ok. |
| Övriga inline-kommentarer (fördröjning, Copied!, splash) | Tekniska, ok. |

**Tillagt:** I filhuvudet och vid relevanta nycklar har lagts till korta rättsliga förtydliganden:

- **LEGAL_BASE_URL** ska peka på publicerade Privacy & Terms (app-legal-docs).
- **STORAGE_KEY_ASKED_REVIEW** används endast lokalt (AsyncStorage); ingen data skickas.

Det stämmer med uttalandena i Privacy Policy (ingen datainsamling, endast lokal lagring).

---

## Befintliga kommentarer (App.js – Privacy/Terms)

**Tillagt:**

- Kommentar ovanför `openPrivacy`: att funktionen öppnar den **officiella Privacy Policy** (app-legal-docs).
- Kommentar ovanför `openTerms`: att funktionen öppnar de **officiella Terms of Service** (app-legal-docs).

Det understryker att användaren får de juridiska dokument som gäller för appen.

---

## src/utils.js och src/excuses.js

- **utils.js:** Endast JSDoc för `pickRandom`. Ingen rättslig relevans.
- **excuses.js:** Inga kommentarer; endast data (ursäktslistan). Inget som behöver justeras ur rättslig synvinkel.

---

## Sammanfattning

- **Inget saknas** ur rättsligt perspektiv: kommentarerna gör inga felaktiga eller missvisande uttalanden och strider inte mot Privacy Policy eller Terms.
- **Tillagt:** Tydligare kommentarer kring att (1) legal URL ska peka på publicerade dokument, (2) att betyg-status lagras endast lokalt och inte skickas, och (3) att Privacy- och Terms-länkarna öppnar de officiella dokumenten.

Om du senare lägger till t.ex. analytics, cookies eller andra datainsamlingar bör både Privacy Policy och relevanta kommentarer i koden uppdateras därefter.
