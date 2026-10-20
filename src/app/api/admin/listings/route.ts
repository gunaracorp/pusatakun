import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

const ALLOWED_ACTIONS = ['approve', 'reject', 'mark-sold', 'delete'] as const
type Action = (typeof ALLOWED_ACTIONS)[number]

/**
 * PATCH /api/admin/listings — kurasi listing oleh ADMIN.
 * Body: { id: string, action: 'approve' | 'reject' | 'mark-sold' | 'delete', note?: string }
 * -> { ok, listing? }
 */
export async function PATCH(req: NextRequest) {
  try {
    const { user, error } = await requireUser(req)
    if (error) return error
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ ok: false, error: 'Akses khusus admin.' }, { status: 403 })
    }

    const body = (await req.json().catch(() => ({}))) as {
      id?: string
      action?: string
      note?: string
    }
    const id = (body.id ?? '').trim()
    const action = body.action as Action
    if (!id || !ALLOWED_ACTIONS.includes(action)) {
      return NextResponse.json(
        { ok: false, error: 'Parameter tidak valid.' },
        { status: 400 },
      )
    }

    const listing = await db.listing.findUnique({ where: { id } })
    if (!listing) {
      return NextResponse.json({ ok: false, error: 'Listing tidak ditemukan.' }, { status: 404 })
    }

    if (action === 'delete') {
      await db.listing.delete({ where: { id } })
      return NextResponse.json({ ok: true, deleted: true })
    }

    const statusMap: Record<Exclude<Action, 'delete'>, string> = {
      approve: 'APPROVED',
      reject: 'REJECTED',
      'mark-sold': 'SOLD',
    }
    const updated = await db.listing.update({
      where: { id },
      data: {
        status: statusMap[action],
        adminNote: typeof body.note === 'string' ? body.note.trim().slice(0, 300) : null,
      },
    })
    return NextResponse.json({ ok: true, listing: { id: updated.id, status: updated.status } })
  } catch (e) {
    console.error('[API /api/admin/listings PATCH]', e)
    return NextResponse.json({ ok: false, error: 'Gagal memproses kurasi.' }, { status: 500 })
  }
}
