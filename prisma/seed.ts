import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const categories = [
  { slug: 'instagram', name: 'Instagram', tagline: 'IG Reguler, Aman & Bergaransi', icon: 'instagram', gradient: 'from-fuchsia-500 via-rose-500 to-amber-400', order: 1 },
  { slug: 'tiktok', name: 'TikTok', tagline: 'Akun Siap Viral & Follower Aktif', icon: 'music', gradient: 'from-cyan-400 via-teal-400 to-emerald-400', order: 2 },
  { slug: 'youtube', name: 'YouTube', tagline: 'Fresh sampai Monetisasi Ready', icon: 'youtube', gradient: 'from-red-500 via-orange-500 to-amber-400', order: 3 },
  { slug: 'facebook', name: 'Facebook', tagline: 'Profil, Fanspage & BM Iklan', icon: 'facebook', gradient: 'from-sky-400 via-blue-500 to-indigo-500', order: 4 },
  { slug: 'twitter', name: 'Twitter / X', tagline: 'Akun Aged & Berumur Panjang', icon: 'twitter', gradient: 'from-zinc-400 via-slate-500 to-zinc-600', order: 5 },
  { slug: 'telegram', name: 'Telegram', tagline: 'Akun & Channel Siap Pakai', icon: 'send', gradient: 'from-cyan-400 via-sky-500 to-blue-500', order: 6 },
  { slug: 'whatsapp', name: 'WhatsApp', tagline: 'WA Business & Channel Official', icon: 'message-circle', gradient: 'from-emerald-400 via-green-500 to-teal-500', order: 7 },
  { slug: 'email', name: 'Email / Gmail', tagline: 'Gmail Fresh, Aged & PVA', icon: 'mail', gradient: 'from-red-400 via-rose-500 to-fuchsia-500', order: 8 },
  { slug: 'linkedin', name: 'LinkedIn', tagline: 'Profil Profesional & Aman', icon: 'linkedin', gradient: 'from-blue-400 via-cyan-500 to-teal-500', order: 9 },
  { slug: 'discord', name: 'Discord', tagline: 'Token Aged & Server Nitro', icon: 'gamepad-2', gradient: 'from-violet-400 via-purple-500 to-fuchsia-500', order: 10 },
  { slug: 'game', name: 'Akun Game', tagline: 'ML, FF, Genshin & Banyak Lagi', icon: 'swords', gradient: 'from-amber-400 via-orange-500 to-red-500', order: 11 },
  { slug: 'streaming', name: 'Streaming', tagline: 'Netflix, Spotify & Disney+ Hotstar', icon: 'clapperboard', gradient: 'from-rose-500 via-red-500 to-orange-400', order: 12 },
  { slug: 'marketplace', name: 'Marketplace', tagline: 'Shopee, Tokopedia & Lazada', icon: 'shopping-bag', gradient: 'from-orange-400 via-amber-500 to-yellow-400', order: 13 },
  { slug: 'lainnya', name: 'Lainnya', tagline: 'Google Voice, WeChat & Lainnya', icon: 'sparkles', gradient: 'from-lime-400 via-emerald-500 to-teal-500', order: 14 },
]

type SeedProduct = {
  slug: string
  name: string
  category: string
  description: string
  price: number
  oldPrice?: number
  stock: number
  level: string
  warranty: string
  featured?: boolean
  hot?: boolean
  sold: number
  rating: number
  specs: string[]
}

