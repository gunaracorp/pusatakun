/**
 * PUSATAKUN — Sistem Autentikasi WhatsApp OTP
 * ============================================
 * Alur: nomor WhatsApp -> kode OTP 6 digit -> sesi cookie httpOnly.
 *
 * PRODUKSI: set env `WHATSAPP_API_URL` + `WHATSAPP_API_TOKEN` (WhatsApp
 * Business Cloud API / provider pihak ketiga seperti Fonnte, Wablas, dll)
 * maka kode OTP dikirim otomatis ke WhatsApp pengguna.
 * DEMO (tanpa env): kode dikembalikan ke klien dan ditampilkan di dialog
 * dengan label "Mode Demo", plus opsi minta kode manual via WA Admin.
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { SITE } from '@/lib/marketplace'

export const SESSION_COOKIE = 'ra_session'
const SESSION_DAYS = 30
export const OTP_TTL_MINUTES = 5
export const OTP_RESEND_SECONDS = 60

/** Nomor WhatsApp pemilik = SUPER ADMIN otomatis. */
export const ADMIN_PHONE = SITE.whatsapp

export type Role = 'BUYER' | 'SELLER' | 'ADMIN'

export type SessionUser = {
  id: string
  phone: string
  name: string | null
  role: Role
  createdAt: string
}

// ============ Normalisasi nomor Indonesia ============

/**
 * Normalisasi input nomor WhatsApp Indonesia ke format 62xxxxxxxxxx.
 * Menerima: 0813..., 813..., 62813..., +62 813-..., dst.
 * Hanya menerima nomor seluler (62 8xx) — sesuai karakteristik nomor WhatsApp.
 * Return null bila tidak valid.
 */
export function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D+/g, '')
  let normalized: string
  if (digits.startsWith('62')) normalized = digits
  else if (digits.startsWith('0')) normalized = `62${digits.slice(1)}`
  else if (digits.startsWith('8')) normalized = `62${digits}`
  else return null
  // 62 + 8 + 8-11 digit => total 10-13
  if (!/^628\d{8,11}$/.test(normalized)) return null
  return normalized
}

export function formatPhoneDisplay(phone: string): string {
  const p = phone.startsWith('62') ? phone : `62${phone}`
  const body = p.slice(2)
  const head = body.slice(0, 3)
  const rest = body.slice(3)
  const parts = rest.match(/.{1,4}/g) ?? [rest]
  return `+62 ${head}-${parts.join('-')}`
}

// ============ OTP ============

export function generateOtpCode(): string {
  const buf = new Uint32Array(6)
  crypto.getRandomValues(buf)
  return Array.from(buf, (n) => n % 10).join('')
}

export async function createOtp(phone: string): Promise<{ code: string; expiresAt: Date }> {
  const code = generateOtpCode()
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000)
  // batalkan OTP lama yang belum terpakai utk nomor ini
  await db.otpCode.updateMany({ where: { phone, used: false }, data: { used: true } })
  await db.otpCode.create({ data: { phone, code, expiresAt } })
  return { code, expiresAt }
}

export async function verifyOtp(phone: string, code: string): Promise<boolean> {
  const now = new Date()
  const otp = await db.otpCode.findFirst({
    where: { phone, used: false, expiresAt: { gte: now } },
    orderBy: { createdAt: 'desc' },
  })
  if (!otp || otp.code !== code) return false
  await db.otpCode.update({ where: { id: otp.id }, data: { used: true } })
  return true
}

/**
 * Kirim OTP via WhatsApp API bila kredensial produksi tersedia.
 * Return true bila terkirim via API; false = mode demo.
 */
export async function sendOtpViaWhatsapp(phone: string, code: string): Promise<boolean> {
  const apiUrl = process.env.WHATSAPP_API_URL
  const apiToken = process.env.WHATSAPP_API_TOKEN
  if (!apiUrl || !apiToken) return false
  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify({
        target: phone,
        message: `*Pusatakun* (pusatakun.web.id)\n\nKode login kamu: *${code}*\n\nBerlaku ${OTP_TTL_MINUTES} menit. Jangan bagikan kode ini ke siapa pun, termasuk admin.`,
      }),
    })
    return res.ok
  } catch (e) {
    console.error('[sendOtpViaWhatsapp]', e)
    return false
  }
}

// ============ User & Sesi ============

export async function upsertUserByPhone(phone: string): Promise<{ user: SessionUser; isNew: boolean }> {
  const existing = await db.user.findUnique({ where: { phone } })
  if (existing) {
    // promosi otomatis: nomor pemilik selalu ADMIN
    if (phone === ADMIN_PHONE && existing.role !== 'ADMIN') {
      const updated = await db.user.update({ where: { id: existing.id }, data: { role: 'ADMIN' } })
      return { user: toSessionUser(updated), isNew: false }
    }
    return { user: toSessionUser(existing), isNew: false }
  }
  const role: Role = phone === ADMIN_PHONE ? 'ADMIN' : 'BUYER'
  const created = await db.user.create({ data: { phone, role } })
  return { user: toSessionUser(created), isNew: true }
}

export function toSessionUser(u: {
  id: string
  phone: string
  name: string | null
  role: string
  createdAt: Date
}): SessionUser {
  return {
    id: u.id,
    phone: u.phone,
    name: u.name,
    role: (u.role as Role) ?? 'BUYER',
    createdAt: u.createdAt.toISOString(),
  }
}

export async function createSession(userId: string): Promise<{ token: string; expiresAt: Date }> {
  const token = `${crypto.randomUUID()}.${crypto.randomUUID().replaceAll('-', '')}`
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000)
  await db.session.create({ data: { id: token, userId, expiresAt } })
  // housekeeping: hapus sesi kedaluwarsa milik user ini
  await db.session.deleteMany({ where: { userId, expiresAt: { lt: new Date() } } })
  return { token, expiresAt }
}

export function sessionCookieOptions(expiresAt: Date) {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt,
  }
}

/** Baca sesi dari request -> user | null. */
export async function getSessionUser(req: NextRequest): Promise<SessionUser | null> {
  const token = req.cookies.get(SESSION_COOKIE)?.value
  if (!token) return null
  const session = await db.session.findUnique({
    where: { id: token },
    include: { user: true },
  })
  if (!session || session.expiresAt < new Date()) return null
  return toSessionUser(session.user)
}

/** Guard: response 401 bila belum login. */
export async function requireUser(req: NextRequest): Promise<
  { user: SessionUser; error: null } | { user: null; error: NextResponse }
> {
  const user = await getSessionUser(req)
  if (!user) {
    return {
      user: null,
      error: NextResponse.json(
        { ok: false, error: 'Silakan masuk dengan WhatsApp terlebih dahulu.' },
        { status: 401 },
      ),
    }
  }
  return { user, error: null }
}

/** Kode unik referensi, mis. RA-7F3K2Q. */
export function generateRefCode(prefix: string): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const buf = new Uint32Array(6)
  crypto.getRandomValues(buf)
  const rand = Array.from(buf, (n) => alphabet[n % alphabet.length]).join('')
  return `${prefix}-${rand}`
}
