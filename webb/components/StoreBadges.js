'use client';

const APP_STORE_URL = 'https://apps.apple.com/us/app/bogey-blamer-golf-excuses/id6759191239';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.dotsystems.appgolfexcuse';

export default function StoreBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {/* Apple — official "Download on the App Store" SVG */}
      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Download on the App Store"
        className="inline-block transition-opacity hover:opacity-85"
      >
        <img
          src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
          alt="Download on the App Store"
          style={{ height: '48px', width: 'auto', display: 'block' }}
        />
      </a>

      {/* Google Play — custom pill built to match Apple's badge proportions */}
      <a
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Get it on Google Play"
        className="inline-flex items-center gap-2 rounded-[8px] bg-black text-white transition-opacity hover:opacity-85 px-3.5"
        style={{ height: '48px' }}
      >
        <GooglePlayIcon />
        <span className="flex flex-col leading-none text-left">
          <span className="text-[8.5px] uppercase tracking-[0.04em]">Get it on</span>
          <span className="text-[16px] font-semibold leading-tight tracking-tight">Google Play</span>
        </span>
      </a>
    </div>
  );
}

// Multi-colored Google Play triangle (matches the official brand mark).
// Solid color version (`<PlayIcon>`) was off-brand; this one matches what
// Google ships in their official badge.
function GooglePlayIcon() {
  return (
    <svg width="20" height="22" viewBox="0 0 60 67" aria-hidden>
      <path d="M.5 1.5C-.1 2.2 0 3.4 0 4.7v57.6c0 1.3-.1 2.5.5 3.2L31.4 34 .5 1.5z" fill="#00C2D7"/>
      <path d="M41.7 23.9L31.4 34 .5 1.5C1.1.8 2.2.8 3.5 1.5l38.2 22.4z" fill="#00E676"/>
      <path d="M41.7 44.1L3.5 66.5c-1.3.7-2.4.7-3 0L31.4 34l10.3 10.1z" fill="#FF3D00"/>
      <path d="M58 30c2 1.2 2 4 0 5.2l-16.3 9.5L31.4 34l10.3-10.1L58 30z" fill="#FFC400"/>
    </svg>
  );
}
