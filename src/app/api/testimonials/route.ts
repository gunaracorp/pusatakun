import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import type { TestimonialDTO } from '@/lib/marketplace'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const rows = await db.testimonial.findMany({ orderBy: { order: 'asc' } })
    const testimonials: TestimonialDTO[] = rows.map((t) => ({
      id: t.id,
      name: t.name,
      city: t.city,
      role: t.role,
      content: t.content,
      rating: t.rating,
      initials: t.initials,
    }))
    return NextResponse.json({ ok: true, count: testimonials.length, testimonials })
  } catch (e) {
    console.error('[API /api/testimonials]', e)
    return NextResponse.json({ ok: false, error: 'Gagal memuat testimoni' }, { status: 500 })
  }
}
