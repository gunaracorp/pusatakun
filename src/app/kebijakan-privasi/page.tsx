import type { Metadata } from 'next'
import { PageHero } from '@/components/pusatakun/page-hero'
import { LegalArticle, LegalList, LegalSection, type TocItem } from '@/components/pusatakun/legal-article'
import { PageShell } from '@/components/pusatakun/page-shell'
import { SITE } from '@/lib/marketplace'
import { getPageCategories } from '@/lib/page-data'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Kebijakan Privasi',
  description:
    'Kebijakan Privasi Pusatakun (pusatakun.web.id) — data apa yang kami kumpulkan, untuk apa, bagaimana kami melindunginya, serta hak-hakmu sesuai UU Pelindungan Data Pribadi No. 27 Tahun 2022.',
  alternates: { canonical: '/kebijakan-privasi' },
  robots: { index: true, follow: true },
}

const TOC: TocItem[] = [
  { id: 'ringkasan', label: 'Ringkasan' },
  { id: 'data-yang-dikumpulkan', label: 'Data yang Kami Kumpulkan' },
  { id: 'dasar-pemrosesan', label: 'Dasar & Tujuan Pemrosesan' },
  { id: 'cookie', label: 'Cookie & Penyimpanan Lokal' },
  { id: 'berbagi-data', label: 'Berbagi Data ke Pihak Ketiga' },
  { id: 'keamanan', label: 'Keamanan Data' },
  { id: 'retensi', label: 'Penyimpanan & Penghapusan' },
  { id: 'hak-anda', label: 'Hak-Hakmu' },
  { id: 'anak', label: 'Data Anak' },
  { id: 'transfer', label: 'Transfer Data' },
  { id: 'perubahan', label: 'Perubahan Kebijakan' },
  { id: 'kontak', label: 'Kontak' },
]

