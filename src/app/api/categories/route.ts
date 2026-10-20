import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import type { CategoryDTO } from '@/lib/marketplace'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const rows = await db.category.findMany({
      orderBy: { order: 'asc' },
      include: { _count: { select: { products: true } } },
    })

    const categories: CategoryDTO[] = rows.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      tagline: c.tagline,
      icon: c.icon,
      gradient: c.gradient,
      order: c.order,
      productCount: c._count.products,
    }))

    return NextResponse.json({ ok: true, count: categories.length, categories })
  } catch (e) {
    console.error('[API /api/categories]', e)
    return NextResponse.json({ ok: false, error: 'Gagal memuat kategori' }, { status: 500 })
  }
}
