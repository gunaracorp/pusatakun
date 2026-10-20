import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import {
  createOtp,
  normalizePhone,
  sendOtpViaWhatsapp,
  OTP_TTL_MINUTES,
  OTP_RESEND_SECONDS,
  formatPhoneDisplay,
} from '@/lib/auth'

export const dynamic = 'force-dynamic'

/**
 * POST /api/auth/request-otp
 * Body: { phone: string }
 * -> { ok, phone, isNew, viaWhatsapp, devCode?, expiresInSec, resendInSec, expiresAt }
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as { phone?: string }
    const phone = normalizePhone(body.phone ?? '')
    if (!phone) {
      return NextResponse.json(
        { ok: false, error: 'Nomor WhatsApp tidak valid. Gunakan format 08xx / 62 8xx.' },
        { status: 400 },
      )
    }

    // Anti-spam sederhana: maksimal 3 OTP per nomor per 10 menit
    const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000)
    const recent = await db.otpCode.count({
      where: { phone, createdAt: { gte: tenMinAgo } },
    })
    if (recent >= 3) {
      return NextResponse.json(
        { ok: false, error: 'Terlalu banyak permintaan kode. Coba lagi dalam beberapa menit.' },
        { status: 429 },
      )
    }

    const { code, expiresAt } = await createOtp(phone)
    const viaWhatsapp = await sendOtpViaWhatsapp(phone, code)
    const existing = await db.user.findUnique({ where: { phone }, select: { id: true } })

    return NextResponse.json({
      ok: true,
      phone,
      phoneDisplay: formatPhoneDisplay(phone),
      isNew: !existing,
      viaWhatsapp,
      // Mode demo (tanpa WhatsApp API terpasang): kode ditampilkan agar alur bisa dicoba.
      devCode: viaWhatsapp ? undefined : code,
      expiresInSec: OTP_TTL_MINUTES * 60,
      resendInSec: OTP_RESEND_SECONDS,
      expiresAt: expiresAt.toISOString(),
    })
  } catch (e) {
    console.error('[API /api/auth/request-otp]', e)
    return NextResponse.json(
      { ok: false, error: 'Gagal mengirim kode. Silakan coba lagi.' },
      { status: 500 },
    )
  }
}
