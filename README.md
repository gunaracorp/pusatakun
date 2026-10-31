# PUSATAKUN — pusatakun.web.id

> **Pusat Akun Premium #1 Indonesia** — Website jual beli akun media sosial, game & streaming
> terlengkap se-Indonesia. Full SEO mesin pencari · Full animasi · Login WhatsApp OTP ·
> Marketplace penjual terverifikasi · Escrow & garansi.

---

## 1. Identitas & Kepemilikan

| Aspek | Nilai |
| --- | --- |
| **Brand** | Pusatakun (`pusatakun.web.id`) |
| **Badan hukum** | **PT Digital Bisnis Manajemen** |
| **Situs grup** | [digiman.id](https://digiman.id) |
| **Support system** | **PT Top Konsultan Internasional** — [topkonsultan.web.id](https://topkonsultan.web.id) |
| **Alamat kantor** | Kantor PHI Kwitang, Kwitang, Senen, Jakarta Pusat, DKI Jakarta, Indonesia |
| **WhatsApp resmi (aktif)** | [+62 813-1651-6524](https://wa.me/6281316516524) — sekaligus **nomor SUPER ADMIN** sistem |
| **Email resmi** | [rajaakun2026@gmail.com](mailto:rajaakun2026@gmail.com) |
| **Pendiri** | **Gugun Gunara** (alias **Muhammad Lutfi Azmi**) — a.k.a. **prabudanling** · **santri angon** |

### Jaringan sosial resmi pendiri (terhubung ke sistem via `rel="me"` + JSON-LD `sameAs`)

| Platform | Handle | URL |
| --- | --- | --- |
| Facebook | bossdanling | https://www.facebook.com/bossdanling |
| X (Twitter) | @gunzz_krenzz | https://x.com/gunzz_krenzz |
| Instagram | @prabudanling | https://www.instagram.com/prabudanling |
| TikTok | @gunaracorp | https://www.tiktok.com/@gunaracorp |
| Threads | @prabudanling | https://www.threads.com/@prabudanling |
| Reddit | u/prabudanling | https://www.reddit.com/user/prabudanling/ |

> **Catatan branding:** identitas pendiri & grup usaha **sengaja tidak mencolok di permukaan**
> (permintaan pemilik), namun **tertanam di dalam sistem** agar terbaca mesin pencari:
> meta `keywords`/`authors`/`creator`/`publisher`, JSON-LD `Person` + `Organization`
> (`founder`, `alternateName`, `parentOrganization`, `sameAs`), footer baris kredit,
> komentar kode, dan dokumen ini. Pendekatan ini sah & disukai Google (entity SEO).

---

## 2. Fitur Utama

### 2.1 Katalog akun resmi (Pusatakun Official)
- 14 kategori: Instagram, TikTok, YouTube, Facebook, Twitter/X, Telegram, WhatsApp,
  Email/Gmail, LinkedIn, Discord, Akun Game, Streaming, Marketplace, Lainnya.
- Filter lengkap: pencarian, kategori, level (FRESH/AMAN/PREMIUM/MONETIZE), rentang harga,
  urutan (populer/termurah/termahal/rating), pagination.
- Detail produk dalam Sheet: spesifikasi, garansi, trust chips, CTA WhatsApp.

### 2.2 Login / Daftar dengan WhatsApp OTP ⭐ (halaman tunggal)

Tiga **halaman tunggal** khusus — semuanya berdiri sendiri, latar SOLID 100%
(tanpa dialog/Sheet transparan), kontras warna maksimal:

| Halaman | URL | Isi |
| --- | --- | --- |
| Masuk | `/masuk` | Login WhatsApp OTP — panel emas solid + formulir gelap solid |
| Daftar | `/daftar` | Pilih peran (Pembeli/Penjual) → nomor → OTP → nama. Mendukung `?peran=penjual` |
| Panel Admin | `/admin` | Gerbang OTP khusus admin + dasbor kurasi INLINE (noindex) |

Prinsip desain halaman auth (permintaan pemilik): **tidak ada warna bertumpuk/
transparan** — panel merek emas solid dengan teks hampir-hitam, kartu formulir
`bg-card` solid, input `bg-muted` solid, kode demo dalam kotak emas penuh, error
dalam kotak merah solid, badge status penuh warna.

Alur bagi **pembeli** maupun **penjual** (satu pintu, tanpa password):

```
Klik "Masuk" (→ /masuk) atau "Jual Akun" (→ /daftar?peran=penjual)
   └─> Masukkan nomor WhatsApp (08xx / 8xx / 62 8xx — dinormalisasi server)
         └─> Server generate OTP 6 digit (crypto-safe, kedaluwarsa 5 menit,
             rate limit 3 kode / 10 menit / nomor)
               ├─ [PRODUKSI] dikirim otomatis ke WhatsApp pengguna via
               │   WhatsApp Business API (set env WHATSAPP_API_URL + WHATSAPP_API_TOKEN)
               └─ [DEMO] kode ditampilkan di KOTAK EMAS SOLID berlabel "Mode Demo"
                   + tombol salin, plus tautan minta bantuan admin via wa.me
                     └─> Masukkan kode (6 slot solid, klik area mana pun untuk fokus)
                           └─> Sesi dibuat (cookie httpOnly `ra_session`, 30 hari)
                                 ├─ Pengguna BARU -> Nama + Peran (Pembeli / Penjual)
                                 └─> Selesai. Navbar berganti jadi menu akun.
```

**Aturan peran otomatis**
- Nomor `6281316516524` (pemilik) → otomatis peran **ADMIN** (panel kurasi).
- Pembeli yang mendaftarkan akun pertama → otomatis dipromosikan **SELLER**.
- Peran bisa diubah dari menu akun (BUYER ↔ SELLER), ADMIN terkunci.

### 2.3 Dashboard Penjual ⭐
- Statistik toko: Total / Kurasi / Tayang / Terjual.
- Form **Daftarkan Akun**: platform, judul, follower, harga (preview format IDR),
  level, deskripsi (maks. 1200 karakter).
- Status listing: `PENDING` (Kurasi Admin) → `APPROVED` (Tayang) / `REJECTED`
  (dengan catatan admin + tombol "Tanya Admin") / `SOLD`.
- Kuota 50 listing per penjual; kode listing unik `RA-XXXXXX`.

### 2.4 Rak "Penjual Terverifikasi" (publik) ⭐
- Section baru antara Katalog & Keunggulan (`#studio-penjual`).
- Hanya listing berstatus `APPROVED` yang tampil (kurasi manual admin).
- Kartu: platform, level, judul, follower, harga, avatar inisial + badge
  "Terverifikasi".
- **Checkout**: klik "Lihat & Beli" → detail + poin escrow →
  - belum login → tombol "Masuk untuk Membeli" mengarah ke halaman tunggal `/masuk`;
  - sudah login → pesanan dibuat (`ORD-XXXXXX`, status `MENUNGGU_PEMBAYARAN`) →
    tombol **Proses via WhatsApp Admin** (pesan terisi otomatis: kode pesanan + produk + nama).

### 2.5 Dashboard Pembeli ⭐
- Riwayat pesanan: kode, produk, jumlah, tanggal, status
  (`MENUNGGU_PEMBAYARAN` / `DIPROSES` / `SELESAI` / `DIBATALKAN`).
- Tombol "Bayar via WA" / "Tanya Admin" per pesanan.

### 2.6 Panel Admin (kurasi) ⭐ — halaman `/admin`
- **Halaman tunggal** `/admin` (noindex + `Disallow` di robots.txt): gerbang OTP
  khusus administrator; nomor non-pemilik melihat kartu "Akses Ditolak" solid merah.
- Setelah nomor pemilik terverifikasi, **Dasbor Kurasi tampil inline** di halaman
  yang sama: 4 kartu statistik solid (Perlu Kurasi/Tayang/Terjual/Ditolak),
  filter tab pill solid, dan kartu listing beraksi lengkap.
- Aksi: **Setujui**, **Tolak**, **Tandai Terjual**, **Hapus**, **Chat Penjual**.
- Tautan alternatif: menu akun → "Panel Admin (Halaman Penuh)".

### 2.7 Animasi penuh
- framer-motion 12: hero per-kata stagger + blur, parallax floating cards, marquee
  (promo strip, trust bar, testimoni 2 baris), CountUp stats, scroll progress bar,
  reveal-on-scroll, flash countdown, activity ticker social-proof, pulse-glow CTA,
  hover micro-interactions — semua dengan `prefers-reduced-motion` support.

### 2.8 SEO mesin pencari (full)
- Metadata lengkap: title template, description kaya keyword (46+ keyword termasuk
  entitas pendiri), canonical, OpenGraph id_ID + OG image 1200×630, Twitter card,
  robots `max-snippet:-1`, `formatDetection`.
- **JSON-LD (6 blok)**: `Organization` (founder + parentOrganization + address +
  email + sameAs semua sosmed), `Person` (Gugun Gunara, alternateName, sameAs,
  knowsAbout), `WebSite` + SearchAction, `BreadcrumbList`, `FAQPage` (10 FAQ dari DB),
  `ItemList` katalog produk.
- File konvensi Next.js: `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest`,
  favicon SVG mahkota.
- Semantic HTML, ARIA lengkap, skip-link, `lang="id"`, anchor teks deskriptif,
  `rel="me"` untuk verifikasi entitas lintas platform.

---

## 3. Arsitektur & Teknologi

| Layer | Teknologi |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) + TypeScript 5 |
| UI | Tailwind CSS 4 + shadcn/ui (New York) + Lucide + framer-motion 12 |
| State | Zustand (katalog + auth), TanStack Query tersedia |
| Database | SQLite via Prisma ORM (`db/custom.db`) |
| Font | Plus Jakarta Sans (identitas) + Geist Mono (kode pesanan) |
| Tema | **Royal Dark Gold** (oklch), utility kustom: `.glass`, `.text-gradient-gold`,
  `.bg-royal-glow`, `.bg-royal-grid`, `.marquee-track`, `.card-glow`, dll. |

### Struktur direktori penting

```
src/
├─ app/
│  ├─ layout.tsx              # font, metadata SEO, viewport
│  ├─ page.tsx                # SSR data + 6 blok JSON-LD + HomeClient
│  ├─ masuk/page.tsx          # halaman tunggal login WhatsApp (index: ya)
│  ├─ daftar/page.tsx         # halaman tunggal daftar pembeli/penjual (index: ya)
│  ├─ admin/page.tsx          # panel admin — halaman tunggal (noindex)
│  ├─ robots.ts / sitemap.ts / manifest.ts / icon.svg
│  └─ api/
│     ├─ auth/{request-otp,verify-otp,profile,me,logout}/route.ts
│     ├─ listings/route.ts        # GET publik|mine|admin · POST penjual
│     ├─ orders/route.ts          # GET milik pembeli · POST buat pesanan
│     ├─ admin/listings/route.ts  # PATCH kurasi (approve/reject/sold/delete)
│     └─ products|categories|stats|testimonials|faqs/route.ts
├─ components/pusatakun/       # 20+ komponen (hero, katalog, auth-shell, login/register/
│                             #  admin-page, dashboards solid, navbar, footer, ...)
├─ lib/
│  ├─ auth.ts                 # OTP, sesi, normalisasi WA, ADMIN_PHONE, guard
│  ├─ marketplace.ts          # SITE config (kontak, PT, sosmed) + DTO + format anti-hydration
│  └─ seo.ts                  # metadata + 7 JSON-LD builder
├─ store/
│  ├─ auth-store.ts           # user, dialog, dashboard (zustand)
│  └─ catalog-store.ts        # filter katalog (zustand)
prisma/
├─ schema.prisma              # Category, Product, Testimonial, Faq, User, OtpCode, Session, Listing, Order
├─ seed.ts
└─ scripts/                   # add-faq.ts, polish-samples.ts (util pemeliharaan)
```

### Model data (ringkas)

```
User(id, phone UNIQUE, name?, role BUYER|SELLER|ADMIN, email?)
OtpCode(id, phone, code, expiresAt, used)
Session(id = token acak, userId FK, expiresAt)          -> cookie ra_session
Listing(id, code UNIQUE RA-XXXX, sellerId FK, platform, title, description,
        price, followers?, level, status PENDING|APPROVED|REJECTED|SOLD, adminNote?)
Order(id, code UNIQUE ORD-XXXX, buyerId FK, productId?, productName,
      amount, quantity, status, createdAt)
Category / Product / Testimonial / Faq                  -> katalog resmi
```

---

## 4. Referensi API

### Auth
| Endpoint | Method | Body | Catatan |
| --- | --- | --- | --- |
| `/api/auth/request-otp` | POST | `{phone}` | Rate limit 3/10 mnt; balikin `devCode` saat mode demo |
| `/api/auth/verify-otp` | POST | `{phone, code}` | Set cookie `ra_session` (httpOnly, 30 hari) |
| `/api/auth/profile` | POST | `{name?, role?}` | Lengkapi/ubah profil; role BUYER↔SELLER |
| `/api/auth/me` | GET | — | `{ok, user\|null}` |
| `/api/auth/logout` | POST | — | Hapus sesi + cookie |

### Marketplace penjual
| Endpoint | Method | Akses | Catatan |
| --- | --- | --- | --- |
| `/api/listings` | GET | publik | hanya `APPROVED`, `?limit=8` |
| `/api/listings?mine=1` | GET | sesi | semua status milik penjual |
| `/api/listings?admin=1&status=` | GET | ADMIN | antrean kurasi |
| `/api/listings` | POST | sesi | buat listing (`PENDING`); promosi BUYER→SELLER |
| `/api/orders` | GET/POST | sesi | riwayat / buat pesanan |
| `/api/admin/listings` | PATCH | ADMIN | `{id, action: approve\|reject\|mark-sold\|delete}` |

---

## 5. Menjalankan Proyek

```bash
bun install            # dependensi
bun run db:push        # sinkronkan schema SQLite
bun prisma/seed.ts     # data awal (14 kategori, 47 produk, 10 FAQ, dst.)
bun run dev            # http://localhost:3000 (dev.log untuk log)
bun run lint           # ESLint
bunx tsc --noEmit      # type check
```

### Konfigurasi produksi WhatsApp OTP
```env
WHATSAPP_API_URL=https://api.provider-wa.com/send   # endpoint kirim pesan
WHATSAPP_API_TOKEN=xxxxxxxx                          # bearer token
```
Saat keduanya terisi, kode OTP **tidak lagi** ditampilkan di UI dan dikirim langsung
ke WhatsApp pengguna. Tanpa env → **Mode Demo** (kode muncul di dialog untuk pengujian).

### Checklist produksi
- [ ] Set env WhatsApp API (lihat atas) + ganti vendor bila perlu (Fonnte/Wablas/Cloud API resmi Meta).
- [ ] SMTP/forwarder untuk `rajaakun2026@gmail.com` agar notifikasi email listing masuk.
- [ ] Ganti SQLite → Postgres bila trafik besar (schema Prisma sudah kompatibel).
- [ ] Aktifkan backup harian `db/custom.db`.
- [ ] CNAME `pusatakun.web.id` → hosting, pastikan HTTPS aktif (sitemap sudah `https://pusatakun.web.id`).
- [ ] Submit `https://pusatakun.web.id/sitemap.xml` ke Google Search Console & Bing.
- [ ] Verifikasi properti di Google & tempel meta verifikasi bila diminta.

---

## 6. Keamanan

- OTP: `crypto.getRandomValues`, sekali pakai (`used`), kedaluwarsa 5 menit,
  rate limit 3 kode/10 menit/nomor, pembanding konstanta via lookup eksak.
- Sesi: token acak 64 hex chars, cookie `httpOnly` + `sameSite=lax` + `secure`
  (produksi), rotasi & pembersihan sesi kedaluwarsa, logout menghapus record.
- Otorisasi: guard `requireUser` di semua endpoint privat; endpoint admin
  memvalidasi `role === 'ADMIN'` (hanya nomor pemilik).
- Validasi input: normalisasi & whitelist di setiap route (panjang, rentang harga,
  enum level/status, batas kuota).
- Eskalasi peran: hanya ADMIN yang bisa mengubah listing (approve/reject/sold/delete);
  `profile` tidak bisa menurunkan ADMIN.

---

## 7. Kredit

> Dirancang & diarsiteki oleh **Gugun Gunara** — *Muhammad Lutfi Azmi*
> (dikenal juga sebagai **prabudanling** · **santri angon**).
>
> Dioperasikan oleh **PT Digital Bisnis Manajemen** ([digiman.id](https://digiman.id)),
> dengan support system **PT Top Konsultan Internasional**
> ([topkonsultan.web.id](https://topkonsultan.web.id)) — Kantor PHI Kwitang, Kwitang,
> Senen, Jakarta Pusat.
>
> *"Berpikir seluas polymath, menimbang sebijak sage, bertindak setuntas
> ultimate problem solver."*

---

## 8. Worklog

Riwayat pengerjaan teknis lengkap per tahap: lihat **[`worklog.md`](./worklog.md)**.
