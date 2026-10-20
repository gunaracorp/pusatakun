'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  BadgeCheck,
  Check,
  Crown,
  Loader2,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  Store,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import {
  formatIDR,
  initialsOf,
  orderWaLink,
  type SellerListingDTO,
} from '@/lib/marketplace'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import { Reveal, SectionHeading } from './motion-primitives'

export function SellerListingsSection() {
  const { user } = useAuthStore()
  const router = useRouter()
  const { toast } = useToast()

  const [listings, setListings] = useState<SellerListingDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [detail, setDetail] = useState<SellerListingDTO | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [ordering, setOrdering] = useState(false)
  const [placedOrder, setPlacedOrder] = useState<{ code: string; name: string } | null>(null)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/listings?limit=8', { cache: 'no-store' })
      const data = (await res.json()) as { ok: boolean; listings?: SellerListingDTO[] }
      if (data.ok && data.listings) setListings(data.listings)
    } catch {
      // senyap — section tetap tampil dgn empty state
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const hasListings = listings.length > 0
  const heading = useMemo(
    () => ({
      kicker: 'Marketplace Penjual Terverifikasi',
      title: 'Akun Langsung dari Sesama Pengguna',
      highlight: 'Penjual',
      subtitle:
        'Akun pilihan yang dikurasi manual oleh admin — identitas penjual terverifikasi WhatsApp, dana pembeli diamankan sistem escrow Raja Akun.',
    }),
    [],
  )

  async function handleBuy(listing: SellerListingDTO) {
    if (!user) {
      setDetailOpen(false)
      router.push('/masuk')
      toast({
        title: 'Masuk dulu ya',
        description: 'Login pakai WhatsApp untuk memesan akun ini — cepat, 20 detik.',
      })
      return
    }
    setOrdering(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: listing.title,
          amount: listing.price,
          productId: listing.id,
        }),
      })
      const data = (await res.json()) as {
        ok: boolean
        order?: { code: string; productName: string }
        error?: string
      }
      if (!res.ok || !data.ok || !data.order) {
        toast({ title: 'Gagal membuat pesanan', description: data.error, variant: 'destructive' })
        return
      }
      setPlacedOrder({ code: data.order.code, name: data.order.productName })
      void load()
    } catch {
      toast({
        title: 'Koneksi bermasalah',
        description: 'Coba lagi ya.',
        variant: 'destructive',
      })
    } finally {
      setOrdering(false)
    }
  }

  return (
    <section id="studio-penjual" aria-label="Akun dari penjual terverifikasi" className="scroll-mt-28 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            kicker={heading.kicker}
            title={heading.title}
            highlight={heading.highlight}
            subtitle={heading.subtitle}
          />
        </Reveal>

        {loading ? (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-56 animate-pulse rounded-3xl border border-border bg-card/40" />
            ))}
          </div>
        ) : hasListings ? (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {listings.map((listing, index) => (
              <Reveal key={listing.id} delay={index * 0.06}>
                <article className="group flex h-full flex-col rounded-3xl border border-border bg-card/50 p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                      <Store className="h-3 w-3" aria-hidden="true" />
                      {listing.platformName}
                    </span>
                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      {listing.level}
                    </span>
                  </div>

                  <h3 className="mt-3 line-clamp-2 text-sm font-extrabold leading-snug text-foreground">
                    {listing.title}
                  </h3>

                  {listing.followers && (
                    <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Users className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                      {listing.followers} follower
                    </p>
                  )}

                  <div className="mt-auto pt-4">
                    <p className="text-lg font-extrabold text-primary">{formatIDR(listing.price)}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 text-[10px] font-extrabold text-zinc-950"
                      >
                        {listing.sellerInitials}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-xs font-bold text-foreground">
                          {listing.sellerName ?? 'Penjual RA'}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                          <BadgeCheck className="h-3 w-3" aria-hidden="true" />
                          Terverifikasi
                        </span>
                      </span>
                    </div>
                    <Button
                      onClick={() => {
                        setDetail(listing)
                        setDetailOpen(true)
                      }}
                      className="mt-4 h-11 w-full rounded-full text-sm font-bold"
                    >
                      <MessageCircle className="mr-1.5 h-4 w-4" aria-hidden="true" />
                      Lihat & Beli
                    </Button>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal>
            <div className="mx-auto mt-12 max-w-2xl rounded-3xl border border-dashed border-primary/30 bg-primary/5 p-10 text-center">
              <Store className="mx-auto h-10 w-10 text-primary" aria-hidden="true" />
              <h3 className="mt-4 text-xl font-extrabold text-foreground">
                Jadilah Penjual Pertama di Rak Ini!
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Rak akun dari penjual terverifikasi ini masih kosong. Punya akun media sosial atau
                game yang mau dijual? Daftar sebagai penjual gratis — admin mengurasi maksimal 1x24
                jam, dan akunmu tampil di sini.
              </p>
              <SellerCtaButtons />
            </div>
          </Reveal>
        )}
      </div>

      {/* Detail + checkout listing */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="glass max-h-[92vh] overflow-y-auto border-border sm:max-w-md">
          {placedOrder ? (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
                <PackageCheck className="h-8 w-8 text-emerald-400" aria-hidden="true" />
              </div>
              <DialogHeader className="items-center">
                <DialogTitle className="text-xl font-extrabold">Pesanan Tercatat!</DialogTitle>
                <DialogDescription>
                  {placedOrder.name} — kode pesanan:{' '}
                  <span className="font-mono font-bold text-primary">{placedOrder.code}</span>
                </DialogDescription>
              </DialogHeader>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Lanjutkan ke WhatsApp admin untuk pembayaran & pengiriman. Admin aktif 24/7 —
                transaksi dilindungi escrow & garansi Raja Akun.
              </p>
              <Button asChild className="h-12 w-full rounded-full font-bold">
                <a
                  href={orderWaLink(placedOrder.code, placedOrder.name, user?.name ?? '')}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-1.5 h-5 w-5" aria-hidden="true" />
                  Proses via WhatsApp Admin
                </a>
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setDetailOpen(false)
                  setPlacedOrder(null)
                }}
                className="h-10 w-full"
              >
                Nanti Saja
              </Button>
            </div>
          ) : detail ? (
            <div className="space-y-5">
              <DialogHeader>
                <DialogTitle className="flex items-start gap-2 text-left text-lg font-extrabold">
                  <span className="mt-0.5 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                    {detail.platformName}
                  </span>
                </DialogTitle>
                <DialogDescription className="text-left">
                  <span className="block text-base font-extrabold text-foreground">{detail.title}</span>
                  {detail.followers && (
                    <span className="mt-1 block text-xs">
                      {detail.followers} follower · Level {detail.level} · {detail.code}
                    </span>
                  )}
                </DialogDescription>
              </DialogHeader>

              <p className="text-sm leading-relaxed text-muted-foreground">{detail.description}</p>

              <div className="rounded-2xl border border-border bg-card/40 p-4">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 text-xs font-extrabold text-zinc-950"
                  >
                    {detail.sellerInitials}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      {detail.sellerName ?? 'Penjual Raja Akun'}
                    </p>
                    <p className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                      <BadgeCheck className="h-3 w-3" aria-hidden="true" />
                      Terverifikasi WhatsApp · Kurasi Admin
                    </p>
                  </div>
                </div>
                <ul className="mt-3 space-y-1.5 border-t border-border pt-3">
                  {['Dana diamankan escrow Raja Akun', 'Garansi sesuai S&K admin', 'Bantuan transfer akun oleh admin'].map(
                    (point) => (
                      <li key={point} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                        {point}
                      </li>
                    ),
                  )}
                </ul>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-primary/25 bg-primary/5 p-4">
                <span className="text-sm font-semibold text-muted-foreground">Harga akun</span>
                <span className="text-2xl font-extrabold text-primary">{formatIDR(detail.price)}</span>
              </div>

              <Button
                onClick={() => void handleBuy(detail)}
                disabled={ordering}
                className="h-12 w-full rounded-full text-base font-bold"
              >
                {ordering ? (
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                ) : user ? (
                  <Check className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Crown className="h-5 w-5" aria-hidden="true" />
                )}
                {user ? 'Pesan Sekarang' : 'Masuk untuk Membeli'}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Pesanan tercatat otomatis, dilanjutkan via WhatsApp admin 24/7.
              </p>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  )
}

/** CTA penjual — dipisah agar store diakses di komponen klien kecil. */
export function SellerCtaButtons() {
  const { user, openDashboard } = useAuthStore()
  const router = useRouter()
  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
      {user ? (
        <Button onClick={() => openDashboard('seller')} className="h-12 rounded-full px-6 font-bold">
          <Store className="mr-1.5 h-5 w-5" aria-hidden="true" />
          Buka Dashboard Penjual
        </Button>
      ) : (
        <Button
          onClick={() => router.push('/daftar?peran=penjual')}
          className="h-12 rounded-full px-6 font-bold"
        >
          <Crown className="mr-1.5 h-5 w-5" aria-hidden="true" />
          Daftar Penjual via WhatsApp
        </Button>
      )}
    </div>
  )
}
