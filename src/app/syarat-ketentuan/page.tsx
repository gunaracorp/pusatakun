import type { Metadata } from 'next'
import { PageHero } from '@/components/pusatakun/page-hero'
import { LegalArticle, LegalList, LegalSection, type TocItem } from '@/components/pusatakun/legal-article'
import { PageShell } from '@/components/pusatakun/page-shell'
import { SITE } from '@/lib/marketplace'
import { getPageCategories } from '@/lib/page-data'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Syarat & Ketentuan',
  description:
    'Syarat & Ketentuan penggunaan marketplace Pusatakun (pusatakun.web.id) — aturan pembeli, aturan penjual, proses transaksi bergaransi, kewajiban para pihak, dan ketentuan hukum yang berlaku di Indonesia.',
  alternates: { canonical: '/syarat-ketentuan' },
  robots: { index: true, follow: true },
}

const TOC: TocItem[] = [
  { id: 'definisi', label: 'Definisi' },
  { id: 'ketentuan-umum', label: 'Ketentuan Umum' },
  { id: 'akun-pengguna', label: 'Akun Pengguna' },
  { id: 'aturan-pembeli', label: 'Aturan Pembeli' },
  { id: 'aturan-penjual', label: 'Aturan Penjual' },
  { id: 'transaksi', label: 'Proses Transaksi' },
  { id: 'garansi', label: 'Garansi & Klaim' },
  { id: 'larangan', label: 'Larangan' },
  { id: 'penangguhan', label: 'Penangguhan & Pembekuan' },
  { id: 'tanggung-jawab', label: 'Batasan Tanggung Jawab' },
  { id: 'hukum', label: 'Hukum yang Berlaku' },
  { id: 'perubahan', label: 'Perubahan Ketentuan' },
  { id: 'kontak', label: 'Kontak' },
]

