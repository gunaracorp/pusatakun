/**
 * PUSATAKUN — Data artikel blog (konten edukasi untuk SEO & AEO).
 * Server-safe: artikel dipakai /blog (index) dan /blog/[slug] (detail).
 */

export type BlogSection = {
  heading: string
  paragraphs: string[]
  bullets?: string[]
}

export type BlogFaq = { q: string; a: string }

export type BlogArticle = {
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  readMinutes: number
  author: string
  tags: string[]
  intro: string
  sections: BlogSection[]
  conclusion: string
  faqs: BlogFaq[]
}

export const BLOG_CATEGORIES = [
  'Panduan Pembeli',
  'Panduan Penjual',
  'Keamanan',
  'Tips & Trik',
  'Insight Pasar',
] as const

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    slug: 'cara-aman-membeli-akun-instagram',
    title: '7 Langkah Aman Membeli Akun Instagram di 2026',
    excerpt:
      'Panduan lengkap dari pemilihan penjual tepercaya sampai serah terima akun — supaya dana kamu aman dan akun yang dibeli benar-benar sesuai iklan.',
    category: 'Panduan Pembeli',
    date: '2026-10-12',
    readMinutes: 7,
    author: 'Tim Pusatakun',
    tags: ['instagram', 'panduan beli', 'keamanan'],
    intro:
      'Membeli akun Instagram sebenarnya proses yang sederhana — asalkan urutan langkahnya benar. Kebanyakan kasus penipuan terjadi bukan karena pembelinya naif, tetapi karena langkah penting dilewati: dana dikirim langsung ke penjual, bukti kepemilikan tidak dicek, dan serah terima tidak didokumentasikan. Artikel ini merangkum 7 langkah yang tim kurasi Pusatakun terapkan setiap hari pada ratusan transaksi.',
    sections: [
      {
        heading: '1. Tentukan kebutuhan, bukan sekadar harga',
        paragraphs: [
          'Akun termurah hampir selalu punya alasan: follower bot, riwayat shadowban, atau data login yang tidak disertakan. Tentukan dulu tujuan pemakaian — jualan, monetisasi, atau branding pribadi — lalu pilih level akun yang cocok.',
        ],
        bullets: [
          'FRESH: akun baru, harga paling ringan, cocok untuk starter.',
          'AMAN: riwayat bersih, cocok untuk pemakaian jangka menengah.',
          'PREMIUM: umur akun lebih tua dan kredibilitas tinggi.',
          'MONETIZE: siap monetisasi tanpa menunggu syarat platform.',
        ],
      },
      {
        heading: '2. Pastikan transaksi lewat escrow, bukan transfer langsung',
        paragraphs: [
          'Escrow artinya dana kamu ditahan pihak ketiga (di Pusatakun: sistem admin) dan baru dilepas setelah akun benar-benar diterima dan terverifikasi. Penjual yang menolak escrow biasanya sedang menghindari masa verifikasi — ini red flag paling klasik.',
        ],
      },
      {
        heading: '3. Minta bukti kepemilikan asli',
        paragraphs: [
          'Penjual wajib menunjukkan bahwa ia benar pemilik akun: screenshot dari dalam akun (bukan dari profil publik), email terdaftar yang bisa diteruskan ke kamu, dan riwayat perangkat login. Di Pusatakun, bukti ini bagian dari kurasi wajib sebelum listing tayang.',
        ],
      },
      {
        heading: '4. Rekam video sejak login pertama',
        paragraphs: [
          'Video unboxing adalah asuransimu. Rekam layar mulai dari menerima kredensial, login, ganti email dan kata sandi, sampai mengaktifkan 2FA. Kalau suatu hari ada klaim pemilik asli atau akun bermasalah, video ini adalah bukti garansimu.',
        ],
      },
      {
        heading: '5. Ganti semua kredensial di 15 menit pertama',
        paragraphs: [
          'Email, kata sandi, nomor pemulihan — semua diganti sebelum kamu menyelesaikan pesanan. Aktifkan two-factor authentication (2FA) dan cek menu "akses pihak ketiga" untuk mencabut izin aplikasi yang tidak kamu kenal.',
        ],
      },
      {
        heading: '6. Manfaatkan masa garansi',
        paragraphs: [
          'Setiap akun di Pusatakun mencantumkan masa garansi di halaman produknya. Simpan kode pesananmu — kamu bisa mengecek status garansi kapan saja lewat halaman Cek Garansi tanpa perlu chat admin.',
        ],
      },
      {
        heading: '7. Bangun relasi jangka panjang dengan satu marketplace',
        paragraphs: [
          'Pembeli yang konsisten mendapat prioritas: notifikasi stok baru, harga langganan, dan proses klaim yang jauh lebih cepat karena riwayat transaksinya lengkap. Ini alasan reseller profesional tidak berpindah-pindah tempat.',
        ],
      },
    ],
    conclusion:
      'Intinya: escrow, bukti kepemilikan, video unboxing, dan ganti kredensial. Empat kebiasaan ini menutup 99% risiko jual beli akun. Sisanya biar tim kurasi Pusatakun yang jaga 24/7.',
    faqs: [
      {
        q: 'Apakah beli akun Instagram legal di Indonesia?',
        a: 'Jual beli akun bukan tindakan yang dilarang hukum Indonesia, tetapi setiap platform memiliki ketentuan layanannya masing-masing. Pusatakun menyarankan pemakaian sesuai kebijakan platform dan memisahkan akun bisnis dari akun pribadi.',
      },
      {
        q: 'Berapa lama proses serah terima akun?',
        a: 'Untuk stok ready, rata-rata 5-15 menit sejak pembayaran dikonfirmasi admin. Akun kustom atau anggaran tertentu bisa memakan waktu hingga 1x24 jam.',
      },
      {
        q: 'Bagaimana jika akun bermasalah setelah dibeli?',
        a: 'Ajukan klaim garansi lewat WhatsApp admin dengan bukti video unboxing. Sesuai kebijakan, kamu mendapat akun pengganti atau pengembalian dana.',
      },
    ],
  },
  {
    slug: 'kenali-level-akun-fresh-aman-premium-monetize',
    title: 'FRESH, AMAN, PREMIUM, MONETIZE — Arti Level Akun dan Kapan Memakainya',
    excerpt:
      'Level akun bukan sekadar label marketing. Ini kamus lengkapnya plus rekomendasi pemakaian sesuai tujuanmu — dari starter sampai monetisasi.',
    category: 'Panduan Pembeli',
    date: '2026-10-18',
    readMinutes: 6,
    author: 'Tim Pusatakun',
    tags: ['level akun', 'panduan beli', 'istilah'],
    intro:
      'Di Pusatakun, setiap akun diberi label level: FRESH, AMAN, PREMIUM, atau MONETIZE. Label ini hasil kurasi manual admin — bukan otomatis — dan menentukan harga, garansi, serta cara pakai terbaiknya. Banyak pembeli baru salah membeli karena memilih level berdasarkan harga semata. Artikel ini membedah arti tiap level dan kapan kamu benar-benar membutuhkannya.',
    sections: [
      {
        heading: 'FRESH — starter yang jujur',
        paragraphs: [
          'Akun FRESH biasanya baru dibuat atau minim riwayat. Kelebihannya jelas: harga paling ramah kantong dan riwayat pemakaian benar-benar bersih karena belum dipakai siapa pun.',
          'Kekurangannya: platform masih "mengamati" akun baru. Batasi aktivitas agresif di minggu pertama — jangan langsung follow ratusan orang atau posting tautan massal.',
        ],
      },
      {
        heading: 'AMAN — pilihan standar 80% pembeli',
        paragraphs: [
          'Level AMAN artinya riwayat akun bersih dari pelanggaran, data pemulihan lengkap, dan pola login normal. Umurnya biasanya sudah beberapa bulan sehingga tidak dianggap akun "baru muncul" oleh algoritma.',
          'Untuk kebutuhan jualan produk atau branding usaha kecil, AMAN adalah pilihan paling rasional: harga wajar, risiko rendah, garansi standar.',
        ],
      },
      {
        heading: 'PREMIUM — umur, kredibilitas, dan kestabilan',
        paragraphs: [
          'Akun PREMIUM punya umur lebih tua, riwayat interaksi organik, dan biasanya sudah punya karakter posting yang konsisten. Cocok untuk bisnis yang butuh kepercayaan sejak hari pertama — misalnya jasa, properti, atau brand yang tampil di iklan.',
        ],
      },
      {
        heading: 'MONETIZE — siap menghasilkan',
        paragraphs: [
          'Level MONETIZE berarti akun sudah memenuhi syarat monetisasi platform (misalnya syarat penghasilan kreator). Kamu tidak perlu menunggu bulan-bulan memenuhi syarat — akun langsung bisa menghasilkan.',
          'Perhatikan: monetisasi terikat identitas. Pastikan proses transfer data pemulihan benar-benar tuntas dan tanyakan ke admin tentang riwayat pembayaran kreatornya.',
        ],
      },
      {
        heading: 'Cara membaca label saat membeli',
        paragraphs: [
          'Di halaman produk, level tampil sebagai badge berwarna di kartu akun. Gabungkan dengan informasi umur akun, jumlah follower, dan masa garansi untuk menilai harga. Kalau ragu, tanyakan ke admin via WhatsApp — mereka menjawab sebagai manusia, bukan bot.',
        ],
      },
    ],
    conclusion:
      'Rule of thumb: starter → FRESH, usaha harian → AMAN, branding serius → PREMIUM, langsung cari penghasilan → MONETIZE. Beli level yang sesuai tujuan, bukan yang paling murah.',
    faqs: [
      {
        q: 'Apakah level bisa berubah setelah akun terjual?',
        a: 'Level menilai kondisi akun saat listing tayang. Pemakaian pembeli setelah serah terima berada di luar kendali Pusatakun — karena itu dokumentasikan unboxing sebagai dasar garansi.',
      },
      {
        q: 'Level mana yang paling banyak dibeli?',
        a: 'AMAN. Level ini titik termurah antara harga terjangkau dan risiko rendah, sehingga menjadi standar pembeli ritel dan reseller.',
      },
    ],
  },
  {
    slug: 'cara-kerja-escrow-marketplace-akun',
    title: 'Apa Itu Escrow? Cara Sistem Ini Melindungi Dana Pembeli dan Penjual',
    excerpt:
      'Escrow adalah alasan transaksi di Pusatakun nyaris bebas penipuan. Begini mekanismenya langkah demi langkah — dan apa yang terjadi saat ada sengketa.',
    category: 'Keamanan',
    date: '2026-10-21',
    readMinutes: 5,
    author: 'Tim Pusatakun',
    tags: ['escrow', 'keamanan', 'transaksi'],
    intro:
      'Masalah tertua jual beli akun online: pembeli takut kirim dana duluan, penjual takut serah terima duluan. Escrow memutus kebuntuan ini dengan satu prinsip sederhana — dana tidak pernah berpindah langsung antar pihak. Ia ditahan netral sampai dua sisi selesai kewajibannya.',
    sections: [
      {
        heading: 'Alur dana di escrow Pusatakun',
        paragraphs: [
          'Saat pembeli membuat pesanan, sistem mencatat kode pesanan dan jumlahnya. Pembayaran dikirim ke kanal resmi yang dikonfirmasi admin — bukan ke rekening penjual. Dari titik ini dana berstatus "ditahan".',
        ],
        bullets: [
          'Pembeli bayar ke kanal resmi → dana ditahan sistem.',
          'Admin memandu serah terima akun (kredensial, ganti email, 2FA).',
          'Pembeli konfirmasi akun diterima dan sesuai deskripsi.',
          'Dana dilepas ke penjual; penjual menerima 90% nilai jual.',
        ],
      },
      {
        heading: 'Kenapa penjual juga aman?',
        paragraphs: [
          'Penjual sering dianggap pihak yang paling rawan — akun sudah diserahkan, uang belum tentu cair. Dengan escrow, begitu pembeli konfirmasi (atau masa konfirmasi lewat tanpa keberatan), penjadwalan pelepasan dana berjalan otomatis. Penjual tidak perlu mengejar-ngejar pembayaran.',
        ],
      },
      {
        heading: 'Apa yang terjadi saat ada sengketa?',
        paragraphs: [
          'Kalau akun tidak sesuai deskripsi — misalnya follower tidak seperti klaim atau data pemulihan tidak disertakan — pembeli melapor sebelum konfirmasi. Admin menilai bukti dua sisi (deskripsi listing, video unboxing, log percakapan). Dana bisa dikembalikan ke pembeli, diselesaikan sebagian, atau dilepas ke penjual sesuai bukti.',
        ],
      },
      {
        heading: 'Batasan yang perlu kamu tahu',
        paragraphs: [
          'Escrow melindungi dana, bukan kualitas jangka panjang. Masalah yang muncul setelah konfirmasi diterima — misalnya pemakaian yang melanggar ketentuan platform — masuk wilayah garansi, bukan escrow. Karena itu video unboxing tetap wajib.',
        ],
      },
    ],
    conclusion:
      'Escrow mengubah jual beli akun dari "saling curiga" menjadi proses bertahap yang terukur. Di Pusatakun escrow aktif pada semua listing kurasi — tanpa pengecualian.',
    faqs: [
      {
        q: 'Apakah ada biaya tambahan untuk escrow?',
        a: 'Tidak ada biaya terpisah untuk pembeli. Pendapatan platform berasal dari komisi 10% pada sisi penjual, transparan dan tercantum di dashboard.',
      },
      {
        q: 'Berapa lama dana ditahan?',
        a: 'Hanya selama proses serah terima — umumnya 5-15 menit untuk stok ready. Dana penjual biasanya cair di hari yang sama setelah konfirmasi pembeli.',
      },
    ],
  },
  {
    slug: 'cara-menjadi-penjual-akun-sukses',
    title: 'Dari Nol ke Penjual Akun Andalan: Panduan Lengkap Komisi 90/10',
    excerpt:
      'Cara membuka toko gratis, melewati kurasi dengan lancar, dan mengoptimalkan listing agar cepat laku — plus hitungan realistis potensi penghasilan.',
    category: 'Panduan Penjual',
    date: '2026-10-24',
    readMinutes: 8,
    author: 'Tim Pusatakun',
    tags: ['penjual', 'reseller', 'komisi'],
    intro:
      'Jadi penjual akun di Pusatakun gratis dan prosesnya bisa selesai dalam satu hari: daftar dengan OTP WhatsApp, pilih peran Penjual, daftarkan akun, lewati kurasi, dan listingmu tayang ke ribuan pembeli aktif. Yang membedakan penjual biasa dengan penjual andalan adalah cara mereka menyiapkan listing. Ini panduannya.',
    sections: [
      {
        heading: 'Langkah teknis: 15 menit jadi penjual',
        paragraphs: [
          'Masuk dengan nomor WhatsApp (kode OTP 6 digit), buka Dashboard Penjual, isi form Daftarkan Akun: platform, judul, harga, jumlah follower, level, dan deskripsi jujur. Kirim, lalu tunggu kurasi maksimal 1x24 jam.',
        ],
      },
      {
        heading: 'Listing yang lolos kurasi di percobaan pertama',
        paragraphs: [
          'Tim kurasi menolak listing yang tidak bisa diverifikasi. Tiga hal yang paling sering membuat listing tertolak: deskripsi terlalu bombastis tanpa data, harga tidak masuk akal dibanding pembanding, dan bukti kepemilikan lemah.',
        ],
        bullets: [
          'Tulis spesifikasi konkret: umur akun, jumlah follower asli, apakah email bisa ganti.',
          'Pasang harga sesuai level akun — lihat halaman harga pembanding di katalog.',
          'Siapkan screenshot dari dalam akun sebagai bukti kepemilikan.',
        ],
      },
      {
        heading: 'Menghitung penghasilanmu secara realistis',
        paragraphs: [
          'Model komisinya transparan: kamu menerima 90% harga jual, platform mengambil 10% (tanpa biaya pendaftaran, tanpa biaya listing). Contoh: menjual 10 akun seharga Rp150.000 per bulan berarti omzet Rp1.500.000 — penerimaanmu Rp1.350.000.',
          'Gunakan Kalkulator Reseller untuk memodelkan targetmu: atur harga jual dan jumlah transaksi, lalu lihat penerimaan bersih sebelum kamu benar-benar mulai.',
        ],
      },
      {
        heading: 'Kebiasaan penjual yang cepat laku',
        paragraphs: [
          'Penjual terbaik di Pusatakun punya tiga kebiasaan sama: merespons WhatsApp cepat (pembeli membeli pada momen niat), memperbarui stok rutin (listing aktif memberi sinyal kredibilitas), dan menjaga reputasi dengan deskripsi yang selalu sesuai kenyataan.',
        ],
      },
    ],
    conclusion:
      'Modal utama penjual akun bukan stok — tapi kredibilitas. Kurasi yang kamu lewati hari ini adalah reputasi yang menjual untukmu bulan depan.',
    faqs: [
      {
        q: 'Apakah ada biaya untuk membuka toko?',
        a: 'Tidak ada. Pendaftaran gratis, listing gratis. Platform hanya mengambil komisi 10% saat listing terjual.',
      },
      {
        q: 'Berapa lama kurasi listing?',
        a: 'Maksimal 1x24 jam, biasanya jauh lebih cepat pada jam kerja. Status listing bisa dipantau langsung di Dashboard Penjual.',
      },
      {
        q: 'Bagaimana cara saya menerima uang?',
        a: 'Setelah pembeli mengonfirmasi akun diterima, dana (90% dari harga jual) diproses ke kanal yang kamu daftarkan — dipandu admin sampai selesai.',
      },
    ],
  },
  {
    slug: 'tanda-akun-shadowban-dan-cara-ceknya',
    title: '5 Tanda Akun Terkena Shadowban (dan Cara Mengeceknya Sebelum Membeli)',
    excerpt:
      'Shadowban membuat akun terlihat normal tapi jangkauannya dikepung. Kenali tandanya supaya kamu tidak membeli akun yang sudah "tidur".',
    category: 'Tips & Trik',
    date: '2026-10-27',
    readMinutes: 6,
    author: 'Tim Pusatakun',
    tags: ['shadowban', 'instagram', 'tiktok'],
    intro:
      'Shadowban adalah pembatasan jangkauan tanpa pemberitahuan: akun tetap bisa posting, tetapi kontennya tidak muncul di eksplorasi, hashtag, atau rekomendasi. Bagi pembeli akun, ini bahaya senyap — follower bisa jutaan tetapi reach nol. Tim kurasi Pusatakun selalu menyaring tanda-tanda ini sebelum akun tayang, dan kamu juga bisa.',
    sections: [
      {
        heading: 'Tanda 1: Reach turun drastis dan tiba-tiba',
        paragraphs: [
          'Bandingkan reach 7 hari terakhir dengan bulan sebelumnya. Penurunan bertahap itu wajar; penurunan 70-90% dalam hitungan hari adalah sinyal kuat pembatasan.',
        ],
      },
      {
        heading: 'Tanda 2: Konten tidak muncul di hashtag',
        paragraphs: [
          'Posting konten dengan hashtag yang tidak terlalu ramai, lalu minta akun lain (mode incognito) mencarinya. Kalau tidak muncul dalam 10 menit, kemungkinan postingan sedang dideindeks.',
        ],
      },
      {
        heading: 'Tanda 3: Eksplorasi berhenti mengirim pengunjung',
        paragraphs: [
          'Buka statistik akun: sumber kunjungan profil. Akun sehat mendapat porsi konsisten dari eksplorasi. Akun ter-shadowban polanya hampir nol dari sumber ini walau posting rutin.',
        ],
      },
      {
        heading: 'Tanda 4: Riwayat pelanggaran di pengaturan akun',
        paragraphs: [
          'Cek menu status akun (Account Status di Instagram). Di situ platform mencantumkan konten yang dihapus karena pelanggaran. Riwayat panjang = risiko pembatasan berulang.',
        ],
      },
      {
        heading: 'Tanda 5: Follower tidak sesuai interaksi',
        paragraphs: [
          'Rasio sehat likes+komentar terhadap follower berkisar 1-5% untuk akun biasa. Kalau akun 50 ribu follower hanya dapat 50 likes konsisten, kamu sedang melihat follower mati atau pembatasan jangkauan.',
        ],
      },
      {
        heading: 'Bisa pulih tidak?',
        paragraphs: [
          'Sering kali bisa: berhenti dari pola yang memicunya (auto-like, komentar massal), posting organik konsisten, dan hindari tautan mencurigakan. Tapi pemulihan butuh waktu — karena itu membeli akun yang sejak awal bersih jauh lebih murah daripada memulihkan akun sakit.',
        ],
      },
    ],
    conclusion:
      'Sebelum membeli, minta akses sementara untuk melihat statistik akun — penjual jujur tidak akan keberatan. Di Pusatakun, bukti statistik ini bagian dari kurasi.',
    faqs: [
      {
        q: 'Apakah level FRESH berisiko shadowban?',
        a: 'Semua akun baru berada di fase pengamatan platform. FRESH bukan berarti shadowban — ia hanya butuh pola pemakaian wajar di minggu-minggu awal.',
      },
      {
        q: 'Bagaimana kurasi Pusatakun menyaring shadowban?',
        a: 'Admin memeriksa statistik jangkauan, riwayat pelanggaran akun, dan konsistensi interaksi sebelum listing disetujui tayang.',
      },
    ],
  },
  {
    slug: 'kenapa-harga-akun-berbeda-beda',
    title: 'Kenapa Harga Akun Bisa Beda 10x Lipat? 6 Faktor yang Menentukannya',
    excerpt:
      'Dua akun Instagram dengan follower sama bisa beda harga jauh. Ini enam faktor yang membuat profesional bersedia membayar lebih — dan sebaiknya kamu juga.',
    category: 'Insight Pasar',
    date: '2026-10-29',
    readMinutes: 5,
    author: 'Tim Pusatakun',
    tags: ['harga', 'insight pasar', 'investasi'],
    intro:
      'Pertanyaan paling sering masuk ke admin: "Kenapa akun 10 ribu follower di sini Rp200 ribu, di tempat lain Rp30 ribu?" Jawabannya sederhana: kamu tidak membeli follower — kamu membeli riwayat. Dan riwayat tidak terlihat dari angka follower.',
    sections: [
      {
        heading: 'Faktor 1: Umur akun',
        paragraphs: [
          'Akun berumur 3 tahun punya jejak yang sudah "dipercaya" algoritma; akun umur 3 minggu belum. Semakin tua dan bersih riwayatnya, semakin mahal — dan semakin stabil pemakaiannya.',
        ],
      },
      {
        heading: 'Faktor 2: Kualitas follower',
        paragraphs: [
          '1.000 follower organik yang benar-benar manusia lebih berharga daripada 20.000 follower bot. Kualitas follower menentukan reach, konversi, dan keamanan akun dalam jangka panjang.',
        ],
      },
      {
        heading: 'Faktor 3: Kelengkapan data pemulihan',
        paragraphs: [
          'Akun yang disertai email asli terdaftar, nomor pemulihan yang bisa diganti, dan riwayat login bersih harganya lebih tinggi — karena risiko kehilangan aksesnya nyaris nol.',
        ],
      },
      {
        heading: 'Faktor 4: Riwayat pelanggaran dan shadowban',
        paragraphs: [
          'Akun pernah melanggar ketentuan platform membawa risiko pembatasan berulang. Harga murah di listing seperti ini adalah kompensasi risikonya — sering kali tidak sepadan.',
        ],
      },
      {
        heading: 'Faktor 5: Kelangkaan niche dan username',
        paragraphs: [
          'Username pendek, niche langka, atau akun dengan posisi lama di komunitas tertentu punya nilai strategis yang jauh di atas nilai follower-nya.',
        ],
      },
      {
        heading: 'Faktor 6: Garansi dan kanal penjualnya',
        paragraphs: [
          'Harga di marketplace bergaransi escrow memang sedikit di atas jual-beli langsung antar orang. Yang kamu bayar selisih itu adalah premi asuransi: kurasi, escrow, garansi tertulis, dan support 24/7.',
        ],
      },
    ],
    conclusion:
      'Harga murah selalu ada alasannya, sama seperti harga premium. Beli berdasarkan riwayat dan garansi — bukan berdasarkan angka follower terbesar dengan harga terkecil.',
    faqs: [
      {
        q: 'Apakah harga di Pusatakun bisa nego?',
        a: 'Harga listing tetap agar adil bagi semua pembeli, tetapi admin rutin menjalankan promo dan kupon — cek halaman Promo untuk potongan yang sedang berlaku.',
      },
      {
        q: 'Level akun mana yang paling worth it?',
        a: 'Untuk kebanyakan kebutuhan, AMAN. Ia menawarkan riwayat bersih dengan harga masuk akal — titik terbaik antara risiko dan biaya.',
      },
    ],
  },
]

export function getArticleBySlug(slug: string): BlogArticle | undefined {
  return BLOG_ARTICLES.find((a) => a.slug === slug)
}

export function getRelatedArticles(slug: string, category: string, take = 3): BlogArticle[] {
  const sameCat = BLOG_ARTICLES.filter((a) => a.slug !== slug && a.category === category)
  const others = BLOG_ARTICLES.filter((a) => a.slug !== slug && a.category !== category)
  return [...sameCat, ...others].slice(0, take)
}

export function getAllBlogSlugs(): string[] {
  return BLOG_ARTICLES.map((a) => a.slug)
}

export function formatDateID(iso: string): string {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
  ]
  const [y, m, d] = iso.split('-')
  return `${Number(d)} ${months[Number(m) - 1]} ${y}`
}
