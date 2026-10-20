import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { SESSION_COOKIE } from '@/lib/auth'

export const dynamic = 'force-dynamic'

/** POST /api/auth/logout -> hapus sesi + cookie. */
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(SESSION_COOKIE)?.value
    if (token) {
      await db.session.deleteMany({ where: { id: token } })
    }
    const res = NextResponse.json({ ok: true })
    res.cookies.set(SESSION_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 })
    return res
  } catch (e) {
    console.error('[API /api/auth/logout]', e)
    return NextResponse.json({ ok: false, error: 'Gagal keluar.' }, { status: 500 })
  }
}
