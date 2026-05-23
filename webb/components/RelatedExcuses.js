import Link from 'next/link';

// Server component. Renders three sibling excuses as deep links so that
// visitors landing on /N from search get a second click without having
// to scroll back to the Mulligan CTA. Picks from the current excuse's
// category when available, falls back to random across the full list.
export default function RelatedExcuses({ excuses }) {
  if (!excuses || excuses.length === 0) return null;

  return (
    <section
      aria-labelledby="related-h"
      className="relative z-10 w-full px-5 pt-2 pb-1"
    >
      <h2
        id="related-h"
        className="text-center text-[10px] font-semibold tracking-[0.18em] uppercase opacity-60 mb-2"
      >
        More like this
      </h2>
      <ul className="flex flex-col gap-2 max-w-xl mx-auto">
        {excuses.map((e) => (
          <li key={e.num}>
            <Link
              href={`/${e.num}`}
              className="block rounded-xl bg-white/[0.06] hover:bg-white/[0.10] transition-colors px-4 py-3 border border-white/[0.06] hover:border-white/[0.12]"
            >
              <span className="block text-[11px] font-semibold tracking-wide uppercase opacity-50 mb-0.5 tabular-nums">
                #{e.num}
              </span>
              <span className="block text-[14px] sm:text-[15px] font-medium leading-snug">
                {e.text}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
