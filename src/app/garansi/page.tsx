import type { Metadata } from 'next'
import { CheckCircle2, Camera, Clock, MessageCircle, RefreshCcw, ShieldCheck, Video, Wallet } from 'lucide-react'
import { PageHero } from '@/components/pusatakun/page-hero'
import { LegalArticle, LegalList, LegalSection, type TocItem } from '@/components/pusatakun/legal-article'
import { PageShell } from '@/components/pusatakun/page-shell'
import { SITE, waLink } from '@/lib/marketplace'
import { getPageCategories } from '@/lib/page-data'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Kebijakan Garansi & Pengembalian',
  description:
    'Kebijakan garansi Pusatakun — masa garansi tiap jenis akun, cara klaim langkah demi langkah, pilihan penggantian akun atau pengembalian dana, serta kondisi yang membatalkan garansi.',
  alternates: { canonical: '/garansi' },
  robots: { index: true, follow: true },
}

const TOC: TocItem[] = [
  { id: 'janji', label: 'Janji Garansi Kami' },
  { id: 'masa-garansi', label: 'Masa Garansi per Produk' },
  { id: 'cara-klaim', label: 'Cara Klaim (4 Langkah)' },
  { id: 'pilihan', label: 'Penggantian atau Refund' },
  { id: 'waktu', label: 'Waktu Penyelesaian' },
  { id: 'membatalkan', label: 'Yang Membatalkan Garansi' },
  { id: 'bukan-garansi', label: 'Yang Bukan Cakupan Garansi' },
  { id: 'tips', label: 'Tips Agar Klaim Mudah Disetujui' },
  { id: 'kontak', label: 'Kontak' },
]

function StepCard({
  step,
  icon,
  title,
  children,
}: {
  step: string
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          {icon}
        </span>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
            Langkah {step}
          </p>
          <h3 className="text-sm font-extrabold text-foreground">{title}</h3>
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{children}</p>
    </div>
  )
}

