import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()

async function main() {
  // Beri identitas ramah untuk akun penjual contoh
  await db.user.update({
    where: { phone: '6281239991001' },
    data: { name: 'Raka Pratama' },
  })

  const seller = await db.user.findUnique({ where: { phone: '6281239991001' } })
  if (!seller) throw new Error('seller tidak ada')

  // Rapikan listing uji + tambah 2 contoh tayang
  await db.listing.update({
    where: { code: 'RA-W5E8PF' },
    data: { title: 'Akun IG Aman 5K Follower Niche Kuliner', adminNote: null },
  })

  const samples = [
    {
      code: 'RA-D7K2MQ',
      platform: 'tiktok',
      title: 'Akun TikTok 18K Follower FYP Konsisten',
      description: 'Akun TikTok aktif dengan 18 ribu follower, rata-rata views 8-15K per video, riwayat konten bersih tanpa strike. Cocok untuk live shopping dan endorse. Data lengkap: email akses penuh, siap ganti username.',
      price: 950000,
      followers: '18K',
      level: 'PREMIUM',
      status: 'APPROVED',
    },
    {
      code: 'RA-M9X4TR',
      platform: 'game',
      title: 'Akun Mobile Legends Mythic Full Skin Khas',
      description: 'Akun MLBB Mythic 152 bintang, 68 skin termasuk 3 skin collector, bound ke email sendiri yang ikut diserahkan. Rank bersih, siap push Mythical Glory di tangan baru.',
      price: 1450000,
      followers: null,
      level: 'MONETIZE',
      status: 'APPROVED',
    },
  ]
  for (const s of samples) {
    const exists = await db.listing.findUnique({ where: { code: s.code } })
    if (!exists) {
      await db.listing.create({ data: { ...s, sellerId: seller.id } })
    }
  }
  console.log('listings approved:', await db.listing.count({ where: { status: 'APPROVED' } }))
}
main().finally(() => db.$disconnect())
