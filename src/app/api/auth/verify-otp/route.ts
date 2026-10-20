import { NextRequest, NextResponse } from 'next/server'
import {
  verifyOtp,
  upsertUserByPhone,
  createSession,
  sessionCookieOptions,
  normalizePhone,
  SESSION_COOKIE,
  formatPhoneDisplay,
} from '@/lib/auth'

export const dynamic = 'force-dynamic'

/**
 * POST /api/auth/verify-otp
 * Body: { phone: string, code: string }
 * -> { ok, user, isNew, phoneDisplay } + Set-Cookie sesi
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as { phone?: string; code?: string }
    const phone = normalizePhone(body.phone ?? '')
    const code = (body.code ?? '').replace(/\D+/g, '')
    if (!phone || code.length !== 6) {
      return NextResponse.json(
        { ok: false, error: 'Nomor atau kode OTP tidak valid.' },
        { status: 400 },
      )
    }

    const valid = await verifyOtp(phone, code)
    if (!valid) {
      return NextResponse.json(
        { ok: false, error: 'Kode salah atau kedaluwarsa. Minta kode baru ya.' },
        { status: 401 },
      )
    }

    const { user, isNew } = await upsertUserByPhone(phone)
    const { token, expiresAt } = await createSession(user.id)

    const res = NextResponse.json({
      ok: true,
      user,
      isNew,
      phoneDisplay: formatPhoneDisplay(user.phone),
    })
    res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(expiresAt))
    return res
  } catch (e) {
    console.error('[API /api/auth/verify-otp]', e)
    return NextResponse.json(
      { ok: false, error: 'Gagal memverifikasi kode. Coba lagi ya.' },
      { status: 500 },
    )
  }
}
