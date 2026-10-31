import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import {
  getSessionUser,
  requireUser,
  generateRefCode,
  type SessionUser,
} from '@/lib/auth'
import { initialsOf, type ListingStatus, type SellerListingDTO } from '@/lib/marketplace'

export const dynamic = 'force-dynamic'

const LEVELS = ['FRESH', 'AMAN', 'PREMIUM', 'MONETIZE']
const MAX_LISTINGS_PER_SELLER = 50

function toListingDTO(
  l: {
    id: string
    code: string
    platform: string
    title: string
    description: string
    price: number
    followers: string | null
    level: string
    status: string
    adminNote: string | null
    createdAt: Date
    seller: { name: string | null; phone: string }
  },
  viewerIsOwnerOrAdmin: boolean,
): SellerListingDTO {
  const approved = l.status === 'APPROVED'
  return {
    id: l.id,
    code: l.code,
    platform: l.platform,
    platformName: l.platform,
    title: l.title,
    description: l.description,
    price: l.price,
    followers: l.followers,
    level: l.level,
    status: l.status as ListingStatus,
    adminNote: viewerIsOwnerOrAdmin ? l.adminNote : null,
    sellerName: approved || viewerIsOwnerOrAdmin ? l.seller.name : null,
    sellerInitials: initialsOf(l.seller.name),
    sellerVerified: true,
    createdAt: l.createdAt.toISOString(),
  }
}

/**
 * GET /api/listings
 * - Tanpa params: listing APPROVED (publik, untuk "Dari Penjual Terverifikasi")
 * - ?mine=1   : listing milik penjual yang sedang login (semua status)
 * - ?admin=1  : semua listing (khusus ADMIN), filter ?status=PENDING|APPROVED|REJECTED|SOLD
 */
export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams
    const mine = sp.get('mine') === '1'
    const admin = sp.get('admin') === '1'
    const user = await getSessionUser(req)

    if (admin) {
      if (!user || user.role !== 'ADMIN') {
        return NextResponse.json({ ok: false, error: 'Akses khusus admin.' }, { status: 403 })
      }
      const status = sp.get('status')
      const where: Record<string, string> = {}
      if (status && ['PENDING', 'APPROVED', 'REJECTED', 'SOLD'].includes(status)) {
        where.status = status
      }
      const [total, rows] = await Promise.all([
        db.listing.count({ where }),
        db.listing.findMany({
          where,
          orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
          take: 100,
          include: { seller: { select: { name: true, phone: true } } },
        }),
      ])
      return NextResponse.json({
        ok: true,
        total,
        listings: rows.map((l) => toListingDTO(l, true)),
      })
    }

    if (mine) {
      const { user, error } = await requireUser(req)
      if (error) return error
      const [total, rows] = await Promise.all([
        db.listing.count({ where: { sellerId: user.id } }),
        db.listing.findMany({
          where: { sellerId: user.id },
          orderBy: { createdAt: 'desc' },
          take: MAX_LISTINGS_PER_SELLER,
          include: { seller: { select: { name: true, phone: true } } },
        }),
      ])
      return NextResponse.json({
        ok: true,
        total,
        listings: rows.map((l) => toListingDTO(l, true)),
      })
    }

    // publik: hanya yang disetujui admin
    const limit = Math.min(Number(sp.get('limit') ?? 8) || 8, 24)
    const [total, rows] = await Promise.all([
      db.listing.count({ where: { status: 'APPROVED' } }),
      db.listing.findMany({
        where: { status: 'APPROVED' },
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: { seller: { select: { name: true, phone: true } } },
      }),
    ])
    return NextResponse.json({
      ok: true,
      total,
      listings: rows.map((l) => toListingDTO(l, false)),
    })
  } catch (e) {
    console.error('[API /api/listings GET]', e)
    return NextResponse.json({ ok: false, error: 'Gagal memuat listing.' }, { status: 500 })
  }
}

/**
 * DELETE /api/listings?id=... — penjual menarik listing miliknya sendiri.
 * Hanya listing PENDING / REJECTED yang boleh ditarik (APPROVED/SOLD lewat admin).
 * -> { ok, deleted: true }
 */
