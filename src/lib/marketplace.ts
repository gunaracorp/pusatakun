export const SITE = {
  name: 'Raja Akun',
  shortName: 'RajaAkun',
  domain: 'rajaakun.web.id',
  url: 'https://rajaakun.web.id',
  tagline: 'Raja Segala Marketplace Akun',
  description:
    'Raja Akun (rajaakun.web.id) — Marketplace jual beli akun media sosial terlengkap, termurah & terpercaya se-Indonesia. Akun Instagram, TikTok, YouTube, Facebook, dan 100+ jenis akun lainnya. Garansi penuh, pengiriman instan 5-15 menit, support 24/7.',
  // Kontak resmi (aktif, dijawab pemilik langsung)
  whatsapp: '6281316516524',
  whatsappDisplay: '+62 813-1651-6524',
  email: 'rajaakun2026@gmail.com',
  // Badan hukum & support system
  company: 'PT Digital Bisnis Manajemen',
  companySite: 'https://digiman.id',
  companySupport: 'PT Top Konsultan Internasional',
  companySupportSite: 'https://topkonsultan.web.id',
  address:
    'Kantor PHI Kwitang, Kwitang, Senen, Jakarta Pusat, DKI Jakarta, Indonesia',
  // Entitas di balik sistem (branding internal — tidak mencolok di permukaan)
  founder: 'Gugun Gunara',
  founderAlias: 'Muhammad Lutfi Azmi',
  founderHandles: ['prabudanling', 'santri angon'],
  founded: 2021,
  // Sosial media resmi entitas founder (rel="me" untuk entity SEO)
  socials: [
    { id: 'facebook', label: 'Facebook', handle: 'bossdanling', url: 'https://www.facebook.com/bossdanling' },
    { id: 'x', label: 'X (Twitter)', handle: '@gunzz_krenzz', url: 'https://x.com/gunzz_krenzz' },
    { id: 'instagram', label: 'Instagram', handle: '@prabudanling', url: 'https://www.instagram.com/prabudanling' },
    { id: 'tiktok', label: 'TikTok', handle: '@gunaracorp', url: 'https://www.tiktok.com/@gunaracorp' },
    { id: 'threads', label: 'Threads', handle: '@prabudanling', url: 'https://www.threads.com/@prabudanling' },
    { id: 'reddit', label: 'Reddit', handle: 'u/prabudanling', url: 'https://www.reddit.com/user/prabudanling/' },
  ],
} as const

export const waLink = (message: string) =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`

/** Link chat WA untuk konfirmasi pesanan (dibawa admin 24/7). */
export const orderWaLink = (orderCode: string, productName: string, buyerName: string) =>
  waLink(
    `Halo Admin Raja Akun! Saya ${buyerName || 'pembeli'} sudah membuat pesanan *${orderCode}* untuk produk *${productName}*. Mohon dibantu proses pembayaran & pengirimannya ya. Terima kasih!`,
  )

/** Link chat WA untuk kurasi listing penjual. */
export const listingWaLink = (listingCode: string, title: string, sellerName: string) =>
  waLink(
    `Halo Admin Raja Akun! Saya ${sellerName || 'penjual'} baru saja mendaftarkan akun *${title}* (kode ${listingCode}). Mohon dicek & dikurasi ya. Terima kasih!`,
  )

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

// ============ Marketplace penjual & pesanan ============

export type ListingStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SOLD'

export type SellerListingDTO = {
  id: string
  code: string
  platform: string
  platformName: string
  title: string
  description: string
  price: number
  followers: string | null
  level: string
  status: ListingStatus
  adminNote: string | null
  sellerName: string | null
  sellerInitials: string
  sellerVerified: boolean
  createdAt: string
}

export type OrderStatus = 'MENUNGGU_PEMBAYARAN' | 'DIPROSES' | 'SELESAI' | 'DIBATALKAN'

export type OrderDTO = {
  id: string
  code: string
  productId: string | null
  productName: string
  amount: number
  quantity: number
  status: OrderStatus
  createdAt: string
}

export type SellerStatsDTO = {
  total: number
  pending: number
  approved: number
  sold: number
}

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  MENUNGGU_PEMBAYARAN: 'Menunggu Pembayaran',
  DIPROSES: 'Diproses',
  SELESAI: 'Selesai',
  DIBATALKAN: 'Dibatalkan',
}

export const LISTING_STATUS_LABEL: Record<ListingStatus, string> = {
  PENDING: 'Kurasi Admin',
  APPROVED: 'Tayang',
  REJECTED: 'Ditolak',
  SOLD: 'Terjual',
}

export function initialsOf(name: string | null): string {
  if (!name) return 'RA'
  const parts = name.trim().split(/\s+/).slice(0, 2)
  return parts.map((p) => p[0]?.toUpperCase() ?? '').join('') || 'RA'
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
