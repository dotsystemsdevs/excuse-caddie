import { redirect } from 'next/navigation';
import { EXCUSES, getDailyExcuse } from '@/lib/excuses';

// /today resolves to the same excuse for every visitor on a given day,
// then redirects to the canonical /N page so OG images, meta tags, and
// the breadcrumb schema all match the per-excuse pages — no duplicate
// SEO surface to maintain.
export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Today's Golf Excuse",
  description: "The daily Excuse Caddie ruling — refreshed every 24 hours.",
  robots: { index: false, follow: true },
};

export default function TodayPage() {
  const daily = getDailyExcuse(EXCUSES);
  const num = EXCUSES.findIndex((e) => e.text === daily.text) + 1;
  if (num < 1) redirect('/');
  redirect(`/${num}`);
}
