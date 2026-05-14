'use client';

const BMC_URL = 'https://buymeacoffee.com/dotdevs';

export default function TipCorner() {
  return (
    <a
      href={BMC_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Tip the caddie via Buy Me a Coffee"
      title="Keep the caddie going"
      className="fixed top-2.5 right-2.5 sm:top-3 sm:right-3 z-30 inline-flex items-center gap-1.5 sm:gap-2 rounded-full pl-2 pr-2.5 sm:pl-2.5 sm:pr-3 py-1 sm:py-1.5 text-[10px] sm:text-[12px] font-bold shadow-md hover:opacity-90 active:translate-y-[1px] transition-all"
      style={{
        background: 'var(--color-yellow, #E8C547)',
        color: 'var(--color-fairway-deep, #1F3528)',
      }}
    >
      <CoffeeIcon />
      {/* Full label on >= 640px, "Tip" on smaller screens to avoid colliding with the leaderboard ticker */}
      <span className="hidden sm:inline whitespace-nowrap">Keep the caddie going</span>
      <span className="inline sm:hidden">Tip</span>
    </a>
  );
}

function CoffeeIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="sm:w-[14px] sm:h-[14px]">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
      <line x1="6" y1="2" x2="6" y2="4" />
      <line x1="10" y1="2" x2="10" y2="4" />
      <line x1="14" y1="2" x2="14" y2="4" />
    </svg>
  );
}