const products: SeedProduct[] = [
  // ============ INSTAGRAM ============
  { slug: 'ig-fresh-email-sendiri', name: 'Akun IG Fresh Bawa Email Sendiri', category: 'instagram', description: 'Akun Instagram fresh kualitas terbaik, dibuat manual dengan email berbayar, data login lengkap (email + password), siap dipakai jangka panjang untuk bisnis maupun pribadi.', price: 12000, oldPrice: 20000, stock: 420, level: 'FRESH', warranty: 'Garansi Full 30 Hari', sold: 3120, rating: 4.9, specs: ['Email berbayar full akses', 'Bisa ganti nama, bio, foto', 'Data login lengkap (email+pass)', 'Siap verifikasi 2 langkah'], featured: true, hot: true },
  { slug: 'ig-aman-1k-follower', name: 'Akun IG Aman 1K Follower Aktif', category: 'instagram', description: 'Akun IG dengan 1.000 follower campuran aktif, post siap pakai, engagement sehat. Cocok untuk branding bisnis, jualan online, dan kebutuhan kredibilitas akun.', price: 85000, oldPrice: 120000, stock: 68, level: 'AMAN', warranty: 'Garansi 14 Hari', sold: 1480, rating: 4.8, specs: ['1.000+ follower aktif', 'Umur akun 6+ bulan', 'Post & highlight tersedia', 'Bebas ganti username'], featured: true, hot: true },
  { slug: 'ig-premium-10k-follower', name: 'Akun IG Premium 10K Follower Nich Oleh-Oleh', category: 'instagram', description: 'Akun premium dengan 10.000+ follower organik niche oleh-oleh/jualan, engagement tinggi, riwayat bersih, langsung cuan untuk affiliate dan endorse.', price: 750000, oldPrice: 950000, stock: 12, level: 'PREMIUM', warranty: 'Garansi Tukar 7 Hari', sold: 186, rating: 5.0, specs: ['10.000+ follower organik', 'Engagement 3-5%', 'Riwayat bersih tanpa pelanggaran', 'Konsultasi monitisasi gratis'], featured: true },
  { slug: 'ig-aman-5k-mixed', name: 'Akun IG Aman 5K Follower Campuran', category: 'instagram', description: 'Akun IG 5.000 follower campuran nasional, feed estetik rapi, cocok untuk katalog produk dan membangun trust bisnis.', price: 320000, oldPrice: 400000, stock: 25, level: 'AMAN', warranty: 'Garansi 14 Hari', sold: 640, rating: 4.9, specs: ['5.000+ follower campuran', 'Feed estetik siap pakai', 'Umur akun 1 tahun+', 'Data lengkap + email'] },
  { slug: 'ig-pva-bulk-10pcs', name: 'Paket 10pcs IG PVA Untuk Marketing', category: 'instagram', description: 'Paket hemat 10 akun Instagram PVA (Phone Verified Account) untuk kebutuhan marketing, seeding, dan manajemen multi-akun.', price: 95000, oldPrice: 140000, stock: 150, level: 'FRESH', warranty: 'Garansi 7 Hari', sold: 2210, rating: 4.7, specs: ['10 akun PVA terverifikasi', 'IP pembuatan bersih', 'Format data rapi (email|pass)', 'Support bot & tools pihak ketiga'], hot: true },

  // ============ TIKTOK ============
  { slug: 'tt-fresh-email-sendiri', name: 'Akun TikTok Fresh Bawa Email', category: 'tiktok', description: 'Akun TikTok fresh dengan email sendiri, belum terkena shadowban, siap dijadikan akun utama untuk konten dan jualan.', price: 15000, oldPrice: 25000, stock: 380, level: 'FRESH', warranty: 'Garansi Full 30 Hari', sold: 2840, rating: 4.9, specs: ['Email akses penuh', 'Bebas shadowban', 'Region Indonesia', 'Siap ganti username'], featured: true, hot: true },
  { slug: 'tt-aman-5k-follower', name: 'Akun TikTok Aman 5K Follower', category: 'tiktok', description: 'Akun TikTok dengan 5.000+ follower aktif, FYP konsisten, riwayat konten sehat. Pilihan tepat untuk mulai endorse & live shopping.', price: 450000, oldPrice: 600000, stock: 18, level: 'AMAN', warranty: 'Garansi 7 Hari', sold: 320, rating: 4.9, specs: ['5.000+ follower aktif', 'Riwayat FYP konsisten', 'Umur akun 8+ bulan', 'Cocok untuk live & affiliate'], featured: true },
  { slug: 'tt-premium-20k-niche', name: 'Akun TikTok Premium 20K Follower Niche Kuliner', category: 'tiktok', description: 'Akun premium niche kuliner dengan 20.000 follower organik, video rata-rata 10K+ views, potensi endorse Rp500rb+/video.', price: 1200000, stock: 6, level: 'PREMIUM', warranty: 'Garansi Tukar 7 Hari', sold: 94, rating: 5.0, specs: ['20.000+ follower organik', 'Rata-rata 10K+ views', 'Niche kuliner siap endorse', 'Bebas flag & strike'], featured: true },
  { slug: 'tt-followers-aktif-1k', name: 'Akun TikTok + 1K Follower Aktif', category: 'tiktok', description: 'Akun TikTok fresh yang sudah ditanam 1.000 follower aktif, langsung terlihat kredibel untuk promosi jualan.', price: 65000, oldPrice: 90000, stock: 85, level: 'AMAN', warranty: 'Garansi 14 Hari', sold: 1120, rating: 4.8, specs: ['1.000 follower aktif', 'Akun masih fresh', 'Region Indonesia', 'Data lengkap'] },

  // ============ YOUTUBE ============
  { slug: 'yt-fresh-gmail-sendiri', name: 'Akun YouTube Fresh Gmail Sendiri', category: 'youtube', description: 'Channel YouTube fresh bermula dari Gmail pribadi, verifikasi nomor sudah dilakukan, siap diupload konten pertama.', price: 25000, oldPrice: 35000, stock: 210, level: 'FRESH', warranty: 'Garansi Full 30 Hari', sold: 1890, rating: 4.8, specs: ['Gmail akses penuh', 'Nomor terverifikasi', 'Siap upload & live', 'Bebas riwayat strike'], featured: true },
  { slug: 'yt-aman-1k-subscribe', name: 'Akun YouTube Aman 1K Subscribers', category: 'youtube', description: 'Channel dengan 1.000+ subscribers aktif dan 4.000 jam tontonan aman, langkah terakhir menuju monetisasi AdSense!', price: 850000, oldPrice: 1100000, stock: 9, level: 'MONETIZE', warranty: 'Garansi 14 Hari', sold: 210, rating: 4.9, specs: ['1.000+ subscribers', '4.000 jam watch time', 'Monetisasi siap review', 'Konten bisa dihapus/rebrand'], featured: true, hot: true },
  { slug: 'yt-monetize-ready-4k-jam', name: 'YouTube Monetize Ready + 4K Jam Tonton', category: 'youtube', description: 'Channel YouTube dengan 1K sub & 4.000 jam tontonan NATURAL, nol pelanggaran, tinggal daftar AdSense langsung approve.', price: 950000, oldPrice: 1250000, stock: 7, level: 'MONETIZE', warranty: 'Garansi Tukar 7 Hari', sold: 156, rating: 5.0, specs: ['Watch time natural 100%', 'Nol pelanggaran kebijakan', 'Subscribers 1.000+', 'Panduan daftar AdSense'], featured: true },
  { slug: 'yt-aged-2015', name: 'Akun YouTube Aged Tahun 2015', category: 'youtube', description: 'Channel berumur 9+ tahun dengan reputasi baik, cocok untuk yang butuh akun tua demi kepercayaan algoritma.', price: 150000, stock: 32, level: 'AMAN', warranty: 'Garansi 14 Hari', sold: 430, rating: 4.7, specs: ['Umur 9+ tahun', 'Reputasi channel bersih', 'Gmail aged ikut dibawa', 'Siap branding ulang'] },

  // ============ FACEBOOK ============
  { slug: 'fb-fresh-bawa-mail', name: 'Akun Facebook Fresh Bawa Mail', category: 'facebook', description: 'Akun Facebook fresh dengan email akses penuh, belum pernah dipakai iklan, siap dikembangkan untuk bisnis.', price: 18000, oldPrice: 28000, stock: 350, level: 'FRESH', warranty: 'Garansi Full 30 Hari', sold: 2650, rating: 4.8, specs: ['Email akses penuh', 'Belum terbanned iklan', 'Profil foto & nama bisa diganti', 'Siap verifikasi 2FA'], featured: true },
  { slug: 'fb-aman-friends-5k', name: 'Akun FB Aman 5K Friends', category: 'facebook', description: 'Akun Facebook dengan 5.000 teman penuh, umur akun 2+ tahun, cocok untuk jualan di marketplace & grup-grup besar.', price: 280000, oldPrice: 350000, stock: 15, level: 'AMAN', warranty: 'Garansi 7 Hari', sold: 380, rating: 4.9, specs: ['5.000 friends penuh', 'Umur akun 2+ tahun', 'Riwayat bersih', 'Sudah verifikasi nomor'], featured: true, hot: true },
  { slug: 'fb-bm-iklan-terverifikasi', name: 'Facebook BM (Business Manager) Verified', category: 'facebook', description: 'BM Facebook terverifikasi dengan limit iklan aktif, siap terbang untuk kampanye iklan skala besar. Bonus akun pendamping.', price: 1800000, stock: 4, level: 'PREMIUM', warranty: 'Garansi Tukar 3 Hari', sold: 47, rating: 4.9, specs: ['BM terverifikasi', 'Limit iklan aktif', 'Bonus akun pendamping', 'Panduan pengamanan BM'], featured: true },
  { slug: 'fb-fanspage-10k-like', name: 'Fanspage Facebook 10K Likes', category: 'facebook', description: 'Fanspage dengan 10.000+ likes aktif, niche umum, cocok untuk jualan online dan iklan murah.', price: 550000, oldPrice: 700000, stock: 11, level: 'AMAN', warranty: 'Garansi 7 Hari', sold: 128, rating: 4.8, specs: ['10.000+ likes', 'Admin akses penuh', 'Riwayat iklan bersih', 'Bebas rebranding'] },

  // ============ TWITTER / X ============
  { slug: 'x-aged-2018-mail-sendiri', name: 'Akun X (Twitter) Aged 2018 Mail Sendiri', category: 'twitter', description: 'Akun X berumur 6+ tahun dengan email akses penuh, riwayat bersih, cocok untuk thread marketing & airdrop.', price: 45000, oldPrice: 65000, stock: 95, level: 'AMAN', warranty: 'Garansi 14 Hari', sold: 870, rating: 4.8, specs: ['Umur 6+ tahun', 'Email akses penuh', 'Riwayat bersih', 'Siap verifikasi 2FA'], featured: true, hot: true },
  { slug: 'x-fresh-pva', name: 'Akun X (Twitter) Fresh PVA', category: 'twitter', description: 'Akun X fresh terverifikasi nomor (PVA), siap pakai untuk kebutuhan multi-akun dan otomasi.', price: 15000, stock: 240, level: 'FRESH', warranty: 'Garansi 7 Hari', sold: 1320, rating: 4.7, specs: ['Phone Verified Account', 'Format data rapi', 'Region acak (bisa request)', 'Support API pihak ketiga'] },
  { slug: 'x-followers-1k', name: 'Akun X + 1K Followers Aktif', category: 'twitter', description: 'Akun X aged dengan 1.000+ followers, siap dipakai membangun presence brand di timeline.', price: 120000, oldPrice: 160000, stock: 40, level: 'AMAN', warranty: 'Garansi 7 Hari', sold: 310, rating: 4.8, specs: ['1.000+ followers', 'Umur akun 3+ tahun', 'Tweet riwayat sehat', 'Data lengkap'] },

  // ============ TELEGRAM ============
  { slug: 'tg-virtual-number', name: 'Akun Telegram Virtual Number', category: 'telegram', description: 'Akun Telegram dengan virtual number aktif, siap dipakai untuk bot, channel, dan komunikasi bisnis.', price: 22000, oldPrice: 30000, stock: 300, level: 'FRESH', warranty: 'Garansi 7 Hari', sold: 1980, rating: 4.8, specs: ['Virtual number aktif', 'Siap 2FA', 'Bisa multi-device', 'Support bot API'], featured: true },
  { slug: 'tg-channel-5k-member', name: 'Channel Telegram 5K Member Aktif', category: 'telegram', description: 'Channel Telegram dengan 5.000+ member aktif, cocok untuk broadcast jualan dan komunitas.', price: 400000, oldPrice: 520000, stock: 8, level: 'AMAN', warranty: 'Garansi 7 Hari', sold: 92, rating: 4.9, specs: ['5.000+ member aktif', 'Admin akses penuh', 'Riwayat bersih', 'Bebas rebranding'] },
  { slug: 'tg-aged-2017', name: 'Akun Telegram Aged 2017', category: 'telegram', description: 'Akun Telegram tua tahun 2017, jarang dibatasi fitur, aman untuk transaksi & komunitas besar.', price: 85000, stock: 28, level: 'AMAN', warranty: 'Garansi 14 Hari', sold: 240, rating: 4.8, specs: ['Umur 7+ tahun', 'Bebas limit', 'Nomor ikut dibawa', 'Siap 2FA'] },

  // ============ WHATSAPP ============
  { slug: 'wa-business-virtual', name: 'WhatsApp Business Virtual Number', category: 'whatsapp', description: 'WhatsApp Business dengan virtual number, profil bisnis lengkap, siap dipakai CS & konfirmasi order.', price: 35000, oldPrice: 50000, stock: 180, level: 'FRESH', warranty: 'Garansi 7 Hari', sold: 1540, rating: 4.9, specs: ['WA Business siap pakai', 'Profil bisnis lengkap', 'Virtual number aktif', 'Bisa API gateway'], featured: true, hot: true },
  { slug: 'wa-channel-1k-followers', name: 'WhatsApp Channel 1K Followers', category: 'whatsapp', description: 'Channel WhatsApp dengan 1.000+ followers, media baru untuk broadcast promo langsung ke HP pelanggan.', price: 150000, stock: 35, level: 'AMAN', warranty: 'Garansi 7 Hari', sold: 210, rating: 4.8, specs: ['1.000+ followers channel', 'Admin penuh', 'Riwayat bersih', 'Bebas rebranding'] },
  { slug: 'wa-aged-indo', name: 'WhatsApp Aged Nomor Indonesia', category: 'whatsapp', description: 'WhatsApp nomor Indonesia berumur tua, jarang diblokir, ideal untuk transaksi jual-beli online.', price: 65000, oldPrice: 85000, stock: 55, level: 'AMAN', warranty: 'Garansi 14 Hari', sold: 460, rating: 4.7, specs: ['Nomor Indonesia (+62)', 'Umur nomor 1+ tahun', 'Bebas blokir massal', 'Siap 2FA'] },

  // ============ EMAIL / GMAIL ============
  { slug: 'gmail-fresh-pva', name: 'Gmail Fresh PVA Terverifikasi HP', category: 'email', description: 'Gmail fresh sudah terverifikasi nomor HP, recovery lengkap, cocok untuk daftar semua platform.', price: 8000, oldPrice: 12000, stock: 500, level: 'FRESH', warranty: 'Garansi Full 30 Hari', sold: 4820, rating: 4.9, specs: ['Nomor HP terverifikasi', 'Recovery email aktif', 'IP Indonesia bersih', 'Format: mail|pass|recovery'], featured: true, hot: true },
  { slug: 'gmail-aged-2019', name: 'Gmail Aged 2019+ Akses Penuh', category: 'email', description: 'Gmail berumur 5+ tahun akses penuh (imap/pop aktif), cocok untuk bisnis yang butuh email tua terpercaya.', price: 35000, stock: 120, level: 'AMAN', warranty: 'Garansi 14 Hari', sold: 980, rating: 4.9, specs: ['Umur 5+ tahun', 'Akses IMAP/POP penuh', 'Riwayat login bersih', 'Recovery data lengkap'], featured: true },
  { slug: 'outlook-pva-bulk-10', name: 'Paket 10pcs Outlook PVA', category: 'email', description: '10 akun Outlook Microsoft PVA untuk kebutuhan tools, otomasi, dan pendaftaran massal.', price: 55000, oldPrice: 75000, stock: 90, level: 'FRESH', warranty: 'Garansi 7 Hari', sold: 1240, rating: 4.7, specs: ['10 akun PVA', 'Microsoft akses penuh', 'Format data rapi', 'Support IMAP'] },

  // ============ LINKEDIN ============
  { slug: 'li-fresh-connection', name: 'Akun LinkedIn Fresh + 50 Koneksi', category: 'linkedin', description: 'LinkedIn fresh dengan 50+ koneksi awal, profil profesional siap dipakai networking dan job hunting.', price: 75000, oldPrice: 100000, stock: 45, level: 'FRESH', warranty: 'Garansi 7 Hari', sold: 320, rating: 4.8, specs: ['50+ koneksi awal', 'Profil terisi lengkap', 'Email akses penuh', 'Bebas ganti identitas'], featured: true },
  { slug: 'li-aged-500-connection', name: 'LinkedIn Aged 500+ Koneksi', category: 'linkedin', description: 'LinkedIn tua dengan 500+ koneksi penuh, cocok untuk personal branding, sales outreach, dan recruiter.', price: 450000, stock: 10, level: 'AMAN', warranty: 'Garansi 7 Hari', sold: 76, rating: 4.9, specs: ['500+ koneksi penuh', 'Umur akun 2+ tahun', 'Riwayat kerja profesional', 'Data lengkap'] },

  // ============ DISCORD ============
  { slug: 'dc-token-aged-2019', name: 'Discord Token Aged 2019+', category: 'discord', description: 'Token Discord berumur 5+ tahun, join server bebas verifikasi, siap dipakai komunitas & bot.', price: 25000, oldPrice: 35000, stock: 260, level: 'AMAN', warranty: 'Garansi 7 Hari', sold: 1680, rating: 4.8, specs: ['Umur token 5+ tahun', 'Mail akses penuh', 'Bebas phone verify', 'Format token|mail|pass'], featured: true, hot: true },
  { slug: 'dc-server-1k-member', name: 'Server Discord 1K Member Aktif', category: 'discord', description: 'Server Discord dengan 1.000+ member aktif, struktur channel rapi, cocok untuk komunitas gaming & jualan.', price: 350000, stock: 6, level: 'PREMIUM', warranty: 'Garansi 3 Hari', sold: 34, rating: 4.9, specs: ['1.000+ member', 'Owner transfer penuh', 'Channel & role rapi', 'Boost aktif 1 bulan'] },
  { slug: 'dc-nitro-1-tahun', name: 'Akun Discord + Nitro 1 Tahun', category: 'discord', description: 'Akun Discord lengkap dengan subscription Nitro aktif 1 tahun, upload besar & HD streaming bebas.', price: 550000, oldPrice: 700000, stock: 9, level: 'PREMIUM', warranty: 'Garansi Tukar 3 Hari', sold: 58, rating: 5.0, specs: ['Nitro aktif 12 bulan', '2 boost server', 'Mail akses penuh', 'Avatar & profil custom'] },

  // ============ GAME ============
  { slug: 'mlbb-vip-full-hero-skin', name: 'Mobile Legends VIP Full Hero + 200 Skin', category: 'game', description: 'Akun MLBB tier VIP dengan koleksi lengkap semua hero + 200+ skin epic/legendary, rank Mythic Glory siap lanjut.', price: 2500000, oldPrice: 3200000, stock: 3, level: 'PREMIUM', warranty: 'Garansi Tukar 7 Hari', sold: 22, rating: 5.0, specs: ['Semua hero terbuka', '200+ skin epic-legendary', 'Rank Mythic Glory', 'Email & Moonton akses penuh'], featured: true, hot: true },
  { slug: 'ff-akun-elite-pass-full', name: 'Free Fire Elite Pass Koleksi Lengkap', category: 'game', description: 'Akun FF dengan koleksi elite pass lengkap bertahun-tahun, bundle langka & karakter max level.', price: 1200000, oldPrice: 1500000, stock: 5, level: 'PREMIUM', warranty: 'Garansi Tukar 7 Hari', sold: 41, rating: 4.9, specs: ['Elite pass lengkap', 'Bundle langka & ink', 'Karakter max level', 'Garena akses penuh'], featured: true },
  { slug: 'genshin-ar60-5-star-full', name: 'Genshin Impact AR60 Koleksi 5 Star', category: 'game', description: 'Akun Genshin AR60 dengan puluhan karakter & weapon 5 star, spiral abyss full star, siap ganti owner.', price: 3500000, stock: 2, level: 'PREMIUM', warranty: 'Garansi Tukar 3 Hari', sold: 12, rating: 5.0, specs: ['AR60 max rank', '30+ karakter 5 star', 'Abyss full star', 'Hoyoverse akses penuh'], featured: true },
  { slug: 'valorant-ranked-immortal', name: 'Valorant Rank Immortal Full Agent', category: 'game', description: 'Akun Valorant rank Immortal dengan semua agent terbuka, skin premium, region server Asia.', price: 1800000, stock: 4, level: 'PREMIUM', warranty: 'Garansi Tukar 3 Hari', sold: 18, rating: 4.9, specs: ['Rank Immortal', 'Semua agent terbuka', 'Skin premium collection', 'Riot akses penuh'] },

  // ============ STREAMING ============
  { slug: 'netflix-premium-4k-1p', name: 'Netflix Premium 4K UHD Private', category: 'streaming', description: 'Akun Netflix Premium 4K UHD profil private 1 orang, garansi penuh masa aktif, bebas repot.', price: 45000, oldPrice: 65000, stock: 130, level: 'FRESH', warranty: 'Garansi Full 30 Hari', sold: 3980, rating: 4.9, specs: ['Paket Premium 4K UHD', 'Profil private 1 user', 'PIN profil tersedia', 'Legal & bergaransi'], featured: true, hot: true },
  { slug: 'spotify-premium-1-tahun', name: 'Spotify Premium Individual 1 Tahun', category: 'streaming', description: 'Spotify Premium Individual upgrade ke akun sendiri, aktif 12 bulan penuh, bebas iklan selamanya.', price: 150000, oldPrice: 200000, stock: 75, level: 'FRESH', warranty: 'Garansi Full 6 Bulan', sold: 2210, rating: 4.9, specs: ['Upgrade ke akun sendiri', 'Aktif 12 bulan penuh', 'Bebas iklan + offline', 'Proses 5-15 menit'], featured: true },
  { slug: 'disney-hotstar-premium', name: 'Disney+ Hotstar Premium 1 Tahun', category: 'streaming', description: 'Disney+ Hotstar Premium aktif 1 tahun, nonton semua film & series termasuk sport, kualitas 4K.', price: 120000, stock: 60, level: 'FRESH', warranty: 'Garansi Full 6 Bulan', sold: 1450, rating: 4.8, specs: ['Premium 4K', 'Aktif 12 bulan', 'Semua konten terbuka', 'Garansi replace'] },
  { slug: 'vidio-platinum-1-tahun', name: 'Vidio Platinum + Sport 1 Tahun', category: 'streaming', description: 'Vidio Platinum 1 tahun lengkap paket olahraga: Liga Champion, Liga 1, dan semua konten original.', price: 90000, oldPrice: 130000, stock: 45, level: 'FRESH', warranty: 'Garansi 6 Bulan', sold: 890, rating: 4.8, specs: ['Paket Platinum penuh', 'Sport & liga lengkap', 'Aktif 12 bulan', 'Garansi replace'] },

  // ============ MARKETPLACE ============
  { slug: 'shopee-akun-aman-level-3', name: 'Akun Shopee Aman Level 3+ Terisi', category: 'marketplace', description: 'Akun Shopee level 3+ dengan riwayat transaksi, cocok untuk flash sale, checkout cepat, dan afiliasi.', price: 85000, oldPrice: 110000, stock: 38, level: 'AMAN', warranty: 'Garansi 7 Hari', sold: 620, rating: 4.8, specs: ['Level 3+ terpercaya', 'Riwayat transaksi bersih', 'Nomor & mail ikut dibawa', 'Siap untuk afiliasi'], featured: true, hot: true },
  { slug: 'tokopedia-akun-aged', name: 'Akun Tokopedia Aged + Saldo Aktif', category: 'marketplace', description: 'Akun Tokopedia berumur lama dengan riwayat pembelian, cocok untuk program referral & cashback.', price: 95000, stock: 22, level: 'AMAN', warranty: 'Garansi 7 Hari', sold: 280, rating: 4.7, specs: ['Umur akun 2+ tahun', 'Riwayat pembelian', 'Nomor terverifikasi', 'Data lengkap'] },

  // ============ LAINNYA ============
  { slug: 'google-voice-usa', name: 'Google Voice Nomor USA Aktif', category: 'lainnya', description: 'Nomor Google Voice USA aktif & terverifikasi, cocok untuk verifikasi platform internasional.', price: 65000, oldPrice: 85000, stock: 70, level: 'FRESH', warranty: 'Garansi 7 Hari', sold: 540, rating: 4.8, specs: ['Nomor USA (+1) aktif', 'Sudah terverifikasi', 'Siap terima SMS', 'Panduan penggunaan'], featured: true },
  { slug: 'wechat-akun-aman', name: 'WeChat Aman Siap Pakai', category: 'lainnya', description: 'Akun WeChat aman, sudah lolos verifikasi, cocok untuk bisnis ekspor-impor & komunikasi lintas negara.', price: 150000, stock: 16, level: 'AMAN', warranty: 'Garansi 7 Hari', sold: 130, rating: 4.7, specs: ['Sudah verifikasi penuh', 'Bebas limit fitur', 'Umur akun 1+ tahun', 'Data lengkap'] },
  { slug: 'paypal-aged-verified', name: 'PayPal Aged Terverifikasi', category: 'lainnya', description: 'PayPal berumur dengan verifikasi email & kartu, limit transaksi longgar untuk bisnis internasional.', price: 250000, oldPrice: 320000, stock: 8, level: 'PREMIUM', warranty: 'Garansi Tukar 3 Hari', sold: 64, rating: 4.9, specs: ['Email & kartu terverifikasi', 'Umur akun 2+ tahun', 'Limit longgar', 'Panduan pengamanan'] },
]

