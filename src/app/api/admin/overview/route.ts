import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireUser } from '@/lib/auth'
import { initialsOf, type AdminOverviewDTO } from '@/lib/marketplace'

export const dynamic = 'force-dynamic'

const KOMISI_RATE = 0.1 // bagian platform 10% — penjual menerima 90%

/**
 * GET /api/admin/overview — data ringkasan Dashboard Pemilik.
 * KPI pengguna, pesanan (GMV & komisi), listing, produk + aktivitas terbaru.
 */
export async function GET(req: NextRequest) {
  try {
    const { user, error } = await requireUser(req)
    if (error) return error
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ ok: false, error: 'Akses khusus admin.' }, { status: 403 })
    }

    const [
      userTotal,
      userBuyer,
      userSeller,
      userAdmin,
      orderTotal,
      orderMenunggu,
      orderDiproses,
      orderSelesai,
      orderDibatalkan,
      gmvAgg,
      listingTotal,
      listingPending,
      listingApproved,
      listingRejected,
      listingSold,
      productAgg,
      recentOrders,
      recentListings,
      recentUsers,
    ] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { role: 'BUYER' } }),
      db.user.count({ where: { role: 'SELLER' } }),
      db.user.count({ where: { role: 'ADMIN' } }),
      db.order.count(),
      db.order.count({ where: { status: 'MENUNGGU_PEMBAYARAN' } }),
      db.order.count({ where: { status: 'DIPROSES' } }),
      db.order.count({ where: { status: 'SELESAI' } }),
      db.order.count({ where: { status: 'DIBATALKAN' } }),
      db.order.aggregate({ where: { status: 'SELESAI' }, _sum: { amount: true } }),
      db.listing.count(),
      db.listing.count({ where: { status: 'PENDING' } }),
      db.listing.count({ where: { status: 'APPROVED' } }),
      db.listing.count({ where: { status: 'REJECTED' } }),
      db.listing.count({ where: { status: 'SOLD' } }),
      db.product.aggregate({ _sum: { sold: true } }),
      db.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 6,
        include: { buyer: { select: { name: true, phone: true } } },
      }),
      db.listing.findMany({
        orderBy: { createdAt: 'desc' },
        take: 6,
        include: { seller: { select: { name: true, phone: true } } },
      }),
      db.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 6,
        include: { _count: { select: { orders: true, listings: true } } },
      }),
    ])

    const gmv = gmvAgg._sum.amount ?? 0
    const data: AdminOverviewDTO = {
      users: { total: userTotal, buyer: userBuyer, seller: userSeller, admin: userAdmin },
      orders: {
        total: orderTotal,
        menunggu: orderMenunggu,
        diproses: orderDiproses,
        selesai: orderSelesai,
        dibatalkan: orderDibatalkan,
        gmv,
        komisi: Math.round(gmv * KOMISI_RATE),
      },
      listings: {
        total: listingTotal,
        pending: listingPending,
        approved: listingApproved,
        rejected: listingRejected,
        sold: listingSold,
      },
      products: { total: productAgg._sum.sold ?? 0, totalSold: productAgg._sum.sold ?? 0 },
      recentOrders: recentOrders.map((o) => ({
        id: o.id,
        code: o.code,
        productId: o.productId,
        productName: o.productName,
        amount: o.amount,
        quantity: o.quantity,
        status: o.status as AdminOverviewDTO['recentOrders'][number]['status'],
        createdAt: o.createdAt.toISOString(),
        buyerName: o.buyer.name,
        buyerPhone: o.buyer.phone,
        buyerInitials: initialsOf(o.buyer.name),
      })),
      recentListings: recentListings.map((l) => ({
        id: l.id,
        code: l.code,
        platform: l.platform,
        platformName: l.platform,
        title: l.title,
        description: l.description,
        price: l.price,
        followers: l.followers,
        level: l.level,
        status: l.status as AdminOverviewDTO['recentListings'][number]['status'],
        adminNote: l.adminNote,
        sellerName: l.seller.name,
        sellerInitials: initialsOf(l.seller.name),
        sellerVerified: true,
        createdAt: l.createdAt.toISOString(),
      })),
      recentUsers: recentUsers.map((u) => ({
        id: u.id,
        name: u.name,
        phone: u.phone,
        role: u.role as AdminOverviewDTO['recentUsers'][number]['role'],
        createdAt: u.createdAt.toISOString(),
        orderCount: u._count.orders,
        listingCount: u._count.listings,
      })),
    }

    return NextResponse.json({ ok: true, overview: data })
  } catch (e) {
    console.error('[API /api/admin/overview GET]', e)
    return NextResponse.json({ ok: false, error: 'Gagal memuat ringkasan.' }, { status: 500 })
  }
}
