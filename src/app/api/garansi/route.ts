import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * GET /api/garansi?code=ORD-XXXX — cek masa garansi pesanan.
 * Masa garansi dihitung dari tanggal pesanan berstatus SELESAI (akun diterima)
 * + jumlah hari garansi produk. Pesanan belum selesai => garansi belum aktif.
 */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')?.trim().toUpperCase() ?? ''

  if (!code || code.length < 4 || code.length > 24) {
    return NextResponse.json(
      { ok: false, error: 'Format kode pesanan tidak valid. Contoh: ORD-A1B2C3.' },
      { status: 400 },
    )
  }

  const order = await db.order.findUnique({
    where: { code },
    select: {
      code: true,
      status: true,
      productName: true,
      amount: true,
      createdAt: true,
      updatedAt: true,
      productId: true,
    },
  })

  if (!order) {
    return NextResponse.json(
      {
        ok: false,
        error:
          'Kode pesanan tidak ditemukan. Periksa kembali kode pesananmu atau hubungi admin via WhatsApp.',
      },
      { status: 404 },
    )
  }

  // Ambil masa garansi produk (teks seperti "Garansi Full 30 Hari")
  let warrantyLabel = 'Sesuai ketentuan halaman produk'
  let warrantyDays: number | null = null
  if (order.productId) {
    const product = await db.product.findUnique({
      where: { id: order.productId },
      select: { warranty: true },
    })
    if (product) {
      warrantyLabel = product.warranty
      const match = product.warranty.match(/(\d+)\s*Hari/i)
      if (match) warrantyDays = Number(match[1])
    }
  }

  const DAY_MS = 24 * 60 * 60 * 1000
  const now = Date.now()
  let status: 'BELUM_AKTIF' | 'AKTIF' | 'HABIS' = 'BELUM_AKTIF'
  let startDate: string | null = null
  let endDate: string | null = null
  let sisaHari: number | null = null
  let progress: number | null = null

  if (order.status === 'SELESAI' && warrantyDays !== null) {
    const start = order.updatedAt.getTime()
    const end = start + warrantyDays * DAY_MS
    startDate = order.updatedAt.toISOString()
    endDate = new Date(end).toISOString()
    sisaHari = Math.max(0, Math.ceil((end - now) / DAY_MS))
    status = now <= end ? 'AKTIF' : 'HABIS'
    progress = Math.min(
      100,
      Math.max(0, Math.round(((now - start) / Math.max(1, end - start)) * 100)),
    )
  } else if (order.status === 'SELESAI') {
    // Selesai tapi garansi produk tak terbaca -> aktif tanpa hitungan hari
    status = 'AKTIF'
    startDate = order.updatedAt.toISOString()
  }

  return NextResponse.json({
    ok: true,
    warranty: {
      code: order.code,
      productName: order.productName,
      amount: order.amount,
      orderStatus: order.status,
      warrantyLabel,
      warrantyDays,
      status,
      startDate,
      endDate,
      sisaHari,
      progress,
    },
  })
}
