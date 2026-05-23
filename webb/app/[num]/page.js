import { notFound } from 'next/navigation';
import HomePage from '../page';
import { EXCUSES, EXCUSE_COUNT, CATEGORY_META } from '@/lib/excuses';

const SITE_URL = 'https://excusecaddie.xyz';

function parseNum(value) {
  const n = Number.parseInt(String(value ?? '').trim(), 10);
  if (!Number.isFinite(n) || n < 1 || n > EXCUSE_COUNT) return null;
  return n;
}

function primaryTag(tags) {
  if (!Array.isArray(tags)) return null;
  return tags.find((t) => CATEGORY_META[t]) || null;
}

// Pick `count` sibling excuses for the "More like this" section.
// Always prefers same-tag picks before falling back to other categories,
// so a Body-tagged excuse shows other Body excuses (better thematic
// match for both reader and SEO/internal-linking signal). Deterministic
// per number via modulo rotation so reloads don't shuffle the list
// (better cache hits, less visual jitter).
function pickRelated(currentNum, count = 3) {
  const current = EXCUSES[currentNum - 1];
  const tag = primaryTag(current?.tags);
  const pool = EXCUSES
    .map((e, i) => ({ num: i + 1, text: e.text, tags: e.tags }))
    .filter((e) => e.num !== currentNum);
  const sameTag = tag ? pool.filter((e) => e.tags?.includes(tag)) : [];
  const rest = pool.filter((e) => !sameTag.includes(e));

  const rotate = (arr, n) => {
    if (arr.length === 0) return [];
    const start = (currentNum * 7) % arr.length;
    return [...arr.slice(start), ...arr.slice(0, start)].slice(0, n);
  };

  // Take as many same-tag picks as possible, fill any remainder from rest.
  const picks = sameTag.length >= count
    ? rotate(sameTag, count)
    : [...sameTag, ...rotate(rest, count - sameTag.length)];

  return picks.map(({ num, text }) => ({ num, text }));
}

export function generateStaticParams() {
  return Array.from({ length: EXCUSE_COUNT }, (_, i) => ({ num: String(i + 1) }));
}

export async function generateMetadata({ params }) {
  const { num } = await params;
  const n = parseNum(num);
  if (!n) return {};
  const text = EXCUSES[n - 1].text;
  const title = `"${text}" — Golf Excuse #${n}`;
  const description = `${text} A ready-made golf alibi from Excuse Caddie — ${EXCUSE_COUNT} ironclad excuses for that round.`;
  const url = `${SITE_URL}/${n}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `"${text}"`,
      description: `Golf excuse #${n} of ${EXCUSE_COUNT} — Excuse Caddie`,
      url,
      type: 'article',
      siteName: 'Excuse Caddie',
    },
    twitter: {
      card: 'summary_large_image',
      title: `"${text}"`,
      description: `Golf excuse #${n} of ${EXCUSE_COUNT} — Excuse Caddie`,
    },
  };
}

export default async function ExcuseNumberPage({ params }) {
  const { num } = await params;
  const n = parseNum(num);
  if (!n) notFound();

  const entry = EXCUSES[n - 1];
  const text = entry.text;
  const url = `${SITE_URL}/${n}`;
  const tag = primaryTag(entry.tags);

  const breadcrumbItems = [
    { '@type': 'ListItem', position: 1, name: 'Excuse Caddie', item: SITE_URL },
  ];
  if (tag) {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 2,
      name: CATEGORY_META[tag].headline,
      item: `${SITE_URL}/c/${tag}`,
    });
  }
  breadcrumbItems.push({
    '@type': 'ListItem',
    position: breadcrumbItems.length + 1,
    name: `Excuse #${n}`,
    item: url,
  });

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems,
  };

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: text,
    description: `Golf excuse #${n} of ${EXCUSE_COUNT} — Excuse Caddie`,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    image: `${SITE_URL}/${n}/opengraph-image`,
    articleSection: tag ? CATEGORY_META[tag].label : 'Golf',
    isPartOf: { '@id': `${SITE_URL}/#website` },
    publisher: { '@id': `${SITE_URL}/#org` },
    inLanguage: 'en',
  };

  // Prev / next stay inside [1..EXCUSE_COUNT] — bounce on /N is high
  // (79% per Vercel Analytics) so giving people one more click reduces
  // dead-ends without taking attention away from the Mulligan CTA.
  const prevN = n > 1 ? n - 1 : EXCUSE_COUNT;
  const nextN = n < EXCUSE_COUNT ? n + 1 : 1;
  const related = pickRelated(n);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <HomePage initialPickNumber={n} prevNum={prevN} nextNum={nextN} related={related} />
    </>
  );
}
