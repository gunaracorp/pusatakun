'use client'

/**
 * PUSATAKUN — Kalkulator profit reseller: slider harga beli/jual/jumlah transaksi
 * -> penerimaan bersih 90%, komisi 10%, margin, ROI. Semua realtime di klien.
 */

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { TrendingUp, Wallet, Percent, Repeat } from 'lucide-react'
import { formatIDR } from '@/lib/marketplace'

const PRESETS = [
  { label: 'Starter', buy: 40000, sell: 65000, qty: 8 },
  { label: 'Rutin', buy: 85000, sell: 130000, qty: 15 },
  { label: 'Serius', buy: 250000, sell: 375000, qty: 20 },
]

function Slider({
  id,
  label,
  value,
  min,
  max,
  step,
  suffix,
  onChange,
}: {
  id: string
  label: string
  value: number
  min: number
  max: number
  step: number
  suffix?: string
  onChange: (v: number) => void
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-xs font-extrabold uppercase tracking-[0.15em] text-muted-foreground">
          {label}
        </label>
        <span className="rounded-lg bg-primary/15 px-2.5 py-1 text-sm font-extrabold text-primary">
          {formatIDR(value)}
          {suffix ? ` ${suffix}` : ''}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2.5 h-2 w-full cursor-pointer appearance-none rounded-full bg-border accent-[#F0A93C]"
        aria-valuetext={formatIDR(value)}
      />
    </div>
  )
}

export function KalkulatorClient() {
  const [buy, setBuy] = useState(85000)
  const [sell, setSell] = useState(130000)
  const [qty, setQty] = useState(15)

  const r = useMemo(() => {
    const marginUnit = Math.max(0, sell - buy)
    const omzetBulan = sell * qty
    const komisi = Math.round(omzetBulan * 0.1)
    const bersih = omzetBulan - komisi
    const modal = buy * qty
    const labaBersih = bersih - modal
    const roi = modal > 0 ? (labaBersih / modal) * 100 : 0
    const marginPct = sell > 0 ? (marginUnit / sell) * 100 : 0
    return { marginUnit, omzetBulan, komisi, bersih, modal, labaBersih, roi, marginPct }
  }, [buy, sell, qty])

  const healthy = sell > buy

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input */}
        <div className="glass rounded-2xl p-6 sm:p-7">
          <h2 className="text-sm font-extrabold uppercase tracking-[0.2em] text-primary">
            Parameter
          </h2>
          <div className="mt-6 space-y-7">
            <Slider id="beli" label="Harga beli / akun" value={buy} min={10000} max={1000000} step={5000} onChange={setBuy} />
            <Slider id="jual" label="Harga jual / akun" value={sell} min={10000} max={1500000} step={5000} onChange={setSell} />
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="qty" className="text-xs font-extrabold uppercase tracking-[0.15em] text-muted-foreground">
                  Transaksi / bulan
                </label>
                <span className="rounded-lg bg-primary/15 px-2.5 py-1 text-sm font-extrabold text-primary">
                  {qty}x
                </span>
              </div>
              <input
                id="qty"
                type="range"
                min={1}
                max={60}
                step={1}
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="mt-2.5 h-2 w-full cursor-pointer appearance-none rounded-full bg-border accent-[#F0A93C]"
                aria-valuetext={`${qty} transaksi per bulan`}
              />
            </div>
          </div>

          <div className="mt-7 border-t border-border pt-5">
            <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-muted-foreground">
              Preset cepat
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    setBuy(p.buy)
                    setSell(p.sell)
                    setQty(p.qty)
                  }}
                  className={`min-h-[40px] rounded-full px-4 text-xs font-bold transition-colors ${
                    buy === p.buy && sell === p.sell && qty === p.qty
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {!healthy ? (
            <p role="alert" className="mt-5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-sm font-semibold text-amber-400">
              Harga jual harus lebih tinggi dari harga beli agar profit terhitung.
            </p>
          ) : null}
        </div>

        {/* Hasil */}
        <div className="glass rounded-2xl p-6 sm:p-7" aria-live="polite">
          <h2 className="text-sm font-extrabold uppercase tracking-[0.2em] text-primary">
            Hasil Simulasi / Bulan
          </h2>
          <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/10 p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Penerimaan bersih kamu (90%)
            </p>
            <p className="mt-1 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              {formatIDR(r.bersih)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              dari omzet {formatIDR(r.omzetBulan)} — komisi platform {formatIDR(r.komisi)} (10%)
            </p>
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-background/40 p-4">
              <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <Wallet className="h-3.5 w-3.5 text-primary" aria-hidden="true" /> Modal per bulan
              </dt>
              <dd className="mt-1.5 text-lg font-extrabold text-foreground">{formatIDR(r.modal)}</dd>
            </div>
            <div className="rounded-xl border border-border bg-background/40 p-4">
              <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5 text-primary" aria-hidden="true" /> Laba bersih
              </dt>
              <dd className={`mt-1.5 text-lg font-extrabold ${r.labaBersih > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {formatIDR(r.labaBersih)}
              </dd>
            </div>
            <div className="rounded-xl border border-border bg-background/40 p-4">
              <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <Percent className="h-3.5 w-3.5 text-primary" aria-hidden="true" /> Margin / unit
              </dt>
              <dd className="mt-1.5 text-lg font-extrabold text-foreground">
                {formatIDR(r.marginUnit)} <span className="text-xs font-bold text-muted-foreground">({r.marginPct.toFixed(1)}%)</span>
              </dd>
            </div>
            <div className="rounded-xl border border-border bg-background/40 p-4">
              <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <Repeat className="h-3.5 w-3.5 text-primary" aria-hidden="true" /> ROI bulanan
              </dt>
              <dd className={`mt-1.5 text-lg font-extrabold ${r.roi > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {r.roi.toFixed(1)}%
              </dd>
            </div>
          </dl>

          <div className="mt-6 rounded-xl border border-border bg-background/40 p-4 text-xs leading-relaxed text-muted-foreground">
            Simulasi ini mengasumsikan semua listing terjual dan tidak termasuk biaya akuisisi akun di luar harga
            beli. Komisi 10% hanya dikenakan saat listing terjual — tidak ada biaya daftar, tidak ada biaya tayang.
          </div>

          <Link
            href="/mitra"
            className="mt-5 inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-primary text-sm font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Mulai Jualan Sekarang — Gratis
          </Link>
        </div>
      </div>
    </div>
  )
}
