import Link from 'next/link';
import { EXCUSE_COUNT } from '@/lib/excuses';

const SITE_URL = 'https://excusecaddie.xyz';
const APP_STORE_URL = 'https://apps.apple.com/us/app/bogey-blamer-golf-excuses/id6759191239';
const REPO_URL = 'https://github.com/dotsystemsdevs/excuse-caddie';
const INSTAGRAM_URL = 'https://www.instagram.com/excusecaddie/';
const TIKTOK_URL = 'https://www.tiktok.com/@excusecaddie';
const CONTACT_EMAIL = 'dot.systems@proton.me';

export const metadata = {
  title: 'Press Kit',
  description: 'Logos, screenshots, copy, and contact info for journalists and bloggers covering Excuse Caddie.',
  alternates: { canonical: `${SITE_URL}/press` },
  openGraph: {
    title: 'Excuse Caddie — Press Kit',
    description: 'Assets and boilerplate for media coverage of the golf-excuse app.',
    url: `${SITE_URL}/press`,
    type: 'website',
  },
};

const SHORT_BLURB = `Excuse Caddie is a one-tap golf excuse generator. ${EXCUSE_COUNT} curated alibis for shanks, three-putts, and blown rounds. Free, offline, no accounts, no ads.`;

const LONG_BLURB = `Excuse Caddie is a humor app for golfers who need an instant alibi after a bad shot. Tap the Mulligan button — or shake the phone — and one of ${EXCUSE_COUNT} hand-written excuses appears, across eight categories (Body, Nerves, Kit, Weather, Course, Distractions, Luck, Swing). Share a screenshot to the group chat, vote on the funniest, and watch the community leaderboard rank the most cocky lines. The app runs fully offline. There are no accounts, no ads, and no tracking beyond anonymous usage counts. Built as a React Native / Expo app for iOS and Android, with a sister website at excusecaddie.xyz that surfaces the same excuse pool for sharing and SEO.`;

const FACTS = [
  ['Name', 'Excuse Caddie (App Store listing: "Excuse Caddie: Golf Alibis")'],
  ['Category', 'Entertainment / Sports / Humor'],
  ['Platforms', 'iOS, Android (coming soon), Web'],
  ['Excuses', `${EXCUSE_COUNT} hand-curated, across 8 categories`],
  ['Pricing', 'Free. No ads, no in-app purchases, no subscription.'],
  ['Privacy', 'No login. No personal data collected. Anonymous device ID for vote dedupe and usage counts only.'],
  ['Tech', 'React Native + Expo (app), Next.js (web), Supabase + Upstash Redis (backend)'],
  ['Maintainer', 'Diana Öhman — Dot Systems'],
  ['Repo', 'github.com/dotsystemsdevs/excuse-caddie (MIT)'],
];

export default function PressPage() {
  return (
    <main
      className="min-h-dvh w-full text-white"
      style={{ background: 'var(--color-fairway)' }}
    >
      <div className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
        <Link
          href="/"
          className="text-[12px] uppercase tracking-wider opacity-70 hover:opacity-100 transition-opacity"
        >
          ← Back to Excuse Caddie
        </Link>

        <h1
          className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight"
          style={{ color: 'var(--color-yellow)' }}
        >
          Press Kit
        </h1>
        <p className="mt-2 opacity-85 leading-relaxed text-[15px]">
          Everything you need to write about Excuse Caddie — logos, screenshots,
          boilerplate copy, and a way to reach a human.
        </p>

        {/* Boilerplate */}
        <Section title="One-liner">
          <Quote>{SHORT_BLURB}</Quote>
        </Section>

        <Section title="Long blurb (~110 words)">
          <Quote>{LONG_BLURB}</Quote>
        </Section>

        {/* Quick facts */}
        <Section title="Quick facts">
          <dl className="divide-y divide-white/10 rounded-xl bg-black/15 border border-white/10">
            {FACTS.map(([k, v]) => (
              <div key={k} className="px-4 py-3 sm:py-3.5 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                <dt className="text-[12px] uppercase tracking-wider opacity-65 sm:w-36 shrink-0">{k}</dt>
                <dd className="text-[14px] sm:text-[15px]">{v}</dd>
              </div>
            ))}
          </dl>
        </Section>

        {/* Assets */}
        <Section title="Assets">
          <p className="opacity-80 text-[14px] mb-3">
            All visual assets live in the open-source repo under{' '}
            <a
              href={`${REPO_URL}/tree/main/design`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:opacity-100"
              style={{ color: 'var(--color-yellow)' }}
            >
              design/
            </a>
            . Three folders:
          </p>
          <ul className="space-y-2 text-[14px] opacity-90">
            <li>
              📐 <strong>logo-source/</strong> — Master logo (1024×1024 PNG)
            </li>
            <li>
              📱 <strong>store-screenshots/</strong> — Six iPhone screenshots, 1290×2796, used in the App Store
            </li>
            <li>
              🖼️ <strong>references/</strong> — Working references and color palette swatches
            </li>
          </ul>
          <p className="opacity-70 text-[12px] mt-3 italic">
            MIT-licensed. Crop, resize, recolor freely. No need to ask.
          </p>
        </Section>

        {/* Links */}
        <Section title="Links">
          <ul className="space-y-2 text-[14px]">
            <LinkItem label="Website" href={SITE_URL}>{SITE_URL.replace('https://', '')}</LinkItem>
            <LinkItem label="App Store" href={APP_STORE_URL}>apps.apple.com/…/id6759191239</LinkItem>
            <LinkItem label="Source code" href={REPO_URL}>{REPO_URL.replace('https://', '')}</LinkItem>
            <LinkItem label="Instagram" href={INSTAGRAM_URL}>@excusecaddie</LinkItem>
            <LinkItem label="TikTok" href={TIKTOK_URL}>@excusecaddie</LinkItem>
          </ul>
        </Section>

        {/* Contact */}
        <Section title="Contact">
          <p className="text-[14px] opacity-90 leading-relaxed">
            For interviews, feature requests, or pre-publication review:{' '}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="underline underline-offset-4"
              style={{ color: 'var(--color-yellow)' }}
            >
              {CONTACT_EMAIL}
            </a>
            . Replies within 48 hours from a single human (Diana).
          </p>
        </Section>

        <footer className="mt-12 pt-6 border-t border-white/10 text-[12px] opacity-60">
          Press kit updated continuously. Latest revision lives at{' '}
          <a href={`${REPO_URL}/blob/main/webb/app/press/page.js`} target="_blank" rel="noopener noreferrer" className="underline">
            webb/app/press/page.js
          </a>
          .
        </footer>
      </div>
    </main>
  );
}

function Section({ title, children }) {
  return (
    <section className="mt-8 sm:mt-10">
      <h2 className="text-[11px] uppercase tracking-[0.18em] font-bold opacity-70 mb-3">{title}</h2>
      {children}
    </section>
  );
}

function Quote({ children }) {
  return (
    <blockquote
      className="rounded-xl border-l-4 px-4 py-3 leading-relaxed text-[15px] opacity-95"
      style={{
        background: 'rgba(0,0,0,0.18)',
        borderColor: 'var(--color-yellow)',
      }}
    >
      {children}
    </blockquote>
  );
}

function LinkItem({ label, href, children }) {
  return (
    <li className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
      <span className="text-[12px] uppercase tracking-wider opacity-65 sm:w-28 shrink-0">{label}</span>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-4 hover:opacity-80 transition-opacity break-all"
      >
        {children}
      </a>
    </li>
  );
}