export default async function SyaratKetentuanPage() {
  const categories = await getPageCategories()

  return (
    <PageShell categories={categories}>
      <PageHero
        kicker="LEGAL"
        title="Syarat &"
        highlight="Ketentuan"
        description={`Ketentuan penggunaan layanan marketplace ${SITE.name} (${SITE.domain}). Dengan mengakses atau memakai layanan kami, kamu dianggap telah membaca, memahami, dan menyetujui seluruh ketentuan di halaman ini.`}
        breadcrumb={[{ label: 'Syarat & Ketentuan' }]}
      />

      <LegalArticle toc={TOC} updated="1 November 2026">
        <LegalSection id="definisi" title="1. Definisi">
          <p>
            Dalam ketentuan ini, beberapa istilah dimaknai sebagai berikut:
          </p>
          <LegalList
            items={[
              <><strong>&ldquo;Pusatakun&rdquo;</strong> — layanan marketplace jual beli akun digital (media sosial, game, streaming, dan lainnya) yang dioperasikan oleh {SITE.company} pada domain {SITE.domain}.</>,
              <><strong>&ldquo;Kami&rdquo;</strong> — {SITE.company} selaku penyelenggara platform, beserta tim admin yang melayani proses transaksi.</>,
              <><strong>&ldquo;Pengguna&rdquo;</strong> — setiap orang yang mengakses situs, baik pembeli, penjual, maupun pengunjung biasa.</>,
              <><strong>&ldquo;Pembeli&rdquo;</strong> — pengguna yang membeli akun/produk digital melalui layanan kami.</>,
              <><strong>&ldquo;Penjual&rdquo;</strong> — pengguna yang mendaftarkan akun miliknya untuk dijual melalui fitur listing dan telah lolos kurasi admin.</>,
              <><strong>&ldquo;Produk&rdquo;</strong> — akun digital beserta detailnya (level, garansi, spesifikasi) yang ditayangkan di katalog.</>,
            ]}
          />
        </LegalSection>

        <LegalSection id="ketentuan-umum" title="2. Ketentuan Umum">
          <p>
            Layanan Pusatakun tersedia bagi kamu yang berusia minimal 13 tahun. Pengguna di bawah 18 tahun
            wajib mendapat izin dan pendampingan orang tua/wali untuk setiap transaksi. Kamu menyatakan
            bahwa seluruh data yang kamu berikan (termasuk nomor WhatsApp) adalah data yang benar dan
            milik kamu sendiri.
          </p>
          <p>
            Kami berhak memperbarui fitur, harga produk yang ditayangkan penjual maupun katalog, serta
            ketersediaan layanan sewaktu-waktu untuk menjaga kualitas dan keamanan marketplace.
          </p>
        </LegalSection>

        <LegalSection id="akun-pengguna" title="3. Akun Pengguna">
          <p>
            Registrasi dan masuk ke Pusatakun menggunakan nomor WhatsApp dengan kode verifikasi (OTP)
            6 digit — tanpa kata sandi. Setiap pengguna bertanggung jawab penuh untuk:
          </p>
          <LegalList
            items={[
              'Menjaga kerahasiaan akses ke nomor WhatsApp dan perangkatnya;',
              'Seluruh aktivitas yang terjadi melalui akunnya, termasuk pesanan dan listing yang dibuat;',
              'Segera melaporkan ke admin apabila terdapat penggunaan tidak sah atas akunnya.',
            ]}
          />
          <p>
            Satu nomor WhatsApp hanya boleh terhubung ke satu akun pengguna. Peran pembeli dan penjual
            dapat aktif bersamaan pada akun yang sama.
          </p>
        </LegalSection>

        <LegalSection id="aturan-pembeli" title="4. Aturan Pembeli">
          <LegalList
            items={[
              'Membaca detail produk (deskripsi, spesifikasi, level, masa garansi) sebelum membeli; sifat akun digital adalah produk yang sudah dilihat isi/aksesnya tidak dapat dikembalikan hanya karena berubah pikiran.',
              'Melakukan pembayaran hanya melalui instruksi resmi admin Pusatakun — kami tidak pernah meminta pembayaran di luar kanal yang dikonfirmasi admin.',
              'Merekam video saat menerima data akun (dari proses login pertama hingga pemeriksaan) sebagai bukti klaim garansi;',
              'Mengubah seluruh data keamanan akun (kata sandi, email pemulihan, nomor terikat) segera setelah akun diterima, sesuai panduan admin;',
              'Tidak menjual ulang akun dengan cara yang melanggar ketentuan platform asal.',
            ]}
          />
        </LegalSection>

        <LegalSection id="aturan-penjual" title="5. Aturan Penjual">
          <p>
            Penjual wajib mendaftarkan akun melalui fitur listing, dan setiap listing{' '}
            <strong>wajib lolos kurasi admin</strong> sebelum tayang di katalog. Dengan mendaftarkan
            akun untuk dijual, penjual menyatakan dan menjamin bahwa:
          </p>
          <LegalList
            items={[
              'Akun adalah milik sah penjual atau penjual memiliki kuasa penuh untuk menjualnya;',
              'Akun BUKAN hasil pembajakan (hacking), phishing, perampasan, pencurian, atau penemuan akun orang lain;',
              'Akun tidak sedang sengketa, tidak dijadikan jaminan, dan tidak tercatat hilang/dibajak pada platform asalnya;',
              'Seluruh informasi listing (jumlah follower, level, isi paket, harga) adalah benar dan tidak menyesatkan;',
              'Penjual bersedia menyerahkan seluruh akses dan data pemulihan akun kepada pembeli melalui admin, serta membantu proses peralihan selama masa garansi.',
            ]}
          />
          <p>
            Pelanggaran jaminan di atas membuat penjual bertanggung jawab penuh atas kerugian yang
            timbul, termasuk wajib menerima pembatalan transaksi dan pengembalian dana kepada pembeli.
          </p>
        </LegalSection>

        <LegalSection id="transaksi" title="6. Proses Transaksi">
          <p>
            Seluruh transaksi dibantu dan dipandu admin Pusatakun melalui WhatsApp resmi{' '}
            {SITE.whatsappDisplay} agar terdokumentasi dengan baik. Alur standarnya:
          </p>
          <LegalList
            items={[
              'Pembeli memilih produk lalu menekan tombol Beli / menghubungi admin;',
              'Admin memverifikasi ketersediaan, mengonfirmasi harga akhir, dan menginformasikan metode pembayaran;',
              'Pembeli melakukan pembayaran dan mengirimkan bukti melalui chat yang sama;',
              'Admin menyerahkan data akun sesuai spesifikasi produk dan mendampingi proses penerimaan;',
              'Admin menandai pesanan selesai setelah pembeli mengonfirmasi penerimaan. Status pesanan dapat dipantau pada dashboard pembeli.',
            ]}
          />
          <p>
            Harga yang tercantum pada katalog adalah harga tayang terkini. Kupon promo (bila ada)
            hanya berlaku apabila disebutkan kepada admin sebelum pembayaran dikonfirmasi.
          </p>
        </LegalSection>

        <LegalSection id="garansi" title="7. Garansi & Klaim">
          <p>
            Setiap produk menampilkan masa garansinya sendiri (misalnya Garansi Full 30 Hari, Garansi
            7 Hari, atau Garansi 1 Hari) sesuai jenis akunnya. Rincian lengkap mekanisme klaim,
            pilihan penggantian/pengembalian dana, dan kondisi yang membatalkan garansi diatur pada
            halaman <a href="/garansi">Kebijakan Garansi &amp; Pengembalian</a>.
          </p>
        </LegalSection>

        <LegalSection id="larangan" title="8. Larangan">
          <LegalList
            items={[
              'Menjual, membeli, atau memperantara akun hasil bajakan, phishing, atau perampasan;',
              'Mengunggah konten yang melanggar hukum Republik Indonesia, termasuk konten SARA, kekerasan, dan penipuan;',
              'Menyalahgunakan data akun yang sempat diakses dalam proses transaksi untuk tujuan apa pun di luar transaksi;',
              'Mengelabui admin dengan bukti pembayaran palsu atau rekaman yang dimanipulasi;',
              'Melakukan scraping otomatis, spam, atau upaya mengganggu keamanan situs;',
              'Menyalin menyalin (meng-clone) tampilan, konten, dan materi situs untuk komersial tanpa izin tertulis.',
            ]}
          />
        </LegalSection>

        <LegalSection id="penangguhan" title="9. Penangguhan & Pembekuan">
          <p>
            Kami berhak menangguhkan atau membekukan akses pengguna — sementara atau permanen — apabila
            terdapat indikasi pelanggaran ketentuan ini, laporan terverifikasi dari pengguna lain,
            permintaan pihak berwenang, atau upaya penipuan. Dana pada transaksi yang terbukti berasal
            dari penipuan dapat dibekukan untuk proses investigasi dan penyelesaian sesuai peraturan
            yang berlaku.
          </p>
        </LegalSection>

        <LegalSection id="tanggung-jawab" title="10. Batasan Tanggung Jawab">
          <p>
            Layanan disediakan &ldquo;sebagaimana adanya&rdquo;. Sejauh diizinkan oleh hukum yang
            berlaku, tanggung jawab kami atas kerugian tidak langsung, kehilangan keuntungan, atau
            kehilangan data dibatasi pada nilai transaksi yang bersangkutan. Ketentuan ini tidak
            mengurangi hak-hak konsumen yang dijamin oleh{' '}
            <strong>Undang-Undang No. 8 Tahun 1999 tentang Perlindungan Konsumen</strong>.
          </p>
          <p>
            Kami tidak berafiliasi dengan platform asal akun (Meta, TikTok, Google, Moonton, dan
            lainnya). Nama platform digunakan semata untuk mendeskripsikan jenis produk.
          </p>
        </LegalSection>

        <LegalSection id="hukum" title="11. Hukum yang Berlaku">
          <p>
            Ketentuan ini tunduk pada hukum Republik Indonesia, termasuk{' '}
            <strong>Undang-Undang No. 27 Tahun 2022 tentang Pelindungan Data Pribadi</strong> dan{' '}
            <strong>Undang-Undang Informasi dan Transaksi Elektronik beserta perubahannya</strong>.
            Setiap sengketa diselesaikan terlebih dahulu secara musyawarah, dan bila tidak tercapai,
            melalui pengadilan yang wilayah hukumnya meliputi Jakarta Pusat.
          </p>
        </LegalSection>

        <LegalSection id="perubahan" title="12. Perubahan Ketentuan">
          <p>
            Kami dapat memperbarui ketentuan ini sewaktu-waktu. Versi terbaru selalu tersedia di
            halaman ini beserta tanggal pembaruannya di bagian atas. Perubahan penting akan kami
            informasikan melalui kanal resmi kami. Penggunaan layanan setelah perubahan berarti kamu
            menyetujui versi terbaru.
          </p>
        </LegalSection>

        <LegalSection id="kontak" title="13. Kontak">
          <p>
            Pertanyaan mengenai Syarat &amp; Ketentuan ini dapat disampaikan melalui:
          </p>
          <LegalList
            items={[
              <>WhatsApp admin (24/7): {SITE.whatsappDisplay} — dijawab manusia asli, bukan bot.</>,
              <>Email: {SITE.email}.</>,
              <>Kantor: {SITE.address}.</>,
            ]}
          />
        </LegalSection>
      </LegalArticle>
    </PageShell>
  )
}
