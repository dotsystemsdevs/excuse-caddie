import { EXCUSE_COUNT, CATEGORY_KEYS } from '@/lib/excuses';

const SITE_URL = 'https://excusecaddie.xyz';

// W3C date format (YYYY-MM-DD) is what Google's sitemap parser actually
// prefers. ISO 8601 with milliseconds (`2026-05-23T08:21:42.249Z`) gets
// fetched fine but Google's discovery step often reports "0 pages" on it.
// Strings are also stable across requests (no `new Date()` per call).
const TODAY = new Date().toISOString().slice(0, 10);

// Excuses, category pages, and structural pages rarely change at the
// per-URL level. Pinning them to a stable historical date avoids
// "everything updated today" noise and lets Google deprioritize crawl.
const CONTENT_STABLE_DATE = '2026-05-01';

export default function sitemap() {
  const home = {
    url: `${SITE_URL}/`,
    lastModified: TODAY,
    changeFrequency: 'daily',
    priority: 1.0,
  };

  const faq = {
    url: `${SITE_URL}/faq`,
    lastModified: CONTENT_STABLE_DATE,
    changeFrequency: 'monthly',
    priority: 0.9,
  };

  const press = {
    url: `${SITE_URL}/press`,
    lastModified: CONTENT_STABLE_DATE,
    changeFrequency: 'monthly',
    priority: 0.4,
  };

  const categoryPages = CATEGORY_KEYS.map((key) => ({
    url: `${SITE_URL}/c/${key}`,
    lastModified: CONTENT_STABLE_DATE,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const excusePages = Array.from({ length: EXCUSE_COUNT }, (_, i) => ({
    url: `${SITE_URL}/${i + 1}`,
    lastModified: CONTENT_STABLE_DATE,
    changeFrequency: 'yearly',
    priority: 0.7,
  }));

  return [home, faq, press, ...categoryPages, ...excusePages];
}
