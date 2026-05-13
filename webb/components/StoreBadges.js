'use client';

const APP_STORE_URL = 'https://apps.apple.com/us/app/bogey-blamer-golf-excuses/id6759191239';
const INSTAGRAM_URL = 'https://www.instagram.com/excusecaddie/';

export default function StoreBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
      {/* Live — App Store */}
      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Download on the App Store"
        className="inline-flex items-center gap-2 rounded-xl bg-black px-3.5 py-2 text-white shadow-md hover:opacity-90 transition-opacity"
      >
        <AppleIcon />
        <span className="flex flex-col leading-none text-left">
          <span className="text-[9px] uppercase tracking-wider opacity-80">Download on the</span>
          <span className="text-[14px] font-semibold leading-tight">App Store</span>
        </span>
      </a>

      {/* Coming Soon — Google Play */}
      <span
        aria-label="Coming soon on Google Play"
        className="relative inline-flex items-center gap-2 rounded-xl bg-black/55 px-3.5 py-2 text-white shadow-md cursor-not-allowed select-none"
      >
        <PlayIcon />
        <span className="flex flex-col leading-none text-left">
          <span className="text-[9px] uppercase tracking-wider opacity-80">Coming soon to</span>
          <span className="text-[14px] font-semibold leading-tight">Google Play</span>
        </span>
        <span
          className="absolute -top-1.5 -right-1.5 rounded-full bg-[color:var(--color-yellow)] px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-[#1F3528] shadow"
          aria-hidden
        >
          Soon
        </span>
      </span>

      {/* Instagram */}
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Follow Excuse Caddie on Instagram"
        className="inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-white shadow-md hover:opacity-90 transition-opacity"
        style={{ background: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}
      >
        <InstagramIcon />
        <span className="flex flex-col leading-none text-left">
          <span className="text-[9px] uppercase tracking-wider opacity-90">Follow us on</span>
          <span className="text-[14px] font-semibold leading-tight">Instagram</span>
        </span>
      </a>
    </div>
  );
}

function AppleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.05 20.28c-.98.95-2.05.86-3.08.4-1.09-.47-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M5 3.5v17l13.5-8.5z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
