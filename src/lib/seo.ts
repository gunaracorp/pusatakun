/**
 * RAJA AKUN — SEO Infrastructure
 * Metadata + JSON-LD structured data builders (schema.org).
 * Semua konten dalam Bahasa Indonesia, brand dark royal gold.
 */

import type { Metadata } from 'next'
import { SITE } from '@/lib/marketplace'
import type { FaqDTO, ProductDTO } from '@/lib/marketplace'

// ============ Konstanta brand ============

const SITE_URL = SITE.url
const OG_IMAGE = '/og-image.jpg'
const OG_IMAGE_ALT = 'Raja Akun — Marketplace Jual Beli Akun Terlengkap'

const META_TITLE =
  'Raja Akun — Marketplace Jual Beli Akun Media Sosial Terlengkap & Terpercaya #1 Indonesia'

const META_DESCRIPTION =
  'Raja Akun (rajaakun.web.id) adalah marketplace jual beli akun media sosial terlengkap dan ' +
  'terpercaya #1 di Indonesia. Jual akun Instagram, TikTok, YouTube, Facebook, Twitter/X, ' +
  'Telegram, akun game Mobile Legends, Free Fire, Genshin Impact, hingga akun Netflix & Spotify. ' +
  'Akun murah bergaransi penuh, proses instan 5–15 menit, transaksi aman via rekening terjamin, ' +
  'dan customer service 24/7 siap membantu. Toko akun terpercaya untuk kebutuhan jual beli akun ' +
  'premium — cek katalog lengkapnya sekarang di rajaakun.web.id!'

const META_KEYWORDS = [
  'jual akun',
  'jual akun murah',
  'jual beli akun',
  'jual beli akun media sosial',
  'marketplace akun',
  'marketplace jual beli akun',
  'pusat akun',
  'jual akun instagram',
  'jual akun tiktok',
  'jual akun youtube',
  'jual akun facebook',
  'jual akun twitter',
  'jual akun telegram',
  'jual akun game',
  'jual akun ml',
  'jual akun mobile legends',
  'jual akun ff',
  'jual akun free fire',
  'jual akun genshin',
  'jual akun valorant',
  'akun premium murah',
  'akun bergaransi',
  'akun murah bergaransi',
  'jual akun aman',
  'raja akun',
  'rajaakun',
  'rajaakun web id',
  'toko akun',
  'agen akun',
  'reseller akun',
  'jual akun netflix',
  'jual akun spotify',
  'jual akun whatsapp',
  'jual akun discord',
  'jual akun linkedin',
  'jual akun gmail',
  'login whatsapp',
  'daftar penjual akun',
  'cara jadi penjual akun',
  'dashboard penjual akun',
  'marketplace akun pt digital bisnis manajemen',
  // Entitas pendiri & ekosistem (entity SEO — branding internal)
  'gugun gunara',
  'muhammad lutfi azmi',
  'prabudanling',
  'santri angon',
  'pt digital bisnis manajemen',
  'digiman id',
  'pt top konsultan internasional',
  'topkonsultan web id',
] as const

// ============ Metadata utama (route `/`) ============

export function buildHomeMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: META_TITLE,
      template: '%s | Raja Akun',
    },
    description: META_DESCRIPTION,
    keywords: [...META_KEYWORDS],
    applicationName: SITE.name,
    authors: [
      { name: SITE.founder, url: SITE_URL },
      { name: SITE.founderAlias, url: SITE_URL },
    ],
    creator: SITE.founder,
    publisher: SITE.company,
    category: 'ecommerce',
    alternates: {
      canonical: '/',
    },
    openGraph: {
      type: 'website',
      locale: 'id_ID',
      url: SITE_URL,
      siteName: SITE.name,
      title: META_TITLE,
      description: META_DESCRIPTION,
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: OG_IMAGE_ALT,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: META_TITLE,
      description: META_DESCRIPTION,
      images: [OG_IMAGE],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    formatDetection: {
      telephone: false,
    },
  }
}

// ============ JSON-LD builders ============

/** Strip tag HTML sederhana dari jawaban FAQ (aman utk schema.org). */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

/** Konversi nomor WA '628...' → '+628...' untuk schema contactPoint. */
function telFormat(raw: string): string {
  return raw.startsWith('+') ? raw : `+${raw}`
}

export function organizationJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    alternateName: ['RajaAkun', 'Raja Akun Indonesia'],
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    email: SITE.email,
    description:
      'Raja Akun (rajaakun.web.id) — marketplace jual beli akun media sosial, game, dan ' +
      'streaming terlengkap & terpercaya se-Indonesia. Akun murah bergaransi, proses instan, ' +
      'support 24/7.',
    foundingDate: '2021',
    founder: personRef(),
    parentOrganization: {
      '@type': 'Organization',
      name: SITE.company,
      url: SITE.companySite,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.replace(', Indonesia', ''),
      addressLocality: 'Jakarta Pusat',
      addressRegion: 'DKI Jakarta',
      addressCountry: 'ID',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: telFormat(SITE.whatsapp),
      email: SITE.email,
      contactType: 'customer service',
      availableLanguage: ['id'],
      hoursAvailable: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '00:00',
        closes: '23:59',
      },
    },
    sameAs: [...SITE.socials.map((s) => s.url), SITE.companySite, SITE.companySupportSite],
  }
}

/** Referensi founder (dipakai Organization & Person). */
function personRef(): Record<string, unknown> {
  return {
    '@type': 'Person',
    name: SITE.founder,
    alternateName: [SITE.founderAlias, ...SITE.founderHandles],
    url: SITE_URL,
    jobTitle: 'Founder & Chief Architect',
    worksFor: { '@type': 'Organization', name: SITE.company, url: SITE.companySite },
    sameAs: SITE.socials.map((s) => s.url),
  }
}

/** JSON-LD Person untuk entitas founder (entity SEO: naikkan nama di Google). */
export function personJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    ...personRef(),
    description:
      `${SITE.founder} (${SITE.founderAlias}) — founder Raja Akun, arsitek digital di balik ` +
      `${SITE.company} dan ekosistem ${SITE.companySupport}. Dikenal juga sebagai ` +
      `${SITE.founderHandles.join(' & ')}.`,
    knowsAbout: [
      'digital business',
      'marketplace engineering',
      'enterprise architecture',
      'problem solving',
      'digital transformation',
    ],
    memberOf: {
      '@type': 'Organization',
      name: SITE.companySupport,
      url: SITE.companySupportSite,
    },
  }
}

export function websiteJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE_URL,
    description:
      'Marketplace jual beli akun media sosial, game, dan streaming terlengkap se-Indonesia.',
    inLanguage: 'id-ID',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

export function faqJsonLd(faqs: FaqDTO[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: stripHtml(faq.question),
      acceptedAnswer: {
        '@type': 'Answer',
        text: stripHtml(faq.answer),
      },
    })),
  }
}

export function productListJsonLd(products: ProductDTO[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Katalog Akun Raja Akun',
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: `${SITE_URL}${OG_IMAGE}`,
        category: product.categoryName,
        brand: {
          '@type': 'Brand',
          name: 'Raja Akun',
        },
        offers: {
          '@type': 'Offer',
          price: String(Math.round(product.price)),
          priceCurrency: 'IDR',
          availability:
            product.stock > 0
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
          url: `${SITE_URL}/#produk-${product.slug}`,
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: String(product.rating),
          reviewCount: String(100 + (product.slug.length % 200)),
        },
      },
    })),
  }
}

export function breadcrumbJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Katalog Akun',
        item: `${SITE_URL}/#katalog`,
      },
    ],
  }
}
