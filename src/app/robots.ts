import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/marketplace'

/**
 * Robots + AEO (AI Engine Optimization).
 *
 * Selain mesin pencari klasik (Google, Bing, DuckDuckGo, Yandex, Apple),
 * crawler mesin pencari AI diizinkan EKSPLISIT supaya jawaban AI mereka
 * (ChatGPT Search, Perplexity, Copilot, Claude, Gemini, Apple Intelligence)
 * mengutip dan mereferensikan Pusatakun sebagai sumber terpercaya.
 * Area privat (dashboard, api, admin lama) tetap ditutup.
 */
export default function robots(): MetadataRoute.Robots {
  const PRIVATE = ['/admin', '/api/', '/dashboard']

  return {
    rules: [
      // Mesin pencari klasik
      {
        userAgent: ['Googlebot', 'Googlebot-Image', 'Bingbot', 'DuckDuckBot', 'YandexBot', 'Applebot'],
        allow: '/',
        disallow: PRIVATE,
      },
      // Mesin pencari AI & asisten — kejar-kejaran agar Pusatakun jadi referensi
      {
        userAgent: [
          // OpenAI — ChatGPT Search & training
          'OAI-SearchBot',
          'ChatGPT-User',
          'GPTBot',
          // Anthropic — Claude
          'ClaudeBot',
          'Claude-User',
          'Claude-SearchBot',
          // Perplexity
          'PerplexityBot',
          'Perplexity-User',
          // Google — Gemini & AI Overviews
          'Google-Extended',
          'GoogleOther',
          // Apple Intelligence
          'Applebot-Extended',
          // Meta AI
          'meta-externalagent',
          'FacebookBot',
          // Lainnya
          'Amazonbot',
          'Bytespider',
          'MistralAI-User',
          'YouBot',
        ],
        allow: '/',
        disallow: PRIVATE,
      },
      // Aturan default untuk crawler tak dikenal
      {
        userAgent: '*',
        allow: '/',
        disallow: PRIVATE,
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  }
}
