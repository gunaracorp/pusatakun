import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import type { FaqDTO } from '@/lib/marketplace'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const rows = await db.faq.findMany({ orderBy: { order: 'asc' } })
    const faqs: FaqDTO[] = rows.map((f) => ({
      id: f.id,
      question: f.question,
      answer: f.answer,
    }))
    return NextResponse.json({ ok: true, count: faqs.length, faqs })
  } catch (e) {
    console.error('[API /api/faqs]', e)
    return NextResponse.json({ ok: false, error: 'Gagal memuat FAQ' }, { status: 500 })
  }
}
