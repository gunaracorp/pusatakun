import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import type { StatsDTO } from '@/lib/marketplace'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const [totalProducts, totalCategories, agg] = await Promise.all([
      db.product.count(),
      db.category.count(),
      db.product.aggregate({ _sum: { sold: true, stock: true }, _avg: { rating: true } }),
    ])

    const stats: StatsDTO = {
      totalProducts,
      totalCategories,
      totalSold: agg._sum.sold ?? 0,
      totalStock: agg._sum.stock ?? 0,
      avgRating: Math.round((agg._avg.rating ?? 4.9) * 10) / 10,
    }

    return NextResponse.json({ ok: true, stats })
  } catch (e) {
    console.error('[API /api/stats]', e)
    return NextResponse.json({ ok: false, error: 'Gagal memuat statistik' }, { status: 500 })
  }
}
