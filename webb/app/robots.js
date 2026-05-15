const SITE_URL = 'https://excusecaddie.xyz';

// AI/LLM crawlers to explicitly welcome. These bots are used by ChatGPT, Claude,
// Perplexity, Gemini and similar generative search engines to discover and cite
// content. Explicit allow improves GEO (Generative Engine Optimization).
const AI_BOTS = [
  'GPTBot',           // OpenAI / ChatGPT
  'ChatGPT-User',     // OpenAI live browsing
  'OAI-SearchBot',    // OpenAI search
  'ClaudeBot',        // Anthropic Claude
  'Claude-Web',       // Anthropic
  'PerplexityBot',    // Perplexity search
  'Perplexity-User',  // Perplexity
  'Google-Extended',  // Bard / Gemini grounding
  'GoogleOther',      // Google research crawlers
  'CCBot',            // Common Crawl (used by many AI training pipelines)
  'anthropic-ai',     // Legacy Anthropic
  'cohere-ai',        // Cohere
  'Bytespider',       // ByteDance / Doubao
  'Amazonbot',        // Amazon Q / Alexa
  'DuckAssistBot',    // DuckDuckGo AI
  'YouBot',           // You.com
  'Applebot-Extended', // Apple Intelligence
  'Meta-ExternalAgent', // Meta AI
];

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/api/',
      },
      // Explicitly allow AI bots — same rules as wildcard, but explicit signals welcome.
      ...AI_BOTS.map((bot) => ({
        userAgent: bot,
        allow: '/',
        disallow: '/api/',
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
