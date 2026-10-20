export const SITE = {
  name: 'Raja Akun',
  shortName: 'RajaAkun',
  domain: 'rajaakun.web.id',
  url: 'https://rajaakun.web.id',
  tagline: 'Raja Segala Marketplace Akun',
  description:
    'Raja Akun (rajaakun.web.id) — Marketplace jual beli akun media sosial terlengkap, termurah & terpercaya se-Indonesia. Akun Instagram, TikTok, YouTube, Facebook, dan 100+ jenis akun lainnya. Garansi penuh, pengiriman instan 5-15 menit, support 24/7.',
  whatsapp: '6281234567890',
  whatsappDisplay: '+62 812-3456-7890',
  email: 'support@rajaakun.web.id',
  instagramHandle: '@rajaakun',
  founded: 2021,
} as const

export const waLink = (message: string) =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`

export const LEVELS = ['Semua', 'FRESH', 'AMAN', 'PREMIUM', 'MONETIZE'] as const

export const PRICE_RANGES = [
  { label: '< Rp50rb', min: 0, max: 50000 },
  { label: 'Rp50rb–150rb', min: 50000, max: 150000 },
  { label: 'Rp150rb–500rb', min: 150000, max: 500000 },
  { label: 'Rp500rb+', min: 500000, max: Number.MAX_SAFE_INTEGER },
] as const

export type SortOption = 'populer' | 'termurah' | 'termahal' | 'rating'

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'populer', label: 'Terpopuler' },
  { value: 'termurah', label: 'Harga Termurah' },
  { value: 'termahal', label: 'Harga Tertinggi' },
  { value: 'rating', label: 'Rating Tertinggi' },
]

// ============ DTO types shared between server & client ============

export type CategoryDTO = {
  id: string
  slug: string
  name: string
  tagline: string
  icon: string
  gradient: string
  order: number
  productCount: number
}

export type ProductDTO = {
  id: string
  slug: string
  name: string
  categorySlug: string
  categoryName: string
  description: string
  price: number
  oldPrice: number | null
  stock: number
  totalStock: number
  level: string
  warranty: string
  featured: boolean
  hot: boolean
  sold: number
  rating: number
  specs: string[]
}

export type TestimonialDTO = {
  id: string
  name: string
  city: string
  role: string
  content: string
  rating: number
  initials: string
}

export type FaqDTO = {
  id: string
  question: string
  answer: string
}

export type StatsDTO = {
  totalProducts: number
  totalCategories: number
  totalSold: number
  totalStock: number
  avgRating: number
}

// Safe deterministic formatting (no Intl on client => no hydration mismatch)
export function formatIDR(n: number): string {
  const neg = n < 0
  const s = Math.abs(Math.round(n)).toString()
  const withDots = s.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${neg ? '-' : ''}Rp ${withDots}`
}

export function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1).replace('.', ',')} Jt+`
  if (n >= 1_000) return `${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1).replace('.', ',')} Rb+`
  return `${n}`
}

export function discountPercent(price: number, oldPrice: number | null): number | null {
  if (!oldPrice || oldPrice <= price) return null
  return Math.round(((oldPrice - price) / oldPrice) * 100)
}
