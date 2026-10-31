'use client'

/**
 * PUSATAKUN — Pelacak pesanan publik: form kode -> API /api/lacak -> timeline status.
 */

import { useState } from 'react'
import { CheckCircle2, CircleDashed, Loader2, PackageSearch, XCircle } from 'lucide-react'
import { Reveal } from '@/components/pusatakun/motion-primitives'
import { waLink, formatIDR, ORDER_STATUS_LABEL, type OrderStatus } from '@/lib/marketplace'

type OrderPublic = {
  code: string
  status: OrderStatus
  productName: string
  amount: number
  quantity: number
  createdAt: string
  updatedAt: string
}

const TIMELINE: { key: OrderStatus; label: string; desc: string }[] = [
  { key: 'MENUNGGU_PEMBAYARAN', label: 'Menunggu Pembayaran', desc: 'Pesanan tercatat — selesaikan pembayaran via kanal resmi admin.' },
  { key: 'DIPROSES', label: 'Diproses', desc: 'Pembayaran diterima — admin memandu serah terima akun (5-15 menit).' },
  { key: 'SELESAI', label: 'Selesai', desc: 'Akun diterima — dana dilepas ke penjual. Garansimu mulai berjalan.' },
]

const STATUS_STYLE: Record<OrderStatus, { chip: string; dot: string }> = {
  MENUNGGU_PEMBAYARAN: { chip: 'bg-amber-500/15 text-amber-400', dot: 'bg-amber-400' },
  DIPROSES: { chip: 'bg-sky-500/15 text-sky-400', dot: 'bg-sky-400' },
  SELESAI: { chip: 'bg-emerald-500/15 text-emerald-400', dot: 'bg-emerald-400' },
  DIBATALKAN: { chip: 'bg-red-500/15 text-red-400', dot: 'bg-red-400' },
}

