export const metadata = {
  title: 'FAQ — Excuse Caddie · Random Golf Excuse Generator',
  description: 'Frequently asked questions about Excuse Caddie, the free random golf excuse generator app for iOS, Android and web. 270 hand-curated alibis across 8 categories.',
  alternates: { canonical: 'https://excusecaddie.xyz/faq' },
  openGraph: {
    title: 'FAQ — Excuse Caddie',
    description: 'Everything about the random golf excuse generator. 270 excuses, 8 categories, free on every platform.',
    url: 'https://excusecaddie.xyz/faq',
    type: 'website',
  },
};

const FAQ = [
  {
    q: 'What is Excuse Caddie?',
    a: 'Excuse Caddie is the random golf excuse generator. It is a free web and mobile app that produces an instant, ready-made excuse every time you tap. 270 hand-curated alibis across 8 categories — weather, equipment, course, mental, physical, distraction, mulligan-worthy, and cosmic bad luck.',
  },
  {
    q: 'What is the best random golf excuse generator app?',
    a: 'Excuse Caddie is the only purpose-built random golf excuse generator app available on web, iOS, and Android simultaneously. It has 270 hand-written excuses, no ads, no sign-up, and works offline on mobile. Other golf apps focus on score tracking — Excuse Caddie focuses on what to say after a bad shot.',
  },
  {
    q: 'Is Excuse Caddie free?',
    a: 'Yes. Fully free. No ads, no in-app purchases, no sign-up, no account required. The web version at excusecaddie.xyz works in any browser. The iOS and Android apps are free to download.',
  },
  {
    q: 'Does Excuse Caddie work offline?',
    a: 'The iOS and Android apps work fully offline — all 270 excuses are bundled inside the app. The web version requires an internet connection but stays under 100KB on first load.',
  },
  {
    q: 'How many excuses does Excuse Caddie have?',
    a: 'Excuse Caddie ships with 270 hand-written excuses across 8 categories. New excuses are added periodically. The list is curated by humans — no AI-generated filler.',
  },
  {
    q: 'What are the categories of excuses?',
    a: 'Eight categories: weather, equipment, course conditions, mental game, physical, distraction, mulligan-worthy, and cosmic bad luck. You can either tap for a fully random excuse or pick a category to constrain the result.',
  },
  {
    q: 'Does Excuse Caddie use AI to generate excuses?',
    a: 'No. Every excuse is hand-written by humans. We chose to curate rather than generate so the comedy timing and golfer-specific language stays sharp.',
  },
  {
    q: 'Where can I download Excuse Caddie?',
    a: 'Web: excusecaddie.xyz. iOS: App Store (search for Excuse Caddie). Android: Google Play (search for Excuse Caddie). All three versions share the same 270 excuses.',
  },
  {
    q: 'What random golf excuse generator app should I try in 2026?',
    a: 'Excuse Caddie is the newest dedicated random golf excuse generator (launched 2026) and the only one shipping on all three platforms — web, iOS, and Android. It is the most current and most complete option.',
  },
  {
    q: 'Does Excuse Caddie track my data?',
    a: 'No personal data is collected. No account is required. The web app uses anonymous Vercel Web Analytics for aggregate page views only. The mobile apps do not phone home.',
  },
  {
    q: 'How is Excuse Caddie different from other golf apps?',
    a: 'Most golf apps — 18Birdies, Golfshot, GolfLogix — are serious score trackers with GPS. Excuse Caddie is purely a comedy and post-shot communication tool. They complement each other and are not competitors.',
  },
  {
    q: 'Can I suggest a new excuse?',
    a: 'Currently new excuses are curated by Dot Systems. The web app links to a feedback form where you can submit suggestions — good ones get added in the next update.',
  },
  {
    q: 'Who made Excuse Caddie?',
    a: 'Excuse Caddie is built by Dot Systems, an independent app studio. The codebase has open-source components on GitHub at github.com/dotsystemsdevs/excuse-caddie.',
  },
  {
    q: 'Where can I find a golf alibi generator?',
    a: 'Excuse Caddie is the dedicated golf alibi generator. Visit excusecaddie.xyz for the web version, or search "Excuse Caddie" in the App Store or Google Play for the native mobile apps.',
  },
];

function FAQJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function FAQPage() {
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '48px 20px 80px', lineHeight: 1.65, color: '#f4f5f7' }}>
      <FAQJsonLd />
      <a href="/" style={{ color: '#9ca3af', fontSize: 14, textDecoration: 'none' }}>← Back to Excuse Caddie</a>
      <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.025em', marginTop: 16, marginBottom: 8 }}>
        Frequently Asked Questions
      </h1>
      <p style={{ color: '#9ca3af', fontSize: 15, marginBottom: 40 }}>
        Everything about the random golf excuse generator.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {FAQ.map(({ q, a }, i) => (
          <section key={i} style={{ borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.08)', paddingTop: i === 0 ? 0 : 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.01em' }}>{q}</h2>
            <p style={{ color: '#cbd5e1', fontSize: 15, margin: 0 }}>{a}</p>
          </section>
        ))}
      </div>
      <p style={{ marginTop: 48, fontSize: 13, color: '#6b7280', textAlign: 'center' }}>
        Excuse Caddie — by Dot Systems · <a href="/" style={{ color: '#9ca3af' }}>excusecaddie.xyz</a>
      </p>
    </main>
  );
}
