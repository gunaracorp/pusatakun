/**
 * PUSATAKUN — Kamus istilah jual beli akun (glosarium untuk SEO/AEO).
 * Dipakai halaman /kamus. Mesin pencari AI suka definisi yang ringkas & tegas.
 */

export type KamusEntry = {
  term: string
  category: 'Istilah Akun' | 'Keamanan' | 'Transaksi' | 'Sosial Media'
  definition: string
  detail?: string
}

export const KAMUS_CATEGORIES = [
  'Istilah Akun',
  'Keamanan',
  'Transaksi',
  'Sosial Media',
] as const

export const KAMUS: KamusEntry[] = [
  {
    term: 'FRESH',
    category: 'Istilah Akun',
    definition:
      'Label level untuk akun baru atau minim riwayat pemakaian. Harga paling terjangkau, riwayat bersih, tetapi butuh pola pemakaian wajar di minggu-minggu awal.',
    detail:
      'Cocok untuk starter yang ingin membangun akun sendiri dari dasar. Hindari aktivitas agresif (follow massal, posting tautan beruntun) di fase ini.',
  },
  {
    term: 'AMAN',
    category: 'Istilah Akun',
    definition:
      'Level akun dengan riwayat bersih dari pelanggaran, data pemulihan lengkap, dan pola login normal. Pilihan standar mayoritas pembeli.',
    detail:
      'Umurnya biasanya sudah beberapa bulan sehingga tidak dianggap akun baru oleh algoritma platform. Titik terbaik antara harga dan risiko.',
  },
  {
    term: 'PREMIUM',
    category: 'Istilah Akun',
    definition:
      'Level akun berumur lebih tua dengan kredibilitas tinggi dan interaksi organik yang konsisten. Dipakai bisnis yang butuh kepercayaan sejak hari pertama.',
  },
  {
    term: 'MONETIZE',
    category: 'Istilah Akun',
    definition:
      'Level akun yang sudah memenuhi syarat monetisasi platform — langsung bisa menghasilkan tanpa menunggu periode syarat kreator.',
    detail:
      'Monetisasi terikat identitas; pastikan proses transfer data pemulihan tuntas dan tanyakan riwayat pembayaran kreatornya ke admin.',
  },
  {
    term: 'PVA (Phone Verified Account)',
    category: 'Istilah Akun',
    definition:
      'Akun yang telah diverifikasi dengan nomor telepon asli saat pendaftaran. Umumnya lebih stabil dan lebih mudah dipulihkan bila kehilangan akses.',
  },
  {
    term: 'Aged Account',
    category: 'Istilah Akun',
    definition:
      'Istilah umum untuk akun berumur (biasanya 6 bulan ke atas). Semakin tua umur akun yang terawat, semakin dipercaya oleh algoritma platform.',
  },
  {
    term: 'Ready Stok',
    category: 'Transaksi',
    definition:
      'Status ketersediaan akun yang bisa langsung diserahkan tanpa menunggu. Di Pusatakun, stok ready dikirim 5-15 menit setelah pembayaran dikonfirmasi.',
  },
  {
    term: 'Kurasi',
    category: 'Keamanan',
    definition:
      'Proses penilaian manual oleh admin terhadap setiap listing sebelum tayang: bukti kepemilikan, riwayat akun, kesesuaian harga, dan kelengkapan data.',
    detail:
      'Kurasi Pusatakun maksimal 1x24 jam. Listing yang tidak bisa diverifikasi ditolak — ini lapisan perlindungan pertama pembeli.',
  },
  {
    term: 'Listing',
    category: 'Transaksi',
    definition:
      'Iklan jualan satu akun yang didaftarkan penjual: judul, harga, level, spesifikasi, dan deskripsi. Satu listing = satu akun.',
  },
  {
    term: 'Escrow',
    category: 'Keamanan',
    definition:
      'Mekanisme penahanan dana oleh pihak netral: dana pembeli ditahan sistem dan baru dilepas ke penjual setelah akun diterima dan terkonfirmasi.',
    detail:
      'Escrow memutus dilema "bayar dulu atau serah dulu". Jika akun tidak sesuai deskripsi sebelum konfirmasi, dana dapat dikembalikan sesuai bukti.',
  },
  {
    term: 'Klaim Garansi',
    category: 'Transaksi',
    definition:
      'Proses mengajukan penggantian akun atau pengembalian dana saat akun bermasalah di dalam masa garansi, dengan bukti video unboxing.',
    detail:
      'Alur klaim: chat admin dengan kode pesanan + video unboxing → admin verifikasi → ganti akun baru atau refund sesuai kebijakan halaman Garansi.',
  },
  {
    term: 'Masa Garansi',
    category: 'Transaksi',
    definition:
      'Jangka waktu perlindungan tertulis yang tercantum di setiap halaman produk (mis. 30 hari). Selama masa ini, masalah akses akun ditanggung platform.',
    detail:
      'Cek status garansimu kapan saja lewat halaman Cek Garansi cukup dengan kode pesanan — tanpa perlu chat admin.',
  },
  {
    term: 'Video Unboxing',
    category: 'Keamanan',
    definition:
      'Rekaman layar dari proses menerima kredensial, login pertama, ganti email/kata sandi, sampai mengaktifkan 2FA. Ini bukti utama klaim garansi.',
  },
  {
    term: 'OTP',
    category: 'Keamanan',
    definition:
      'One-Time Password — kode 6 digit sekali pakai yang dikirim via WhatsApp untuk login di Pusatakun. Berlaku beberapa menit dan tidak boleh dibagikan.',
  },
  {
    term: '2FA (Two-Factor Authentication)',
    category: 'Keamanan',
    definition:
      'Lapisan keamanan kedua selain kata sandi: kode verifikasi tambahan saat login dari perangkat baru. Wajib diaktifkan segera setelah membeli akun.',
  },
  {
    term: 'Email Resolver',
    category: 'Istilah Akun',
    definition:
      'Kemampuan meneruskan akses email terdaftar akun kepada pembeli — bagian penting transfer kepemilikan penuh, bukan sekadar ganti kata sandi.',
  },
  {
    term: 'Shadowban',
    category: 'Sosial Media',
    definition:
      'Pembatasan jangkauan tanpa pemberitahuan: akun tampak normal, tetapi kontennya tidak muncul di eksplorasi, hashtag, atau rekomendasi.',
    detail:
      'Cek tanda-tandanya di blog Pusatakun: reach anjlok mendadak, konten tak terindeks hashtag, dan sumber kunjungan eksplorasi nyaris nol.',
  },
  {
    term: 'Reach',
    category: 'Sosial Media',
    definition:
      'Jumlah akun unik yang melihat kontenmu. Metrik utama untuk menilai kesehatan akun — jauh lebih jujur daripada jumlah follower.',
  },
  {
    term: 'Engagement Rate',
    category: 'Sosial Media',
    definition:
      'Rasio interaksi (likes, komentar, simpan, bagikan) terhadap follower atau reach. Rasio sehat akun biasa berkisar 1-5%.',
    detail:
      'ER sangat rendah pada follower besar mengindikasikan follower mati/bot atau pembatasan jangkauan.',
  },
  {
    term: 'Follower Organik',
    category: 'Sosial Media',
    definition:
      'Pengikut yang datang sendiri karena konten — bukan hasil beli atau bot. Follower organik adalah aset utama yang menaikkan harga akun.',
  },
  {
    term: 'Komisi 90/10',
    category: 'Transaksi',
    definition:
      'Model bagi hasil Pusatakun: penjual menerima 90% harga jual, platform 10%. Tanpa biaya pendaftaran dan tanpa biaya listing.',
  },
  {
    term: 'Kupon',
    category: 'Transaksi',
    definition:
      'Kode potongan harga yang disebutkan ke admin saat checkout (mis. PUSATA40 untuk flash sale). Berlaku pada periode promo tertentu.',
  },
  {
    term: 'Cold Account',
    category: 'Istilah Akun',
    definition:
      'Akun yang lama tidak dipakai sehingga aktivitasnya "dingin". Perlu pemanasan bertahap (posting rutin, interaksi wajar) sebelum dipakai agresif.',
  },
  {
    term: 'Refund',
    category: 'Transaksi',
    definition:
      'Pengembalian dana kepada pembeli — terjadi saat klaim garansi disetujui atau pesanan dibatalkan sesuai ketentuan.',
  },
]

export function searchKamus(query: string): KamusEntry[] {
  const q = query.trim().toLowerCase()
  if (!q) return KAMUS
  return KAMUS.filter(
    (e) =>
      e.term.toLowerCase().includes(q) ||
      e.definition.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q),
  )
}