function formatDateTime(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function LacakClient() {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [order, setOrder] = useState<OrderPublic | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const clean = code.trim().toUpperCase()
    if (!clean) return
    setLoading(true)
    setError(null)
    setOrder(null)
    try {
      const res = await fetch(`/api/lacak?code=${encodeURIComponent(clean)}`)
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setError(data.error ?? 'Terjadi kesalahan. Coba lagi.')
      } else {
        setOrder(data.order as OrderPublic)
      }
    } catch {
      setError('Gagal menghubungi server. Periksa koneksi lalu coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const currentIndex = order
    ? TIMELINE.findIndex((t) => t.key === order.status)
    : -1
  const cancelled = order?.status === 'DIBATALKAN'

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <form onSubmit={submit} className="glass rounded-2xl p-5 sm:p-6" aria-label="Form lacak pesanan">
        <label htmlFor="kode-pesanan" className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
          Kode Pesanan
        </label>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            id="kode-pesanan"
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
            {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <PackageSearch className="h-4 w-4" aria-hidden="true" />}
            {loading ? 'Mencari…' : 'Lacak'}
          </button>
        </div>
        {error ? (
          <p role="alert" className="mt-3 text-sm font-semibold text-red-400">{error}</p>
        ) : (
          <p className="mt-3 text-xs text-muted-foreground">
            Kode pesanan ada di pesan WhatsApp konfirmasi checkout-mu.
          </p>
        )}
      </form>

      {order ? (
        <Reveal>
          <div className="glass mt-6 rounded-2xl p-5 sm:p-7" aria-live="polite">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono text-sm font-bold tracking-wider text-foreground">{order.code}</p>
                <h2 className="mt-1 text-lg font-extrabold text-foreground">{order.productName}</h2>
              </div>
              <span className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-extrabold ${STATUS_STYLE[order.status].chip}`}>
                <span className={`h-2 w-2 rounded-full ${STATUS_STYLE[order.status].dot}`} aria-hidden="true" />
                {ORDER_STATUS_LABEL[order.status]}
              </span>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-background/40 p-3.5">
                <dt className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Total</dt>
                <dd className="mt-1 font-extrabold text-foreground">{formatIDR(order.amount)}</dd>
              </div>
              <div className="rounded-xl border border-border bg-background/40 p-3.5">
                <dt className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Jumlah</dt>
                <dd className="mt-1 font-extrabold text-foreground">{order.quantity}x</dd>
              </div>
              <div className="rounded-xl border border-border bg-background/40 p-3.5">
                <dt className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Dibuat</dt>
                <dd className="mt-1 font-extrabold text-foreground">{formatDateTime(order.createdAt)}</dd>
              </div>
            </dl>

            {/* Timeline */}
            {cancelled ? (
              <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" aria-hidden="true" />
                <div>
                  <p className="text-sm font-extrabold text-red-400">Pesanan Dibatalkan</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Dana yang sudah dibayar dikembalikan sesuai ketentuan. Buat pesanan baru kapan saja —
                    atau tanyakan ke admin jika ini kekeliruan.
                  </p>
                  <a
                    href={waLink(`Halo Admin Pusatakun! Pesanan saya *${order.code}* berstatus dibatalkan. Mohon dibantu cek ya.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex min-h-[40px] items-center rounded-lg bg-primary px-4 text-xs font-extrabold text-primary-foreground"
                  >
                    Tanya Admin Pesanan Ini
                  </a>
                </div>
              </div>
            ) : (
              <ol className="mt-7 space-y-0" aria-label="Progres pesanan">
                {TIMELINE.map((step, i) => {
                  const done = i <= currentIndex
                  const active = i === currentIndex
                  return (
                    <li key={step.key} className="relative flex gap-4 pb-7 last:pb-0">
                      {i < TIMELINE.length - 1 ? (
                        <span
                          aria-hidden="true"
                          className={`absolute left-[13px] top-7 h-full w-0.5 ${i < currentIndex ? 'bg-primary' : 'bg-border'}`}
                        />
                      ) : null}
                      <span className="relative z-10 mt-0.5 shrink-0">
                        {done ? (
                          <CheckCircle2 className={`h-6 w-6 ${active ? 'text-primary' : 'text-emerald-400'}`} aria-hidden="true" />
                        ) : (
                          <CircleDashed className="h-6 w-6 text-muted-foreground/40" aria-hidden="true" />
                        )}
                      </span>
                      <div>
                        <p className={`text-sm font-extrabold ${active ? 'text-primary' : done ? 'text-foreground' : 'text-muted-foreground/50'}`}>
                          {step.label} {active ? '— posisi sekarang' : ''}
                        </p>
                        <p className={`mt-0.5 text-sm leading-relaxed ${active || done ? 'text-muted-foreground' : 'text-muted-foreground/40'}`}>
                          {step.desc}
                        </p>
                        {active && order.status === 'MENUNGGU_PEMBAYARAN' ? (
                          <a
                            href={waLink(`Halo Admin Pusatakun! Saya mau menyelesaikan pembayaran pesanan *${order.code}* (${order.productName}). Mohon dibantu ya.`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex min-h-[40px] items-center rounded-lg bg-primary px-4 text-xs font-extrabold text-primary-foreground"
                          >
                            Selesaikan Pembayaran
                          </a>
                        ) : null}
                        {active && order.status === 'SELESAI' ? (
                          <a
                            href="/cek-garansi"
                            className="mt-3 inline-flex min-h-[40px] items-center rounded-lg border border-primary/50 px-4 text-xs font-extrabold text-primary transition-colors hover:bg-primary/10"
                          >
                            Cek Masa Garansi →
                          </a>
                        ) : null}
                      </div>
                    </li>
                  )
                })}
              </ol>
            )}
            <p className="mt-5 text-xs text-muted-foreground/70">
              Terakhir diperbarui sistem: {formatDateTime(order.updatedAt)}
            </p>
          </div>
        </Reveal>
      ) : null}
    </div>
  )
}