const testimonials = [
  { name: 'Rizky Pratama', city: 'Jakarta', role: 'Reseller Sejak 2022', content: 'Udah 2 tahun langganan di Raja Akun. Yang paling saya suka prosesnya cepat banget, baru transfer 5 menit akun langsung masuk. Garansinya juga nggak makeshift!', rating: 5, initials: 'RP', order: 1 },
  { name: 'Sinta Dewi', city: 'Bandung', role: 'Owner Toko Online', content: 'Beli akun IG aman 5K buat katalog jualan. Follownya aktif-aktif, engagement jalan terus. Adminnya sabar banget jawab pertanyaan saya yang banyak 😅', rating: 5, initials: 'SD', order: 2 },
  { name: 'Andi Saputra', city: 'Surabaya', role: 'Digital Marketer', content: 'Sudah beli 40+ akun di sini untuk kebutuhan klien. Belum pernah ada masalah. Sistem antrian & garansinya paling rapi dibanding tempat lain.', rating: 5, initials: 'AS', order: 3 },
  { name: 'Maya Kusuma', city: 'Medan', role: 'Content Creator', content: 'Dapet akun TikTok 20K niche kuliner, sekarang endorse mulai jalan. Harga segitu balik modal 2 minggu. Worth it parah!', rating: 5, initials: 'MK', order: 4 },
  { name: 'Fajar Nugroho', city: 'Yogyakarta', role: 'Mahasiswa & Freelancer', content: 'Awalnya ragu, ternyata legit. Beli monetize YouTube, 3 hari langsung approve AdSense. Panduannya dijelasin step by step sama admin.', rating: 5, initials: 'FN', order: 5 },
  { name: 'Lina Marlina', city: 'Semarang', role: 'Ibu Rumah Tangga Bisnis', content: 'Beli WA Business buat konfirmasi pesanan kue. Gampang dipakai, admin bantu setting sampai jalan. Recommended buat yang pemula!', rating: 5, initials: 'LM', order: 6 },
  { name: 'Bayu Aji', city: 'Denpasar', role: 'Gamer & Trader', content: 'Akun ML VIP-nya nggak main-main, semua hero + skin legendary. Proses verifikasi keamanan kedua-duanya rapi. Puas banget!', rating: 5, initials: 'BA', order: 7 },
  { name: 'Rina Oktaviani', city: 'Makassar', role: 'Affiliate Marketer', content: 'Langganan Netflix & Spotify sekeluarga di sini, harganya jauh lebih murah, garansi jelas. Sudah 1 tahun tidak pernah kendala.', rating: 5, initials: 'RO', order: 8 },
]

