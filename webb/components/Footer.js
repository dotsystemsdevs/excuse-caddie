'use client';

const GITHUB_URL = 'https://github.com/dotsystemsdevs/excuse-caddie';
const INSTAGRAM_URL = 'https://www.instagram.com/excusecaddie/';
const TIKTOK_URL = 'https://www.tiktok.com/@excusecaddie';

export default function Footer() {
  return (
    <footer
      className="relative z-10 w-full flex-shrink-0 px-5 py-3 sm:py-3.5 flex items-center justify-center gap-4 sm:gap-5 text-[11px] sm:text-[12px] text-white/85 font-semibold"
      style={{ paddingBottom: 'max(0.85rem, env(safe-area-inset-bottom, 0px))' }}
    >
      <IconLink
        href={GITHUB_URL}
        ariaLabel="Source code on GitHub"
        title="GitHub"
        icon={<GitHubIcon />}
      />
      <IconLink
        href={INSTAGRAM_URL}
        ariaLabel="Follow Excuse Caddie on Instagram"
        title="Instagram"
        icon={<InstagramIcon />}
      />
      <IconLink
        href={TIKTOK_URL}
        ariaLabel="Follow Excuse Caddie on TikTok"
        title="TikTok"
        icon={<TikTokIcon />}
      />
    </footer>
  );
}

function IconLink({ href, ariaLabel, title, icon, color }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      title={title}
      className="inline-flex items-center justify-center w-8 h-8 text-white/70 hover:text-white transition-colors"
      style={color ? { color } : undefined}
    >
      {icon}
    </a>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.94a8.16 8.16 0 0 0 4.77 1.52V7.04a4.85 4.85 0 0 1-1.84-.35z" />
    </svg>
  );
}
