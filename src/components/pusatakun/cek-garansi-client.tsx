'use client'

/**
 * PUSATAKUN — Cek garansi: form kode -> API /api/garansi -> kartu garansi + progress.
 */

import { useState } from 'react'
import Link from 'next/link'
import { Loader2, ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react'
import { Reveal } from '@/components/pusatakun/motion-primitives'
import { formatIDR, waLink } from '@/lib/marketplace'

type WarrantyInfo = {
  code: string
  productName: string
  amount: number
  orderStatus: string
  warrantyLabel: string
  warrantyDays: number | null
  status: 'BELUM_AKTIF' | 'AKTIF' | 'HABIS'
  startDate: string | null
  endDate: string | null
  sisaHari: number | null
  progress: number | null
}

function tgl(iso: string | null): string {
  if (!iso) return '-'
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`
}

const STATUS_META = {
  AKTIF: { icon: ShieldCheck, chip: 'bg-emerald-500/15 text-emerald-400', label: 'GARANSI AKTIF' },
  BELUM_AKTIF: { icon: ShieldAlert, chip: 'bg-amber-500/15 text-amber-400', label: 'BELUM AKTIF' },
  HABIS: { icon: ShieldX, chip: 'bg-red-500/15 text-red-400', label: 'GARANSI HABIS' },
} as const

export function CekGaransiClient() {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<WarrantyInfo | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const clean = code.trim().toUpperCase()
    if (!clean) return
    setLoading(true)
    setError(null)
    setData(null)
    try {
      const res = await fetch(`/api/garansi?code=${encodeURIComponent(clean)}`)
      const json = await res.json()
      if (!res.ok || !json.ok) {
        setError(json.error ?? 'Terjadi kesalahan. Coba lagi.')
      } else {
        setData(json.warranty as WarrantyInfo)
      }
    } catch {
      setError('Gagal menghubungi server. Periksa koneksi lalu coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const meta = data ? STATUS_META[data.status] : null

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <form onSubmit={submit} className="glass rounded-2xl p-5 sm:p-6" aria-label="Form cek garansi">
        <label htmlFor="kode-garansi" className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
          Kode Pesanan
        </label>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            id="kode-garansi"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="ORD-XXXXXX"
            autoComplete="off"
            className="min-h-[48px] flex-1 rounded-xl border border-border bg-background/60 px-4 font-mono text-sm uppercase tracking-wider text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-primary/60"
          />
          <button
            type="submit"
            disabled={loading || code.trim().length < 4}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-extrabold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <ShieldCheck className="h-4 w-4" aria-hidden="true" />}
            {loading ? 'Memeriksa…' : 'Cek Garansi'}
          </button>
        </div>
        {error ? (
          <p role="alert" className="mt-3 text-sm font-semibold text-red-400">{error}</p>
        ) : (
          <p className="mt-3 text-xs text-muted-foreground">
            Masa garansi mulai berjalan sejak pesanan berstatus <strong>Selesai</strong> (akun diterima).
          </p>
        )}
      </form>

      {data && meta ? (
        <Reveal>
          <div className="glass mt-6 rounded-2xl p-5 sm:p-7" aria-live="polite">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono text-sm font-bold tracking-wider text-foreground">{data.code}</p>
                <h2 className="mt-1 text-lg font-extrabold text-foreground">{data.productName}</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">{formatIDR(data.amount)} · {data.warrantyLabel}</p>
              </div>
              <span className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-extrabold ${meta.chip}`}>
                <meta.icon className="h-4 w-4" aria-hidden="true" />
                {meta.label}
              </span>
            </div>

            {/* Progress bar masa garansi */}
            {data.progress !== null ? (
              <div className="mt-6">
                <div className="flex justify-between text-xs font-bold text-muted-foreground">
                  <span>Mulai {tgl(data.startDate)}</span>
                  <span>Berakhir {tgl(data.endDate)}</span>
                </div>
                <div
                  className="mt-2 h-3 overflow-hidden rounded-full bg-border/60"
                  role="progressbar"
                  aria-valuenow={data.progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Terpakai ${data.progress}% masa garansi`}
                >
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${data.status === 'AKTIF' ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 'bg-gradient-to-r from-red-600 to-red-400'}`}
                    style={{ width: `${data.progress}%` }}
                  />
                </div>
                <p className="mt-2 text-sm font-extrabold text-foreground">
                  {data.status === 'AKTIF'
                    ? `Sisa ${data.sisaHari} hari garansi`
                    : 'Masa garansi sudah berakhir'}
                </p>
              </div>
            ) : data.status === 'AKTIF' ? (
              <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-muted-foreground">
                <p className="font-extrabold text-emerald-400">Garansi aktif sejak {tgl(data.startDate)}</p>
                <p className="mt-1">
                  Masa garansi pesanan ini mengikuti ketentuan halaman produknya. Untuk detail sisa hari,
                  hubungi admin dengan menyebut kode pesanan.
                </p>
              </div>
            ) : (
              <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-muted-foreground">
                <p className="font-extrabold text-amber-400">Garansi belum aktif</p>
                <p className="mt-1">
                  Pesanan ini berstatus <strong>{data.orderStatus.replace(/_/g, ' ').toLowerCase()}</strong>.
                  Masa garansi mulai dihitung setelah akun diterima (pesanan selesai).{' '}
                  <Link href="/lacak" className="font-bold text-primary hover:underline">
                    Lacak status pesanan →
                  </Link>
                </p>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={waLink(`Halo Admin Pusatakun! Saya ingin klaim garansi untuk pesanan *${data.code}* (${data.productName}). Saya punya video unboxing. Mohon dibantu prosesnya ya.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center rounded-xl bg-primary px-5 text-sm font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Klaim Garansi via WhatsApp
              </a>
              <Link
                href="/garansi"
                className="inline-flex min-h-[44px] items-center rounded-xl border border-primary/50 px-5 text-sm font-extrabold text-primary transition-colors hover:bg-primary/10"
              >
                Baca Kebijakan Garansi
              </Link>
            </div>
          </div>
        </Reveal>
      ) : null}
    </div>
  )
}