const faqs = [
  { question: 'Apakah akun di Raja Akun aman dan bergaransi?', answer: 'Ya, 100%. Semua akun yang kami jual melewati proses kurasi ketat: dicek riwayatnya, diamankan datanya, dan didokumentasikan. Setiap pembelian dilindungi garansi penuh — jika akun bermasalah sesuai ketentuan garansi, kami ganti baru atau refund 100%.', order: 1 },
  { question: 'Bagaimana proses pembelian akun?', answer: 'Sangat mudah: 1) Pilih akun di katalog, 2) Klik tombol Beli untuk chat admin via WhatsApp, 3) Lakukan pembayaran (QRIS, transfer bank, e-wallet), 4) Data akun dikirim langsung ke WhatsApp/email Anda dalam 5-15 menit setelah pembayaran terkonfirmasi.', order: 2 },
  { question: 'Metode pembayaran apa saja yang tersedia?', answer: 'Kami menerima QRIS (semua e-wallet & m-banking), transfer bank (BCA, BRI, Mandiri, BNI), DANA, OVO, GoPay, ShopeePay, dan pulsa dengan rate khusus. Konfirmasi pembayaran otomatis 24 jam nonstop.', order: 3 },
  { question: 'Apakah data akun bisa saya ganti sendiri?', answer: 'Tentu bisa. Semua akun kami sertakan akses penuh: email utama, password, dan recovery. Kami juga memberikan panduan video cara mengganti password, email, dan mengaktifkan 2FA agar akun 100% menjadi milik Anda.', order: 4 },
  { question: 'Bagaimana jika akun bermasalah setelah dibeli?', answer: 'Tenang, ada garansi! Klaim garansi cukup chat admin dengan bukti video penerimaan akun. Jika terbukti bermasalah sesuai S&K garansi, kami ganti akun baru dengan spesifikasi sama atau refund 100% dalam 1x24 jam.', order: 5 },
  { question: 'Apakah bisa jadi reseller?', answer: 'Bisa banget! Kami punya program reseller dengan harga khusus (diskon hingga 35%), materi promosi siap pakai, dan support 24 jam. Ada juga sistem komisi 10% untuk setiap member yang Anda ajak daftar. Chat admin untuk daftar.', order: 6 },
  { question: 'Apakah tersedia test akun?', answer: 'Kami tidak menyediakan test akun, namun semua ulasan asli pembeli dapat Anda cek di testimoni dan testimoni WhatsApp admin. Pengiriman yang cepat + garansi penuh membuat risiko Anda nol.', order: 7 },
  { question: 'Apakah stok akun selalu tersedia?', answer: 'Kami restock setiap hari. Jika stok habis, Anda bisa chat admin untuk pre-order — akun akan dibuat/dikumpulkan sesuai spesifikasi yang Anda minta, biasanya siap dalam 1-3 hari kerja.', order: 8 },
]

