# Store listing — kopiera till Play Store & App Store

Alla texter nedan är klara att kopiera. Klistra in i **Google Play Console** (Store presence → Main store listing) respektive **App Store Connect** (App Information / Product Page).

---

## 1. App name (visningsnamn)

**Gräns:** 30 tecken (båda stores).

```
Golf Excuse Generator
```

**Tecken:** 22

---

## 2. Kort beskrivning (endast Play Store)

**Gräns:** 80 tecken. Används i sök och listning.

```
Random golf excuses in one tap. Copy & share. No account, no ads.
```

**Tecken:** 60

---

## 3. Lång beskrivning (Play Store & App Store)

**Play Store:** max 4000 tecken.
**App Store:** fältet "Description" / "What’s New" — samma text går bra.

Kopiera hela blocket nedan (från "Your bad shot" till "...Terms in the app.").

```
Your bad shot deserves a good excuse.

Golf Excuse Generator gives you 150+ random, funny excuses — one tap. Blame the wind, the rain, the guy three holes over, or the maintenance staff. Perfect for the 19th hole or when you need to explain that triple bogey.

► One-tap random excuse
► Copy to clipboard and share with one tap
► No account, no sign-up, no ads
► Works offline — everything runs on your device
► Simple, fast, and free

Whether you're looking for a quick laugh or the perfect excuse for your foursome, Golf Excuse Generator has you covered. Generate, copy, share — that's it.

Made with care by Dot Systems. No tracking, no personal data collected. See our Privacy Policy and Terms in the app.
```

**Tecken:** ca 680 (mycket under 4000).

---

## 4. Notifikationer (för Play Store / Data safety)

**Uppdaterad 2026-05-22 för 1.5.2.** Appen skickar nu **lokala** weekly notifications (opt-in). Inga push-notifikationer från server.

**När användare får notifikationer:**
Två gånger per vecka om användaren har slagit på det:
- Torsdag 18:00 (lokal tid): "Heading out tomorrow?" med en slumpvald ursäkt.
- Söndag 10:00 (lokal tid): "Today's alibi" med en slumpvald ursäkt.

**Vilka som får notifikationer:**
Endast användare som aktivt slår på "Notifications" i appens footer. Av som default.

**Hur:**
100% lokalt på enheten via `expo-notifications`. Ingen användardata skickas till någon server för notifikationer. Innehållet (ursäkten) väljs slumpmässigt från appens lokala lista vid varje fire.

**Behörigheter Play Store / Data safety:**
- `POST_NOTIFICATIONS` (Android 13+) krävs för att visa notiser.
- Användaren ombeds första gången de slår på toggle.

*(Kopiera ovanstående till Play Console under App content och Data safety. Under Data safety: notifikationsdata samlas inte in eller delas, då allt sker lokalt.)*

---

## 5. "What's new" / Release notes för 1.5.2

**Gräns:** 500 tecken (båda stores). Kopiera in vid release.

```
Two big things in 1.5.2:

Weekly alibis. Optional Thursday and Sunday reminders with a fresh excuse. Off by default, toggle in the footer.

Better tablets and landscape. Layout now adapts properly on Android tablets, foldables, and rotated phones. No more crushed buttons.

Plus the usual: in-app rating prompt, smaller install size, edge-to-edge polish for Android 15 and 16.
```

**Tecken:** ca 380.

---

## Var du klistrar in

| Vad | Play Store | App Store |
|-----|------------|-----------|
| App name | Main store listing → App name | App Information → Name |
| Short description | Main store listing → Short description (80 tecken) | — (finns inte) |
| Long description | Main store listing → Full description | App Information → Description |
| Promotional Text | — | App Store → Promotional Text (170 tecken) |
| Keywords | — | App Store → Keywords (100 tecken) |

---

## Viktigt

- Ändra inte appnamnet ofta — det påverkar sök och igenkänning.
- Kort beskrivning (Play Store) ska vara under 80 tecken; räkna om du redigerar.
- Lång beskrivning kan du uppdatera vid varje release (t.ex. nya funktioner).
