import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()

async function main() {
  const count = await db.faq.count()
  const faqs = [
    {
      question: 'Bagaimana cara daftar atau login sebagai pembeli di Pusatakun?',
      answer:
        'Klik tombol Masuk di kanan atas, pilih Masuk dengan WhatsApp, lalu masukkan nomor WhatsApp aktif kamu. Kode verifikasi 6 digit akan dikirim ke WhatsApp kamu, tinggal masukkan kodenya dan akun pembeli kamu langsung aktif. Sebagai pembeli kamu bisa melihat riwayat pesanan, checkout dibantu admin 24/7 via WhatsApp, dan setiap transaksi bergaransi penuh.',
      order: 100,
    },
    {
      question: 'Bagaimana cara mendaftar sebagai penjual akun di Pusatakun?',
      answer:
        'Masuk dengan WhatsApp seperti biasa, lalu pilih peran Penjual saat pendaftaran (atau ubah peran dari menu akun). Buka Dashboard Penjual, isi form Daftarkan Akun: pilih platform, judul, harga, jumlah follower, dan deskripsi akun. Tim admin akan mengkurasi listing kamu (maksimal 1x24 jam), setelah disetujui akunmu langsung tayang di katalog dan pembeli bisa menghubungimu. Komisi penjual transparan tanpa biaya pendaftaran.',
      order: 101,
    },
  ]
  for (const faq of faqs) {
    const exists = await db.faq.findFirst({ where: { question: faq.question } })
    if (!exists) await db.faq.create({ data: faq })
  }
  console.log('FAQ total:', count, '->', await db.faq.count())
}
main().finally(() => db.$disconnect())