async function main() {
  console.log('Seeding database...')

  await db.faq.deleteMany()
  await db.testimonial.deleteMany()
  await db.product.deleteMany()
  await db.category.deleteMany()

  for (const c of categories) {
    await db.category.create({ data: c })
  }

  for (const p of products) {
    const cat = await db.category.findUnique({ where: { slug: p.category } })
    if (!cat) throw new Error(`Category not found: ${p.category}`)
    await db.product.create({
      data: {
        slug: p.slug,
        name: p.name,
        categoryId: cat.id,
        description: p.description,
        price: p.price,
        oldPrice: p.oldPrice ?? null,
        stock: p.stock,
        totalStock: Math.max(p.stock + Math.floor(p.sold / 50), 120),
        level: p.level,
        warranty: p.warranty,
        featured: p.featured ?? false,
        hot: p.hot ?? false,
        sold: p.sold,
        rating: p.rating,
        specs: JSON.stringify(p.specs),
      },
    })
  }

  for (const t of testimonials) {
    await db.testimonial.create({ data: t })
  }

  for (const f of faqs) {
    await db.faq.create({ data: f })
  }

  console.log(`Seeded: ${categories.length} categories, ${products.length} products, ${testimonials.length} testimonials, ${faqs.length} FAQs`)
}

main()
  .then(async () => {
    await db.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await db.$disconnect()
    process.exit(1)
  })