export default async function KebijakanPrivasiPage() {
  const categories = await getPageCategories()

  return (
    <PageShell categories={categories}>
      <PageHero
        kicker="LEGAL"
        title="Kebijakan"
        highlight="Privasi"
        description={`Cara ${SITE.name} (${SITE.domain}) mengumpulkan, memakai, dan melindungi data pribadimu — disusun selaras dengan Undang-Undang No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP).`}
        breadcrumb={[{ label: 'Kebijakan Privasi' }]}
      />

      <LegalArticle toc={TOC} updated="1 November 2026">
        <LegalSection id="ringkasan" title="1. Ringkasan">
          <p>
            Kami mengumpulkan seminimal mungkin data: yang benar-benar diperlukan agar kamu bisa masuk,
            membeli, dan menjual dengan aman. Kami <strong>tidak menjual</strong> data pribadimu, tidak
            memasang iklan pelacak pihak ketiga, dan semua komunikasi transaksi berlangsung lewat
            WhatsApp resmi admin yang tertera di situs.
          </p>
        </LegalSection>

        <LegalSection id="data-yang-dikumpulkan" title="2. Data yang Kami Kumpulkan">
          <LegalList
            items={[
              <><strong>Data registrasi:</strong> nomor WhatsApp (sebagai identitas login), nama tampilan (jika kamu mengisinya), peran (pembeli/penjual), dan email opsional.</>,
              <><strong>Data transaksi:</strong> kode pesanan, produk yang dibeli, nominal, status pesanan, serta riwayat chat pendukung dengan admin.</>,
              <><strong>Data listing penjual:</strong> detail akun yang didaftarkan untuk dijual (platform, judul, deskripsi, harga, level) beserta status kurasinya.</>,
              <><strong>Data teknis:</strong> catatan server standar (waktu akses, halaman yang diminta) untuk keamanan dan perbaikan layanan — bukan untuk memprofilkan kamu.</>,
            ]}
          />
          <p>
            Kami <strong>tidak</strong> meminta kata sandi akun media sosialmu melalui situs, dan kamu
            tidak perlu membagikannya kepada kami — penyerahan akses akun yang dijual hanya terjadi
            pada tahap serah terima yang dipandu admin.
          </p>
        </LegalSection>

        <LegalSection id="dasar-pemrosesan" title="3. Dasar & Tujuan Pemrosesan">
          <p>Kami memproses data pribadimu hanya dengan dasar dan tujuan berikut:</p>
          <LegalList
            items={[
              'Melaksanakan kontrak denganmu: membuat akun pengguna, memproses pesanan, mengantre kurasi listing, dan menyediakan dashboard;',
              'Memenuhi kewajiban hukum: pencatatan transaksi dan pemenuhan permintaan otoritas yang sah;',
              'Kepentingan yang sah: menjaga keamanan platform, mencegah penipuan dan penyalahgunaan, serta meningkatkan kualitas layanan;',
              'Persetujuanmu: misalnya saat kamu memilih berkomunikasi atau berbagi data tertentu — kamu dapat menariknya kapan saja.',
            ]}
          />
        </LegalSection>

        <LegalSection id="cookie" title="4. Cookie & Penyimpanan Lokal">
          <p>
            Situs ini menggunakan <strong>satu cookie esensial</strong> saja: <em>ra_session</em> —
            cookie httpOnly berisi token sesi agar kamu tetap masuk setelah verifikasi OTP. Cookie
            ini tidak dapat dibaca skrip pihak ketiga dan hilang saat kamu menekan Keluar atau saat
            sesi kedaluwarsa.
          </p>
          <p>
            Kami tidak memakai cookie iklan, cookie analitik lintas situs, maupun pelacak pihak ketiga
            seperti pixel media sosial. Karena itu kamu tidak akan menemukan banner persetujuan cookie
            yang menutupi layar — memang tidak ada yang perlu disetujui.
          </p>
        </LegalSection>

        <LegalSection id="berbagi-data" title="5. Berbagi Data ke Pihak Ketiga">
          <p>Kami tidak menjual atau menyewakan datamu. Data hanya dibagikan secara terbatas kepada:</p>
          <LegalList
            items={[
              'Penjual terkait — hanya data yang diperlukan untuk memenuhi pesanan atas akun listingnya (melalui pendampingan admin);',
              'Penyedia infrastruktur — hosting dan basis data kami yang terikat kewajiban kerahasiaan;',
              'Otoritas berwenang — bila diwajibkan oleh hukum atau proses hukum yang sah;',
              'WhatsApp (Meta) — tautan chat admin membuka aplikasi WhatsApp milikmu; pemrosesan di sana tunduk pada kebijakan Meta.',
            ]}
          />
        </LegalSection>

        <LegalSection id="keamanan" title="6. Keamanan Data">
          <LegalList
            items={[
              'Sesi login memakai token acak pada cookie httpOnly — bukan penyimpanan data sensitif di sisi peramban;',
              'Kode OTP berumur pendek, sekali pakai, dan terkunci pada nomor yang memintanya;',
              'Akses basis data dibatasi hanya untuk sistem dan admin yang berwenang;',
              'Listing akun yang dijual melewati kurasi admin untuk menekan penipuan dan akun ilegal.',
            ]}
          />
        </LegalSection>

        <LegalSection id="retensi" title="7. Penyimpanan & Penghapusan">
          <p>
            Data akun pengguna kami simpan selama akunmu aktif. Setelah kamu meminta penghapusan,
            kami menghapus data profil dan sesi dalam waktu paling lambat 30 hari, kecuali data
            transaksi yang wajib kami simpan lebih lama sesuai ketentuan hukum (dalam bentuk yang
            tidak lagi terhubung langsung ke aktivitas harianmu).
          </p>
        </LegalSection>

        <LegalSection id="hak-anda" title="8. Hak-Hakmu">
          <p>Sesuai UU PDP, kamu berhak untuk:</p>
          <LegalList
            items={[
              'Meminta informasi tentang data pribadimu yang kami simpan;',
              'Meminta perbaikan data yang tidak akurat atau tidak lengkap;',
              'Meminta penghapusan data pribadimu (dengan pengecualian retensi hukum);',
              'Menarik persetujuan pemrosesan yang berdasarkan persetujuan;',
              'Mengajukan keberatan atas pemrosesan tertentu dan memperoleh jawaban dari kami.',
            ]}
          />
          <p>
            Permintaan dapat disampaikan lewat WhatsApp admin atau email di bagian Kontak — kami
            menanggapi paling lambat 14 hari kerja.
          </p>
        </LegalSection>

        <LegalSection id="anak" title="9. Data Anak">
          <p>
            Layanan kami tidak ditujukan bagi anak di bawah 13 tahun dan kami tidak dengan sengaja
            mengumpulkan data mereka. Apabila kamu meyakini ada data anak yang terkirim kepada kami,
            hubungi admin agar segera kami hapus.
          </p>
        </LegalSection>

        <LegalSection id="transfer" title="10. Transfer Data">
          <p>
            Data disimpan pada infrastruktur penyedia hosting yang mungkin berlokasi di luar
            Indonesia. Dalam hal itu, kami memastikan penyedia tersebut memberikan tingkat perlindungan
            yang setara dengan standar UU PDP.
          </p>
        </LegalSection>

        <LegalSection id="perubahan" title="11. Perubahan Kebijakan">
          <p>
            Bila kebijakan ini diperbarui, tanggal pembaruan di bagian atas halaman akan kami sesuaikan
            dan versi terbaru berlaku sejak dipublikasikan di halaman ini.
          </p>
        </LegalSection>

        <LegalSection id="kontak" title="12. Kontak">
          <p>Pengawas perlindungan data dapat dihubungi melalui:</p>
          <LegalList
            items={[
              <>Email: {SITE.email} (subjek: &ldquo;Permintaan Data Pribadi&rdquo;).</>,
              <>WhatsApp admin 24/7: {SITE.whatsappDisplay}.</>,
              <>Kantor: {SITE.address}.</>,
            ]}
          />
        </LegalSection>
      </LegalArticle>
    </PageShell>
  )
}
