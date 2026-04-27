import { notFound } from 'next/navigation';
import HomePage from '../page';
import { EXCUSE_COUNT } from '@/lib/excuses';

export function generateMetadata({ params }) {
  const n = Number.parseInt(params?.num, 10);
  if (!Number.isFinite(n) || n < 1 || n > EXCUSE_COUNT) return {};
  return {
    title: `Excuse #${n} — Excuse Caddie`,
  };
}

export default function ExcuseNumberPage({ params }) {
  const n = Number.parseInt(params?.num, 10);
  if (!Number.isFinite(n) || n < 1 || n > EXCUSE_COUNT) notFound();
  return <HomePage initialPickNumber={n} />;
}
