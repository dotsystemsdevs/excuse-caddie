import { renderExcuseSquare } from '@/lib/og';

export const runtime = 'edge';
export const dynamic = 'force-static';
export const revalidate = 86400;

/**
 * Square 1080×1080 render of a single excuse, used by the mobile
 * app's Share / Instagram buttons. Cached at the edge for a day.
 */
export async function GET(_request, { params }) {
  const { num } = await params;
  const n = Number.parseInt(String(num ?? '').trim(), 10);
  return renderExcuseSquare(n);
}