export async function DELETE(req: NextRequest) {
  try {
    const { user, error } = await requireUser(req)
    if (error) return error

    const id = req.nextUrl.searchParams.get('id')?.trim() ?? ''
    if (!id) {
      return NextResponse.json({ ok: false, error: 'ID listing wajib.' }, { status: 400 })
    }

    const listing = await db.listing.findUnique({ where: { id } })
    if (!listing || listing.sellerId !== user.id) {
      return NextResponse.json({ ok: false, error: 'Listing tidak ditemukan.' }, { status: 404 })
    }
    if (listing.status !== 'PENDING' && listing.status !== 'REJECTED') {
      return NextResponse.json(
        { ok: false, error: 'Listing yang sudah tayang/terjual hanya bisa dihapus admin.' },
        { status: 400 },
      )
    }

    await db.listing.delete({ where: { id } })
    return NextResponse.json({ ok: true, deleted: true })
  } catch (e) {
    console.error('[API /api/listings DELETE]', e)
    return NextResponse.json({ ok: false, error: 'Gagal menarik listing.' }, { status: 500 })
  }
}

/**
 * POST /api/listings — penjual mendaftarkan akun untuk dijual.
 * Body: { platform, title, description, price, followers?, level? }
 * -> status PENDING (menunggu kurasi admin). Pembeli otomatis dipromosikan jadi SELLER.
 */
export async function POST(req: NextRequest) {
  try {
    const { user, error } = await requireUser(req)
    if (error) return error

    const body = (await req.json().catch(() => ({}))) as {
      platform?: string
      title?: string
      description?: string
      price?: number
      followers?: string
      level?: string
    }

    const platform = (body.platform ?? '').trim().slice(0, 40)
    const title = (body.title ?? '').trim().slice(0, 120)
    const description = (body.description ?? '').trim().slice(0, 1200)
    const price = Math.round(Number(body.price ?? 0))
    const followers = (body.followers ?? '').trim().slice(0, 30) || null
    const level = LEVELS.includes((body.level ?? '').toUpperCase())
      ? (body.level as string).toUpperCase()
      : 'AMAN'

    if (!platform || !title || title.length < 6 || !description || description.length < 20) {
      return NextResponse.json(
        {
          ok: false,
          error:
            'Lengkapi data: platform, judul (min. 6 huruf), dan deskripsi (min. 20 huruf).',
        },
        { status: 400 },
      )
    }
    if (!Number.isFinite(price) || price < 5000 || price > 500_000_000) {
      return NextResponse.json(
        { ok: false, error: 'Harga harus antara Rp 5.000 - Rp 500.000.000.' },
        { status: 400 },
      )
    }

    const existingCount = await db.listing.count({ where: { sellerId: user.id } })
    if (existingCount >= MAX_LISTINGS_PER_SELLER) {
      return NextResponse.json(
        { ok: false, error: 'Kuota listing tercapai. Hubungi admin untuk menambah.' },
        { status: 400 },
      )
    }

    const [created, _platformRow] = await Promise.all([
      db.listing.create({
        data: {
          code: generateRefCode('RA'),
          sellerId: user.id,
          platform,
          title,
          description,
          price,
          followers,
          level,
          status: 'PENDING',
        },
        include: { seller: { select: { name: true, phone: true } } },
      }),
      db.category.findFirst({ where: { slug: platform } }),
    ])

    // Promosi otomatis: pembeli yang mendaftarkan akun menjadi penjual
    let effectiveUser: SessionUser = user
    if (user.role === 'BUYER') {
      const updated = await db.user.update({
        where: { id: user.id },
        data: { role: 'SELLER' },
      })
      effectiveUser = { ...user, role: (updated.role as SessionUser['role']) ?? 'SELLER' }
    }

    return NextResponse.json({
      ok: true,
      listing: toListingDTO(created, true),
      user: effectiveUser,
    })
  } catch (e) {
    console.error('[API /api/listings POST]', e)
    return NextResponse.json(
      { ok: false, error: 'Gagal mendaftarkan akun. Coba lagi ya.' },
      { status: 500 },
    )
  }
}
