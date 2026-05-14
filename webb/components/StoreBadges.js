'use client';

const APP_STORE_URL = 'https://apps.apple.com/us/app/bogey-blamer-golf-excuses/id6759191239';

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
      <span
        aria-label="Coming soon to Google Play"
        className="relative inline-flex items-center gap-2 rounded-[10px] bg-black px-4 text-white cursor-not-allowed select-none"
        style={{ height: '48px', opacity: 0.85 }}
      >
        <PlayIcon />
        <span className="flex flex-col leading-none text-left">
          <span className="text-[9px] uppercase tracking-wider opacity-75">Coming soon to</span>
          <span className="text-[15px] font-semibold leading-tight">Google Play</span>
        </span>
        <span
          aria-hidden
          className="absolute -top-1.5 -right-1.5 rounded-full px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider shadow"
          style={{ background: 'var(--color-yellow, #E8C547)', color: '#1F3528' }}
        >
          Soon
        </span>
      </span>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M5 3.5v17l13.5-8.5z" />
    </svg>
  );
}
