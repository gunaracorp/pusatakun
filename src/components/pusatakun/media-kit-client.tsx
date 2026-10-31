'use client'

/**
 * PUSATAKUN — Media kit interaktif: palet warna copy-hex, unduh logo, tipografi.
 */

import { useState } from 'react'
import { Check, Copy, Download } from 'lucide-react'
import { Reveal } from '@/components/pusatakun/motion-primitives'
import { useToast } from '@/hooks/use-toast'

const COLORS = [
  { name: 'Royal Gold', hex: '#F0A93C', usage: 'Warna utama brand — CTA, highlight, logo' },
  { name: 'Champagne Light', hex: '#FFD97A', usage: 'Gradasi emas terang — aksen teks & ikon' },
  { name: 'Amber Deep', hex: '#E8961E', usage: 'Gradasi emas gelap — batas gradasi bawah' },
  { name: 'Royal Night', hex: '#141210', usage: 'Latar utama gelap — semua halaman' },
  { name: 'Panel Brown', hex: '#2F2820', usage: 'Panel .glass — kartu & permukaan komponen' },
  { name: 'Ivory Cream', hex: '#F7F0E2', usage: 'Teks subjudul di atas gelap' },
]

export function MediaKitClient() {
  const [copied, setCopied] = useState<string | null>(null)
  const { toast } = useToast()

  async function copyHex(hex: string) {
    try {
      await navigator.clipboard.writeText(hex)
      setCopied(hex)
      setTimeout(() => setCopied(null), 2000)
      toast({ title: 'Kode warna disalin', description: hex })
    } catch {
      toast({ title: 'Gagal menyalin', description: `Catat manual ya: ${hex}` })
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Palet warna */}
      <Reveal>
        <h2 className="text-xl font-extrabold text-foreground sm:text-2xl">Palet Warna Royal Gold</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Klik kartu warna untuk menyalin kode hex-nya.
        </p>
      </Reveal>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {COLORS.map((c, i) => (
          <Reveal key={c.hex} delay={i * 0.05}>
            <button
              type="button"
              onClick={() => copyHex(c.hex)}
              aria-label={`Salin kode warna ${c.name} ${c.hex}`}
              className="glass group w-full rounded-2xl p-4 text-left transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-14 w-14 shrink-0 rounded-xl border border-white/10 shadow-inner"
                  style={{ backgroundColor: c.hex }}
                  aria-hidden="true"
                />
                <span className="min-w-0">
                  <span className="block text-sm font-extrabold text-foreground">{c.name}</span>
                  <span className="mt-0.5 flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                    {c.hex}
                    {copied === c.hex ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-60" aria-hidden="true" />
                    )}
                  </span>
                  <span className="mt-1 block truncate text-xs text-muted-foreground/70">{c.usage}</span>
                </span>
              </div>
            </button>
          </Reveal>
        ))}
      </div>

      {/* Logo & tipografi */}
      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <Reveal>
          <div className="glass h-full rounded-2xl p-6">
            <h2 className="text-xl font-extrabold text-foreground sm:text-2xl">Logo Resmi</h2>
            <div className="mt-5 flex flex-col items-center gap-5 rounded-2xl border border-border bg-background/40 p-8 sm:flex-row sm:justify-around">
              <img src="/logo.svg" alt="Logo monogram Pusatakun" className="h-20 w-20" />
              <img src="/icon.svg" alt="Ikon mahkota Pusatakun" className="h-20 w-20" />
            </div>
            <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
              <li>• Jaga ruang kosong minimal setinggi mahkota di sekeliling logo.</li>
              <li>• Jangan mengubah warna, proporsi, atau menambahkan efek pada logo.</li>
              <li>• Di atas latar terang, gunakan versi monokrom gelap (minta ke tim media).</li>
            </ul>
            <a
              href="/logo.svg"
              download="pusatakun-logo.svg"
              className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-primary/50 px-5 text-sm font-extrabold text-primary transition-colors hover:bg-primary/10"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Unduh Logo (SVG)
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="glass h-full rounded-2xl p-6">
            <h2 className="text-xl font-extrabold text-foreground sm:text-2xl">Tipografi &amp; Nama</h2>
            <div className="mt-5 rounded-2xl border border-border bg-background/40 p-6">
              <p className="text-3xl font-extrabold tracking-tight text-foreground">Plus Jakarta Sans</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Keluarga huruf resmi — heading extrabold, body regular.
              </p>
              <div className="mt-4 border-t border-border pt-4">
                <p className="text-lg font-extrabold text-gradient-gold">Pusatakun</p>
                <p className="text-lg font-extrabold text-foreground">PUSATAKUN</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Nama brand ditulis satu kata. &ldquo;Pusatakun&rdquo; di teks, &ldquo;PUSATAKUN&rdquo; di materi display.
                </p>
              </div>
            </div>
            <div className="mt-5 rounded-2xl border border-border bg-background/40 p-6 text-sm leading-relaxed text-muted-foreground">
              <p className="font-extrabold text-foreground">Nada bicara</p>
              <p className="mt-2">
                Rendah hati tapi tegas. Seperti admin kami: manusia asli yang menjawab cepat, tidak
                bombastis, dan selalu menyebut angka yang bisa diverifikasi. Hindari jargon berlebihan dan
                janji mustahil.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
