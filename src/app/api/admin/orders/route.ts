import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireUser } from '@/lib/auth'
import {
  ADMIN_ORDER_STATUSES,
  initialsOf,
  type AdminOrderDTO,
  type OrderStatus,
} from '@/lib/marketplace'

export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/orders?status=... — semua pesanan (khusus ADMIN).
 * -> { ok, total, orders: AdminOrderDTO[] }
 */
export async function GET(req: NextRequest) {
  try {
    const { user, error } = await requireUser(req)
    if (error) return error
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ ok: false, error: 'Akses khusus admin.' }, { status: 403 })
    }

    const status = req.nextUrl.searchParams.get('status')
    const where: Record<string, string> = {}
    if (status && ADMIN_ORDER_STATUSES.includes(status as OrderStatus)) {
      where.status = status
    }

    const [total, rows] = await Promise.all([
      db.order.count({ where }),
      db.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 100,
        include: { buyer: { select: { name: true, phone: true } } },
      }),
    ])

    const orders: AdminOrderDTO[] = rows.map((o) => ({
      id: o.id,
      code: o.code,
      productId: o.productId,
      productName: o.productName,
      amount: o.amount,
      quantity: o.quantity,
      status: o.status as AdminOrderDTO['status'],
      createdAt: o.createdAt.toISOString(),
      buyerName: o.buyer.name,
      buyerPhone: o.buyer.phone,
      buyerInitials: initialsOf(o.buyer.name),
    }))

    return NextResponse.json({ ok: true, total, orders })
  } catch (e) {
    console.error('[API /api/admin/orders GET]', e)
    return NextResponse.json({ ok: false, error: 'Gagal memuat pesanan.' }, { status: 500 })
  }
}

/**
 * PATCH /api/admin/orders — ubah status pesanan (khusus ADMIN).
 * Body: { id: string, status: OrderStatus }
 * -> { ok, order }
 */
export async function PATCH(req: NextRequest) {
  try {
    const { user, error } = await requireUser(req)
    if (error) return error
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ ok: false, error: 'Akses khusus admin.' }, { status: 403 })
    }

    const body = (await req.json().catch(() => ({}))) as { id?: string; status?: string }
    const id = (body.id ?? '').trim()
    const status = body.status as OrderStatus
    if (!id || !ADMIN_ORDER_STATUSES.includes(status)) {
      return NextResponse.json({ ok: false, error: 'Parameter tidak valid.' }, { status: 400 })
    }

    const order = await db.order.findUnique({ where: { id } })
    if (!order) {
      return NextResponse.json({ ok: false, error: 'Pesanan tidak ditemukan.' }, { status: 404 })
    }

    const updated = await db.order.update({ where: { id }, data: { status } })
    return NextResponse.json({ ok: true, order: { id: updated.id, status: updated.status } })
  } catch (e) {
    console.error('[API /api/admin/orders PATCH]', e)
    return NextResponse.json({ ok: false, error: 'Gagal mengubah status pesanan.' }, { status: 500 })
  }
}
