'use client';

const GITHUB_URL = 'https://github.com/dotsystemsdevs/excuse-caddie';
const BMC_URL = 'https://buymeacoffee.com/dotdevs';
const APP_STORE_URL = 'https://apps.apple.com/us/app/bogey-blamer-golf-excuses/id6759191239';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.dotsystems.appgolfexcuse';

export default function Footer() {
  return (
    <footer
      className="relative z-10 w-full flex-shrink-0 px-5 py-3 sm:py-3.5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-x-5 text-[11px] sm:text-[12px] text-white/85 font-semibold"
      style={{ paddingBottom: 'max(0.85rem, env(safe-area-inset-bottom, 0px))' }}
    >
      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
        aria-label="Download on the App Store"
      >
        <AppleIcon />
        <span>App Store</span>
      </a>
      <span className="opacity-40" aria-hidden>·</span>
      <a
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
        aria-label="Get it on Google Play"
      >
        <PlayIcon />
        <span>Google Play</span>
      </a>
      <span className="opacity-40" aria-hidden>·</span>
      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
        aria-label="Source code on GitHub"
      >
        <GitHubIcon />
        <span>GitHub</span>
      </a>
      <span className="opacity-40" aria-hidden>·</span>
      <a
        href={BMC_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 hover:opacity-80 transition-opacity"
        style={{ color: 'var(--color-yellow)' }}
        aria-label="Tip the caddie via Buy Me a Coffee"
      >
        <CoffeeIcon />
        <span>Tip the caddie</span>
      </a>
    </footer>
  );
}

function AppleIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.05 20.28c-.98.95-2.05.86-3.08.4-1.09-.47-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M5 3.5v17l13.5-8.5z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function CoffeeIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
      <line x1="6" y1="2" x2="6" y2="4" />
      <line x1="10" y1="2" x2="10" y2="4" />
      <line x1="14" y1="2" x2="14" y2="4" />
    </svg>
  );
}
