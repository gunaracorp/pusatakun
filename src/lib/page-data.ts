/**
 * PUSATAKUN — Server data helpers untuk halaman-halaman statis/SEO.
 * Semua query langsung ke Prisma (pola sama dengan src/app/page.tsx).
 */

import { db } from '@/lib/db'
import type { CategoryDTO, ProductDTO } from '@/lib/marketplace'

export function safeParseSpecs(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return []
  }
}

export function toProductDTO(p: {
  id: string
  slug: string
  name: string
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
  specs: string
  category: { slug: string; name: string }
}): ProductDTO {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    categorySlug: p.category.slug,
    categoryName: p.category.name,
    description: p.description,
    price: p.price,
    oldPrice: p.oldPrice,
    stock: p.stock,
    totalStock: p.totalStock,
    level: p.level,
    warranty: p.warranty,
    featured: p.featured,
    hot: p.hot,
    sold: p.sold,
    rating: p.rating,
    specs: safeParseSpecs(p.specs),
  }
}

/** Kategori untuk footer/shell semua halaman. */
export async function getPageCategories(): Promise<CategoryDTO[]> {
  const rows = await db.category.findMany({
    orderBy: { order: 'asc' },
    include: { _count: { select: { products: true } } },
  })
  return rows.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    tagline: c.tagline,
    icon: c.icon,
    gradient: c.gradient,
    order: c.order,
    productCount: c._count.products,
  }))
}

/** Satu produk by slug (untuk /produk/[slug]) — null jika tidak ada. */
export async function getProductBySlug(slug: string): Promise<ProductDTO | null> {
  const p = await db.product.findUnique({
    where: { slug },
    include: { category: { select: { slug: true, name: true } } },
  })
  return p ? toProductDTO(p) : null
}

/** Semua slug produk (untuk sitemap). */
export async function getAllProductSlugs(): Promise<{ slug: string; updatedAt: Date }[]> {
  const rows = await db.product.findMany({ select: { slug: true, createdAt: true }, orderBy: { sold: 'desc' } })
  return rows.map((r) => ({ slug: r.slug, updatedAt: r.createdAt }))
}

/** Produk terkait: satu kategori, bukan produk itu sendiri, terlaris. */
export async function getRelatedProducts(categoryId: string, excludeSlug: string, take = 4): Promise<ProductDTO[]> {
  const rows = await db.product.findMany({
    where: { categoryId, slug: { not: excludeSlug } },
    orderBy: { sold: 'desc' },
    take,
    include: { category: { select: { slug: true, name: true } } },
  })
  return rows.map(toProductDTO)
}

/** Peta slug kategori -> id (untuk query produk terkait). */
export async function getCategoryIdBySlug(slug: string): Promise<string> {
  const category = await db.category.findUnique({ where: { slug }, select: { id: true } })
  return category?.id ?? ''
}

/** Produk pilihan untuk halaman /katalog (SSR awal). */
export async function getCatalogInitialProducts(take = 24): Promise<{ products: ProductDTO[]; total: number }> {
  const [rows, total] = await Promise.all([
    db.product.findMany({
      orderBy: { sold: 'desc' },
      take,
      include: { category: { select: { slug: true, name: true } } },
    }),
    db.product.count(),
  ])
  return { products: rows.map(toProductDTO), total }
}
