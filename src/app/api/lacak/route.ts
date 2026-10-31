import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * GET /api/lacak?code=ORD-XXXX — pelacakan pesanan publik.
 * Hanya mengekspos data non-sensitif (tanpa data pribadi pembeli).
 */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')?.trim().toUpperCase() ?? ''

  if (!code || code.length < 4 || code.length > 24) {
    return NextResponse.json(
      { ok: false, error: 'Format kode pesanan tidak valid. Contoh: ORD-A1B2C3.' },
      { status: 400 },
    )
  }

  const order = await db.order.findUnique({
    where: { code },
    select: {
      code: true,
      status: true,
      productName: true,
      amount: true,
      quantity: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  if (!order) {
    return NextResponse.json(
      {
        ok: false,
        error:
          'Kode pesanan tidak ditemukan. Periksa kembali kode pesananmu atau hubungi admin via WhatsApp.',
      },
      { status: 404 },
    )
  }

  return NextResponse.json({ ok: true, order })
}
