'use client';

import Link from 'next/link';
import { CATEGORIES } from '@/lib/excuses';

// Show every category except the synthetic "all" — these route to
// /c/<key> pages that already exist and reuse the home column.
const TABS = CATEGORIES.filter((c) => c.key !== 'all');

export default function CategoryRow() {
  return (
    <nav
      aria-label="Browse excuses by category"
      className="relative z-10 w-full px-5 pt-1 pb-2 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-[12px]"
    >
      <span className="opacity-60 mr-1 font-medium tracking-wide uppercase text-[10px]">
        Browse:
      </span>
      {TABS.map((c) => (
        <Link
          key={c.key}
          href={`/c/${c.key}`}
          className="inline-flex items-center px-2 py-0.5 rounded-full text-white/75 hover:text-white hover:bg-white/10 transition-colors font-medium"
        >
          {c.label}
        </Link>
      ))}
    </nav>
  );
}
