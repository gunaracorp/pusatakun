import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireUser } from '@/lib/auth'
import { initialsOf, type AdminUserDTO } from '@/lib/marketplace'

export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/users?q=... — daftar pengguna + jumlah aktivitas (khusus ADMIN).
 * -> { ok, total, users: AdminUserDTO[] }
 */
export async function GET(req: NextRequest) {
  try {
    const { user, error } = await requireUser(req)
    if (error) return error
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ ok: false, error: 'Akses khusus admin.' }, { status: 403 })
    }

    const q = (req.nextUrl.searchParams.get('q') ?? '').trim().replace(/\D+/g, '')
    const where = q ? { phone: { contains: q } } : {}

    const [total, rows] = await Promise.all([
      db.user.count({ where }),
      db.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 100,
        include: { _count: { select: { orders: true, listings: true } } },
      }),
    ])

    const users: AdminUserDTO[] = rows.map((u) => ({
      id: u.id,
      name: u.name,
      phone: u.phone,
      role: u.role as AdminUserDTO['role'],
      createdAt: u.createdAt.toISOString(),
      orderCount: u._count.orders,
      listingCount: u._count.listings,
    }))

    return NextResponse.json({ ok: true, total, users })
  } catch (e) {
    console.error('[API /api/admin/users GET]', e)
    return NextResponse.json({ ok: false, error: 'Gagal memuat pengguna.' }, { status: 500 })
  }
}

/**
 * PATCH /api/admin/users — ubah peran pengguna (khusus ADMIN).
 * Body: { id: string, role: 'BUYER' | 'SELLER' }
 * Aturan: ADMIN tidak boleh diubah, diri sendiri tidak boleh diubah.
 * -> { ok, user }
 */
export async function PATCH(req: NextRequest) {
  try {
    const { user, error } = await requireUser(req)
    if (error) return error
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ ok: false, error: 'Akses khusus admin.' }, { status: 403 })
    }

    const body = (await req.json().catch(() => ({}))) as { id?: string; role?: string }
    const id = (body.id ?? '').trim()
    const role = body.role
    if (!id || (role !== 'BUYER' && role !== 'SELLER')) {
      return NextResponse.json({ ok: false, error: 'Parameter tidak valid.' }, { status: 400 })
    }

    const target = await db.user.findUnique({ where: { id } })
    if (!target) {
      return NextResponse.json({ ok: false, error: 'Pengguna tidak ditemukan.' }, { status: 404 })
    }
    if (target.role === 'ADMIN') {
      return NextResponse.json(
        { ok: false, error: 'Peran pemilik situs tidak dapat diubah.' },
        { status: 400 },
      )
    }
    if (target.id === user.id) {
      return NextResponse.json(
        { ok: false, error: 'Tidak bisa mengubah peran diri sendiri.' },
        { status: 400 },
      )
    }

    const updated = await db.user.update({ where: { id }, data: { role } })
    return NextResponse.json({
      ok: true,
      user: { id: updated.id, role: updated.role, name: updated.name, phone: updated.phone },
    })
  } catch (e) {
    console.error('[API /api/admin/users PATCH]', e)
    return NextResponse.json({ ok: false, error: 'Gagal mengubah peran.' }, { status: 500 })
  }
}
