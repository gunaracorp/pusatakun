import { NextRequest, NextResponse } from 'next/server'
import { SITE } from '@/lib/marketplace'

/**
 * IndexNow — protokol instant-indexing (Bing, Yandex, Naver, Seznam, Yep).
 *
 * Cara pakai setelah deploy ke https://pusatakun.web.id:
 *   1. Ping semua halaman inti:
 *      GET /api/indexnow?key=<INDEXNOW_KEY>
 *   2. Ping satu URL (mis. produk baru):
 *      GET /api/indexnow?key=<INDEXNOW_KEY>&url=https://pusatakun.web.id/produk/<slug>
 *
 * INDEXNOW_KEY = isi file public/2ee06ab558c32234ba2d2f5308197a00.txt.
 * Pemilik situs (rajaakun2026) memanggil endpoint ini setiap kali katalog berubah
 * agar mesin pencari mengindeks ulang dalam hitungan menit, bukan hari.
 */

const INDEXNOW_KEY_FILE = '2ee06ab558c32234ba2d2f5308197a00'
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow'

const CORE_PATHS = [
  '/',
  '/katalog',
  '/pusat-bantuan',
  '/garansi',
  '/tentang',
  '/kontak',
  '/masuk',
  '/daftar',
  '/syarat-ketentuan',
  '/kebijakan-privasi',
]

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get('key')?.trim()
  const singleUrl = request.nextUrl.searchParams.get('url')?.trim()

  if (!key || key !== INDEXNOW_KEY_FILE) {
    return NextResponse.json(
      { ok: false, error: 'Key IndexNow tidak valid. Key = nama file di /public.' },
      { status: 403 },
    )
  }

  const urlList = singleUrl
    ? [singleUrl]
    : CORE_PATHS.map((path) => `${SITE.url}${path}`)

  // Validasi URL milik sendiri
  const bad = urlList.find((u) => !u.startsWith(`${SITE.url}/`) && u !== SITE.url)
  if (bad) {
    return NextResponse.json(
      { ok: false, error: `URL di luar domain ${SITE.domain}: ${bad}` },
      { status: 422 },
    )
  }

  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: SITE.domain,
        key,
        keyLocation: `${SITE.url}/${INDEXNOW_KEY_FILE}.txt`,
        urlList,
      }),
      signal: AbortSignal.timeout(10_000),
    })

    // 200/202 = diterima; 400-422 = payload salah; 429 = throttled
    return NextResponse.json(
      {
        ok: res.ok || res.status === 202,
        status: res.status,
        submitted: urlList.length,
        note:
          res.ok || res.status === 202
            ? 'URL diterima IndexNow — indeks ulang berjalan dalam hitungan menit.'
            : 'IndexNow menolak/dibatasi — coba lagi nanti.',
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Gagal menghubungi api.indexnow.org (jaringan/timeout).',
        detail: error instanceof Error ? error.message : 'unknown',
      },
      { status: 502 },
    )
  }
}
