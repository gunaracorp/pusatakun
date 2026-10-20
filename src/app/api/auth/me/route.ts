import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

/** GET /api/auth/me -> { ok, user: null | { id, phone, name, role, createdAt } } */
export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req)
    return NextResponse.json({ ok: true, user })
  } catch (e) {
    console.error('[API /api/auth/me]', e)
    return NextResponse.json({ ok: true, user: null })
  }
}
