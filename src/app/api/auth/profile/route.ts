import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireUser, toSessionUser, type Role } from '@/lib/auth'

export const dynamic = 'force-dynamic'

/**
 * POST /api/auth/profile
 * Body: { name?: string, role?: 'BUYER' | 'SELLER' }
 * Lengkapi profil setelah daftar (nama + peran), atau ubah peran nanti.
 * -> { ok, user }
 */
export async function POST(req: NextRequest) {
  try {
    const { user, error } = await requireUser(req)
    if (error) return error

    const body = (await req.json().catch(() => ({}))) as { name?: string; role?: string }
    const data: { name?: string; role?: Role } = {}

    if (typeof body.name === 'string') {
      const name = body.name.trim().slice(0, 60)
      if (name.length < 2) {
        return NextResponse.json(
          { ok: false, error: 'Nama minimal 2 huruf ya.' },
          { status: 400 },
        )
      }
      data.name = name
    }

    if (typeof body.role === 'string') {
      if (body.role !== 'BUYER' && body.role !== 'SELLER') {
        return NextResponse.json(
          { ok: false, error: 'Peran tidak valid.' },
          { status: 400 },
        )
      }
      // ADMIN tidak boleh diturunkan perannya lewat endpoint publik
      if (user.role === 'ADMIN') data.role = 'ADMIN'
      else data.role = body.role
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ ok: true, user })
    }

    const updated = await db.user.update({ where: { id: user.id }, data })
    return NextResponse.json({ ok: true, user: toSessionUser(updated) })
  } catch (e) {
    console.error('[API /api/auth/profile]', e)
    return NextResponse.json({ ok: false, error: 'Gagal menyimpan profil.' }, { status: 500 })
  }
}
