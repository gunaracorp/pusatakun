import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import type { ProductDTO } from '@/lib/marketplace'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams
    const q = (sp.get('q') ?? '').trim()
    const category = (sp.get('category') ?? '').trim()
    const level = (sp.get('level') ?? '').trim()
    const sort = (sp.get('sort') ?? 'populer').trim()
    const minPrice = sp.get('minPrice')
    const maxPrice = sp.get('maxPrice')
    const featured = sp.get('featured')
    const limit = Math.min(Number(sp.get('limit') ?? 60) || 60, 100)
    const offset = Math.max(Number(sp.get('offset') ?? 0) || 0, 0)

    const where: Record<string, unknown> = {}

    if (category && category !== 'semua') where.categoryId = category
    if (level && level !== 'Semua') where.level = level.toUpperCase()
    if (featured === 'true') where.featured = true

    if (q) {
      where.OR = [
        { name: { contains: q } },
        { description: { contains: q } },
        { category: { is: { name: { contains: q } } } },
      ]
    }

    const priceFilter: Record<string, number> = {}
    if (minPrice && !Number.isNaN(Number(minPrice))) priceFilter.gte = Number(minPrice)
    if (maxPrice && !Number.isNaN(Number(maxPrice)) && Number(maxPrice) > 0) priceFilter.lte = Number(maxPrice)
    if (Object.keys(priceFilter).length > 0) where.price = priceFilter

    let orderBy: Record<string, 'asc' | 'desc'> = { sold: 'desc' }
    if (sort === 'termurah') orderBy = { price: 'asc' }
    else if (sort === 'termahal') orderBy = { price: 'desc' }
    else if (sort === 'rating') orderBy = { rating: 'desc' }

    const [total, rows] = await Promise.all([
      db.product.count({ where }),
      db.product.findMany({
        where,
        orderBy: [orderBy],
        take: limit,
        skip: offset,
        include: { category: { select: { slug: true, name: true } } },
      }),
    ])

    const products: ProductDTO[] = rows.map((p) => ({
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
    }))

    return NextResponse.json({ ok: true, total, count: products.length, products })
  } catch (e) {
    console.error('[API /api/products]', e)
    return NextResponse.json({ ok: false, error: 'Gagal memuat produk' }, { status: 500 })
  }
}

function safeParseSpecs(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return []
  }
}