export default async function GaransiPage() {
  const categories = await getPageCategories()

  return (
    <PageShell categories={categories}>
      <PageHero
        kicker="PROTEKSI PEMBELI"
        title="Kebijakan Garansi &"
        highlight="Pengembalian"
        description="Setiap akun di Pusatakun dibeli bersama garansi tertulis di halaman produknya. Di halaman ini kamu bisa melihat masa garansi, cara klaim, pilihan ganti rugi, dan kondisi yang perlu kamu hindari."
        breadcrumb={[{ label: 'Kebijakan Garansi & Pengembalian' }]}
      />

      <LegalArticle toc={TOC} updated="1 November 2026">
        {/* Janji garansi — kartu khusus di atas TOC content */}
        <div className="rounded-2xl border border-primary/30 bg-primary/10 p-6">
          <p className="flex items-center gap-2 text-lg font-extrabold text-foreground">
            <ShieldCheck className="h-6 w-6 text-primary" aria-hidden="true" />
            Janji Garansi Kami
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Jika akun yang kamu beli mengalami masalah <strong>dalam masa garansi</strong> — seperti
            akun tidak bisa login, diambil kembali penjual, atau tidak sesuai deskripsi — kamu berhak
            memilih <strong className="text-foreground">penggantian akun setara</strong> atau{' '}
            <strong className="text-foreground">pengembalian dana 100%</strong>. Klaim cukup lewat
            chat admin, tanpa biaya, tanpa ribet.
          </p>
        </div>

        <LegalSection id="masa-garansi" title="1. Masa Garansi per Produk">
          <p>
            Masa garansi tertera pada setiap kartu produk dan halaman detailnya. Standar yang kami
            pakai:
          </p>
          <LegalList
            items={[
              <><strong>Garansi Full 30 Hari</strong> — umumnya untuk akun media sosial fresh/berumur baru, akun dengan email pemulihan aktif, dan akun premium. Cakupan paling luas: ganti akun atau refund untuk masalah akses apa pun yang bukan kesalahan pembeli.</>,
              <><strong>Garansi 7 Hari</strong> — umumnya untuk akun aged/token (mis. token Discord aged) dan akun dengan tingkat kebutuhan verifikasi tambahan. Mencakup gagal login dan pengambilalihan oleh pihak luar.</>,
              <><strong>Garansi 1 Hari (check-in)</strong> — umumnya untuk produk berharga sangat murah atau akses instan. Menjamin akun dapat diakses saat serah terima pertama. Periksa langsung saat penerimaan.</>,
            ]}
          />
          <p>
            Masa garansi dihitung sejak admin menyerahkan data akun kepada pembeli (waktu chat
            serah terima menjadi acuan).
          </p>
        </LegalSection>

        <LegalSection id="cara-klaim" title="2. Cara Klaim — Cukup 4 Langkah">
          <div className="grid gap-4 sm:grid-cols-2">
            <StepCard step="1" icon={<MessageCircle className="h-5 w-5" aria-hidden="true" />} title="Chat Admin">
              Hubungi WhatsApp admin {SITE.whatsappDisplay}. Sertakan kode pesanan atau nama produk yang kamu beli.
            </StepCard>
            <StepCard step="2" icon={<Video className="h-5 w-5" aria-hidden="true" />} title="Kirim Bukti Video">
              Kirim rekaman layar dari percobaan login yang bermasalah (tanpa potong/edits). Video serah terima pertama adalah bukti terkuat.
            </StepCard>
            <StepCard step="3" icon={<Clock className="h-5 w-5" aria-hidden="true" />} title="Admin Verifikasi">
              Admin menelusuri chat transaksi dan buktimu. Selama data lengkap, verifikasi umumnya selesai dalam hitungan jam.
            </StepCard>
            <StepCard step="4" icon={<RefreshCcw className="h-5 w-5" aria-hidden="true" />} title="Pilih Ganti atau Refund">
              Kamu yang memilih: akun pengganti setara (ready stok) atau pengembalian dana penuh ke rekening/e-wallet asal pembayaran.
            </StepCard>
          </div>
        </LegalSection>

        <LegalSection id="pilihan" title="3. Penggantian atau Pengembalian Dana">
          <LegalList
            items={[
              <><strong>Penggantian akun setara</strong> — diprioritaskan bila stok produk sejenis tersedia; kamu mendapat akun dengan spesifikasi tidak lebih rendah dari yang dibeli.</>,
              <><strong>Pengembalian dana 100%</strong> — dipilih bila tidak ada stok pengganti yang cocok, atau kamu memang memilih uang kembali. Dana dikembalikan ke kanal pembayaran asal.</>,
              <><strong>Selama masa garansi berjalan</strong>, akun pengganti juga terikat sisa masa garansi dari transaksi awal.</>,
            ]}
          />
        </LegalSection>

        <LegalSection id="waktu" title="4. Waktu Penyelesaian">
          <LegalList
            items={[
              'Verifikasi klaim: paling lambat 1×24 jam sejak bukti lengkap diterima (umumnya jauh lebih cepat karena admin online 24/7);',
              'Penggantian akun: paling lambat 1×24 jam setelah verifikasi;',
              'Pengembalian dana: paling lambat 2×24 jam setelah verifikasi, tergantung penerbit rekening/e-wallet.',
            ]}
          />
        </LegalSection>

        <LegalSection id="membatalkan" title="5. Yang Membatalkan Garansi">
          <LegalList
            items={[
              'Masa garansi telah berakhir;',
              'Bukti video penerimaan tidak ada, atau video yang dikirim menunjukkan manipulasi;',
              'Pelanggaran aturan platform asal oleh pembeli (spam, penipuan, konten terlarang) yang membuat akun dibekukan platform;',
              'Pembeli menyerahkan/membagikan akses akun kepada pihak lain sebelum klaim;',
              'Pembeli gagal mengamankan akun (tidak mengganti kata sandi/email pemulihan) lalu akun diambil orang lain;',
              'Klaim diajukan melalui nomor WhatsApp yang tidak terdaftar pada transaksi tanpa konfirmasi admin.',
            ]}
          />
        </LegalSection>

        <LegalSection id="bukan-garansi" title="6. Yang Bukan Cakupan Garansi">
          <LegalList
            items={[
              'Perubahan kebijakan atau pembekuan sepihak dari platform asal akun di luar kesalahan penjual (contoh: platform memperketat verifikasi secara global);',
              'Perubahan fitur platform (mis. fitur dihapus/diubah oleh pengembang game/aplikasi);',
              'Kerugian akibat salah beli: keinginan ganti produk, salah hitung kebutuhan, atau berubah pikiran — karena akun digital sudah terlihat isinya saat serah terima;',
              'Banned akibat aktivitas pembeli setelah akun diterima.',
            ]}
          />
          <p>
            Untuk kasus di luar cakupan, admin tetap berupaya membantu mencari solusi terbaik —
            pendekatan kami adalah menyelesaikan dengan adil, bukan sekadar menunjuk aturan.
          </p>
        </LegalSection>

        <LegalSection id="tips" title="7. Tips Agar Klaim Mudah Disetujui">
          <LegalList
            items={[
              <>
                <span className="inline items-center gap-1.5 font-semibold text-foreground">
                  <Camera className="mr-1 inline h-4 w-4 text-primary" aria-hidden="true" />
                  Rekam video saat serah terima:
                </span>{' '}
                mulai dari membuka chat admin, login pertama, hingga memeriksa isi akun — sekali rekam, aman sepanjang garansi.
              </>,
              <>
                <span className="inline items-center gap-1.5 font-semibold text-foreground">
                  <CheckCircle2 className="mr-1 inline h-4 w-4 text-primary" aria-hidden="true" />
                  Amankan akun di hari pertama:
                </span>{' '}
                ganti kata sandi, pasang email/nomor pemulihan milikmu, dan aktifkan verifikasi dua langkah bila tersedia.
              </>,
              <>
                <span className="inline items-center gap-1.5 font-semibold text-foreground">
                  <Wallet className="mr-1 inline h-4 w-4 text-primary" aria-hidden="true" />
                  Bayar hanya lewat kanal admin:
                </span>{' '}
                simpan bukti pembayaran di chat yang sama agar riwayatnya utuh.
              </>,
            ]}
          />
        </LegalSection>

        <LegalSection id="kontak" title="8. Kontak Klaim">
          <p>
            Ajukan klaim atau pertanyaan garansi melalui WhatsApp resmi{' '}
            <a href={waLink('Halo Admin Pusatakun! Saya ingin klaim garansi untuk pesanan saya.')} target="_blank" rel="noopener noreferrer">
              {SITE.whatsappDisplay}
            </a>{' '}
            (online 24/7) atau email {SITE.email}. Ketentuan umum transaksi tetap merujuk pada{' '}
            <a href="/syarat-ketentuan">Syarat &amp; Ketentuan</a>.
          </p>
        </LegalSection>
      </LegalArticle>
    </PageShell>
  )
}
