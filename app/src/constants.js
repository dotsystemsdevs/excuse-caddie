/**
 * App configuration and design tokens.
 */

export const CONFIG = {
  REVIEW_PROMPT_EVERY_N: 5,
  STORAGE_KEY_ASKED_REVIEW: 'app_golfexcuse_asked_review',
  LEGAL_BASE_URL: 'https://dotsystemsdevs.github.io/app-legal-docs/app-golfexcuse',
  PLAY_STORE_URL: 'https://play.google.com/store/apps/details?id=com.dotsystems.appgolfexcuse',
  APP_STORE_URL: 'https://apps.apple.com/us/app/bogey-blamer-golf-excuses/id6759191239',
  GENERATE_DELAY_MS: 1100,
  COPY_RESET_MS: 1800,
  SPLASH_MIN_MS: 1000,
  SHAKE_THRESHOLD: 2.5,
  SHAKE_COOLDOWN_MS: 1500,
  SHAKE_INTERVAL_MS: 150,
};

export const LOADING_MESSAGES = [
  'Consulting the caddie…',
  'Checking the rulebook…',
  'One moment…',
  'Preparing your excuse…',
  'Almost there…',
  'Drawing a new card…',
];

export const FONT = { xs: 11, sm: 12, caption: 13, label: 14, body: 16, bodyLg: 18, title: 22, hero: 28 };

export const PALETTE = {
  homeBg: '#3D6B52',
  greenPale: '#DAE6DD',
  accent: '#D4A373',
  greenDark: '#2E4F3E',
  cardTop: '#5A8E70',
  cardMid: '#45785E',
  cardBot: '#3A6350',
  activeGreen: '#19C66D',
};
