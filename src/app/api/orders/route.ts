import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireUser, generateRefCode } from '@/lib/auth'
import type { OrderDTO } from '@/lib/marketplace'

export const dynamic = 'force-dynamic'

function toOrderDTO(o: {
  id: string
  code: string
  productId: string | null
  productName: string
  amount: number
  quantity: number
  status: string
  createdAt: Date
}): OrderDTO {
  return {
    id: o.id,
    code: o.code,
    productId: o.productId,
    productName: o.productName,
    amount: o.amount,
    quantity: o.quantity,
    status: o.status as OrderDTO['status'],
    createdAt: o.createdAt.toISOString(),
  }
}

/** GET /api/orders — daftar pesanan pembeli yang sedang login. */
export async function GET(req: NextRequest) {
  try {
    const { user, error } = await requireUser(req)
    if (error) return error
    const [total, rows] = await Promise.all([
      db.order.count({ where: { buyerId: user.id } }),
      db.order.findMany({
        where: { buyerId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
    ])
    return NextResponse.json({ ok: true, total, orders: rows.map(toOrderDTO) })
  } catch (e) {
    console.error('[API /api/orders GET]', e)
    return NextResponse.json({ ok: false, error: 'Gagal memuat pesanan.' }, { status: 500 })
  }
}

/**
 * POST /api/orders — pembeli membuat pesanan (checkout dibantu admin via WhatsApp).
 * Body: { productName, amount, productId?, quantity? }
 * -> { ok, order }
 */
export async function POST(req: NextRequest) {
  try {
    const { user, error } = await requireUser(req)
    if (error) return error

    const body = (await req.json().catch(() => ({}))) as {
      productName?: string
      amount?: number
      productId?: string
      quantity?: number
    }

    const productName = (body.productName ?? '').trim().slice(0, 140)
    const amount = Math.round(Number(body.amount ?? 0))
    const quantity = Math.max(1, Math.min(10, Math.round(Number(body.quantity ?? 1)) || 1))
    const productId = (body.productId ?? '').trim().slice(0, 40) || null

    if (!productName || !Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { ok: false, error: 'Data pesanan tidak valid.' },
        { status: 400 },
      )
    }

    // Anti-spam: maksimal 15 pesanan terbuka per pembeli
    const openOrders = await db.order.count({
      where: { buyerId: user.id, status: 'MENUNGGU_PEMBAYARAN' },
    })
    if (openOrders >= 15) {
      return NextResponse.json(
        { ok: false, error: 'Kamu punya banyak pesanan menunggu pembayaran. Selesaikan dulu ya.' },
        { status: 400 },
      )
    }

    const order = await db.order.create({
      data: {
        code: generateRefCode('ORD'),
        buyerId: user.id,
        productId,
        productName,
        amount: amount * quantity,
        quantity,
        status: 'MENUNGGU_PEMBAYARAN',
      },
    })

    return NextResponse.json({ ok: true, order: toOrderDTO(order) })
  } catch (e) {
    console.error('[API /api/orders POST]', e)
    return NextResponse.json({ ok: false, error: 'Gagal membuat pesanan.' }, { status: 500 })
  }
}
