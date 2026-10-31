/**
 * SEED DATA DEMO — Dashboard (Pembeli, Penjual, Pemilik)
 * ======================================================
 * Mengisi pengguna, listing, dan pesanan demo agar ketiga dashboard
 * terlihat hidup. Idempoten: hapus data demo lama (berdasarkan nomor WA
 * demo) sebelum membuat ulang. Data produk/kategori/testimoni asli tidak
 * disentuh.
 *
 * Jalankan: bun prisma/scripts/seed-demo-dashboard.ts
 */
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const DEMO_PHONES = ['628111000001', '628111000002', '628111000003', '628111000004']

async function main() {
  console.log('→ Membersihkan data demo lama…')
  await db.order.deleteMany({ where: { buyer: { phone: { in: DEMO_PHONES } } } })
  await db.listing.deleteMany({ where: { seller: { phone: { in: DEMO_PHONES } } } })
  await db.user.deleteMany({ where: { phone: { in: DEMO_PHONES } } })

  console.log('→ Membuat pengguna demo…')
  const [budi, sari, dewa] = await Promise.all([
    db.user.create({ data: { phone: DEMO_PHONES[0], name: 'Budi Santoso', role: 'BUYER' } }),
    db.user.create({ data: { phone: DEMO_PHONES[1], name: 'Sari Melati', role: 'BUYER' } }),
    db.user.create({ data: { phone: DEMO_PHONES[2], name: 'Dewa Jualan', role: 'SELLER' } }),
  ])

  // Pastikan pemilik situs (nomor WA resmi) terdaftar sebagai ADMIN dengan nama
  const owner = await db.user.upsert({
    where: { phone: '6281316516524' },
    update: { role: 'ADMIN', name: 'Rajaakun2026' },
    create: { phone: '6281316516524', name: 'Rajaakun2026', role: 'ADMIN' },
  })
  void owner

  console.log('→ Membuat listing demo (milik Dewa Jualan)…')
  const listingDefs = [
    {
      code: 'RA-DEMO01',
      platform: 'instagram',
      title: 'Akun IG Aman 12K Follower Niche Kuliner',
      description:
        'Akun Instagram niche kuliner dengan 12K follower aktif Indonesia. Engagement 4-6%, email ikutan lengkap, riwayat bersih tanpa pelanggaran. Siap transfer penuh.',
      price: 450000,
      followers: '12.5K',
      level: 'AMAN',
      status: 'PENDING',
    },
    {
      code: 'RA-DEMO02',
      platform: 'tiktok',
      title: 'Akun TikTok 45K Follower Siap Viral Niche Komedi',
      description:
        'Akun TikTok 45K follower, 2 video jutaan views. Umur 8 bulan, email ikutan, tanpa strike. Cocok untuk promosi jasa atau affiliate.',
      price: 850000,
      followers: '45K',
      level: 'AMAN',
      status: 'APPROVED',
    },
    {
      code: 'RA-DEMO03',
      platform: 'youtube',
      title: 'Channel YouTube 3K Subscriber Monetisasi Ready',
      description:
        'Channel YouTube 3K subscriber, 400 jam tontonan terpenuhi, sudah mengajukan monetisasi. Konten gaming, riwayat bersih, email lengkap.',
      price: 1200000,
      followers: '3K',
      level: 'MONETIZE',
      status: 'APPROVED',
    },
    {
      code: 'RA-DEMO04',
      platform: 'twitter',
      title: 'Akun X Aged 2015 Username 4 Huruf',
      description:
        'Akun X (Twitter) umur 9 tahun, username pendek 4 huruf, follower 800 organik. Email ikutan bisa diikuti, riwayat aman.',
      price: 650000,
      followers: '800',
      level: 'PREMIUM',
      status: 'REJECTED',
      adminNote:
        'Deskripsi kurang lengkap — sertakan screenshot engagement & pastikan email ikutan bisa ditransfer.',
    },
    {
      code: 'RA-DEMO05',
      platform: 'instagram',
      title: 'Akun IG Fanpage 28K Follower Niche Otomotif',
      description:
        'Fanpage IG otomotif 28K follower organik. Engagement tinggi 5-8%, pernah kolaborasi bengkel lokal. Data login lengkap, garansi penuh.',
      price: 1100000,
      followers: '28K',
      level: 'AMAN',
      status: 'SOLD',
    },
    {
      code: 'RA-DEMO06',
      platform: 'game',
      title: 'Akun Mobile Legends Mythic Glory 60 Hero',
      description:
        'Akun ML rank Mythic Glory, 60 hero, 45 skin termasuk 3 skin Collector. Bound Google+Moonton bisa pindah penuh, second phone sudah dihapus.',
      price: 750000,
      followers: null,
      level: 'PREMIUM',
      status: 'SOLD',
    },
  ]
  const now = Date.now()
  const daysAgo = (d: number) => new Date(now - d * 24 * 60 * 60 * 1000)

  for (const [i, l] of listingDefs.entries()) {
    await db.listing.create({
      data: {
        code: l.code,
        sellerId: dewa.id,
        platform: l.platform,
        title: l.title,
        description: l.description,
        price: l.price,
        followers: l.followers,
        level: l.level,
        status: l.status,
        adminNote: 'adminNote' in l ? (l.adminNote as string) : null,
        createdAt: daysAgo(10 - i),
        updatedAt: daysAgo(9 - i),
      },
    })
  }

  console.log('→ Membuat pesanan demo…')
  const orderDefs = [
    {
      buyerId: budi.id,
      code: 'ORD-DEMO01',
      productName: 'Akun Instagram AMAN — Follower Aktif Indonesia',
      amount: 85000,
      quantity: 1,
      status: 'SELESAI',
      createdAt: daysAgo(9),
    },
    {
      buyerId: budi.id,
      code: 'ORD-DEMO02',
      productName: 'Akun TikTok AMAN — 1K-5K Follower Aktif',
      amount: 65000,
      quantity: 2,
      status: 'SELESAI',
      createdAt: daysAgo(6),
    },
    {
      buyerId: budi.id,
      code: 'ORD-DEMO03',
      productName: 'Akun YouTube PREMIUM — Monetisasi Ready',
      amount: 450000,
      quantity: 1,
      status: 'DIPROSES',
      createdAt: daysAgo(2),
    },
    {
      buyerId: sari.id,
      code: 'ORD-DEMO04',
      productName: 'Akun Instagram FRESH — Siap Pakai Niche Bebas',
      amount: 35000,
      quantity: 1,
      status: 'MENUNGGU_PEMBAYARAN',
      createdAt: daysAgo(1),
    },
    {
      buyerId: sari.id,
      code: 'ORD-DEMO05',
      productName: 'Akun Telegram AMAN — Channel 2K Member',
      amount: 150000,
      quantity: 1,
      status: 'SELESAI',
      createdAt: daysAgo(4),
    },
    {
      buyerId: sari.id,
      code: 'ORD-DEMO06',
      productName: 'Akun Discord AMAN — Token Aged 2019',
      amount: 75000,
      quantity: 1,
      status: 'DIBATALKAN',
      createdAt: daysAgo(3),
    },
  ]
  for (const o of orderDefs) {
    await db.order.create({ data: o })
  }

  const gmv = orderDefs.filter((o) => o.status === 'SELESAI').reduce((s, o) => s + o.amount, 0)
  console.log('')
  console.log('✅ SEED DEMO DASHBOARD SELESAI')
  console.log(`   Pengguna : ${DEMO_PHONES.length} demo + pemilik`)
  console.log(`   Listing  : ${listingDefs.length} (milik Dewa Jualan)`)
  console.log(`   Pesanan  : ${orderDefs.length} (GMV selesai: Rp ${gmv.toLocaleString('id-ID')})`)
  console.log('')
  console.log('   Akun demo untuk QA (login OTP mode demo):')
  console.log('   Pembeli : 0811-1000-0001 (Budi) / 0811-1000-0002 (Sari)')
  console.log('   Penjual : 0811-1000-0003 (Dewa Jualan)')
  console.log('   Pemilik : 0813-1651-6524 (Rajaakun2026, ADMIN otomatis)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
