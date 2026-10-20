'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  BadgeCheck,
  Clock3,
  Crown,
  Eye,
  Loader2,
  MessageCircle,
  PackageCheck,
  Plus,
  RefreshCw,
  Send,
  Store,
  XCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import {
  formatIDR,
  initialsOf,
  listingWaLink,
  LISTING_STATUS_LABEL,
  type CategoryDTO,
  type ListingStatus,
  type SellerListingDTO,
  type SellerStatsDTO,
} from '@/lib/marketplace'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth-store'

const STATUS_STYLE: Record<ListingStatus, string> = {
  PENDING: 'bg-amber-500/15 text-amber-400',
  APPROVED: 'bg-emerald-500/15 text-emerald-400',
  REJECTED: 'bg-red-500/15 text-red-400',
  SOLD: 'bg-zinc-500/20 text-zinc-300',
}

const LEVELS_SELLER = ['FRESH', 'AMAN', 'PREMIUM', 'MONETIZE']

export function SellerDashboardSheet({ categories }: { categories: CategoryDTO[] }) {
  const { toast } = useToast()
  const { user, dashboard, closeDashboard, setUser } = useAuthStore()
  const open = dashboard === 'seller'

  const [listings, setListings] = useState<SellerListingDTO[]>([])
  const [stats, setStats] = useState<SellerStatsDTO>({ total: 0, pending: 0, approved: 0, sold: 0 })
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)

  // form state
  const [platform, setPlatform] = useState('')
  const [title, setTitle] = useState('')
  const [followers, setFollowers] = useState('')
  const [price, setPrice] = useState('')
  const [level, setLevel] = useState('AMAN')
  const [description, setDescription] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const res = await fetch('/api/listings?mine=1', { cache: 'no-store' })
      const data = (await res.json()) as { ok: boolean; listings?: SellerListingDTO[] }
      if (data.ok && data.listings) {
        setListings(data.listings)
        setStats({
          total: data.listings.length,
          pending: data.listings.filter((l) => l.status === 'PENDING').length,
          approved: data.listings.filter((l) => l.status === 'APPROVED').length,
          sold: data.listings.filter((l) => l.status === 'SOLD').length,
        })
      }
    } catch {
      // diam: toast error cukup di submit
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (open) void load()
  }, [open, load])

  async function handleSubmit() {
    setFormError(null)
    if (!platform) {
      setFormError('Pilih platform akun dulu ya.')
      return
    }
    const priceNum = Number(price.replace(/\D+/g, ''))
    setSubmitting(true)
    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          title,
          description,
          price: priceNum,
          followers: followers || undefined,
          level,
        }),
      })
      const data = (await res.json()) as {
        ok: boolean
        listing?: SellerListingDTO
        user?: { role: 'BUYER' | 'SELLER' | 'ADMIN' }
        error?: string
      }
      if (!res.ok || !data.ok || !data.listing) {
        setFormError(data.error ?? 'Gagal mendaftarkan akun.')
        return
      }
      if (data.user && user) setUser({ ...user, role: data.user.role })
      toast({
        title: `Listing ${data.listing.code} terkirim!`,
        description: 'Menunggu kurasi admin (maks. 1x24 jam). Cek status di daftar bawah.',
      })
      setTitle('')
      setFollowers('')
      setPrice('')
      setDescription('')
      setShowForm(false)
      void load()
    } catch {
      setFormError('Koneksi bermasalah. Coba lagi ya.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={(o) => !o && closeDashboard()}>
      <SheetContent side="right" className="glass w-full overflow-y-auto border-l border-border sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-xl font-extrabold">
            <Store className="h-5 w-5 text-primary" aria-hidden="true" />
            Dashboard Penjual
          </SheetTitle>
          <SheetDescription>
            Kelola toko akunmu — daftarkan akun, pantau kurasi admin, dan pantau penjualan.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-4 pb-10">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Total', value: stats.total, icon: PackageCheck },
              { label: 'Kurasi', value: stats.pending, icon: Clock3 },
              { label: 'Tayang', value: stats.approved, icon: Eye },
              { label: 'Terjual', value: stats.sold, icon: Crown },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-border bg-card/40 p-3 text-center">
                <item.icon className="mx-auto h-4 w-4 text-primary" aria-hidden="true" />
                <p className="mt-1 text-lg font-extrabold text-foreground">{item.value}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          {/* Form toggle */}
          <Button
            onClick={() => setShowForm((s) => !s)}
            className="h-12 w-full rounded-full font-bold"
            aria-expanded={showForm}
          >
            {showForm ? (
              <XCircle className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Plus className="h-5 w-5" aria-hidden="true" />
            )}
            {showForm ? 'Tutup Form' : 'Daftarkan Akun untuk Dijual'}
          </Button>

          {showForm && (
            <form
              className="space-y-4 rounded-2xl border border-border bg-card/40 p-4"
              onSubmit={(e) => {
                e.preventDefault()
                void handleSubmit()
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="listing-platform">Platform</Label>
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger id="listing-platform" className="h-11">
                      <SelectValue placeholder="Pilih platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.slug}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="listing-level">Level akun</Label>
                  <Select value={level} onValueChange={setLevel}>
                    <SelectTrigger id="listing-level" className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LEVELS_SELLER.map((l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="listing-title">Judul akun</Label>
                <Input
                  id="listing-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="cth. Akun IG Aman 12K Follower Niche Kuliner"
                  maxLength={120}
                  className="h-11"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="listing-followers">Jumlah follower (opsional)</Label>
                  <Input
                    id="listing-followers"
                    value={followers}
                    onChange={(e) => setFollowers(e.target.value)}
                    placeholder="cth. 12.5K / 1.2 Jt"
                    maxLength={30}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="listing-price">Harga jual (Rp)</Label>
                  <Input
                    id="listing-price"
                    inputMode="numeric"
                    value={price}
                    onChange={(e) => setPrice(e.target.value.replace(/[^\d]/g, ''))}
                    placeholder="cth. 450000"
                    className="h-11"
                  />
                  {price && (
                    <p className="text-xs font-semibold text-primary">{formatIDR(Number(price))}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="listing-desc">Deskripsi & spesifikasi</Label>
                <Textarea
                  id="listing-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ceritakan isi akun: umur, engagement, email ikutan, riwayat, kelengkapan data login..."
                  rows={4}
                  maxLength={1200}
                />
                <p className="text-right text-[10px] text-muted-foreground">{description.length}/1200</p>
              </div>

              {formError && <p className="text-sm font-medium text-destructive">{formError}</p>}

              <Button type="submit" disabled={submitting} className="h-12 w-full rounded-full font-bold">
                {submitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                ) : (
                  <Send className="h-5 w-5" aria-hidden="true" />
                )}
                Kirim untuk Kurasi Admin
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Listing masuk antrean kurasi admin (maks. 1x24 jam). Notifikasi via WhatsApp.
              </p>
            </form>
          )}

          {/* Daftar listing */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">
                Akun Saya
              </h3>
              <Button variant="ghost" size="sm" className="h-9 gap-1.5 text-xs" onClick={() => void load()}>
                <RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} aria-hidden="true" />
                Muat ulang
              </Button>
            </div>

            {loading && listings.length === 0 && (
              <div className="flex items-center justify-center py-10 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
              </div>
            )}

            {!loading && listings.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center">
                <Store className="mx-auto h-8 w-8 text-muted-foreground/50" aria-hidden="true" />
                <p className="mt-3 text-sm font-semibold text-foreground">Belum ada akun terdaftar</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Klik &ldquo;Daftarkan Akun untuk Dijual&rdquo; di atas untuk mulai berjualan.
                </p>
              </div>
            )}

            {listings.map((listing) => (
              <div key={listing.id} className="rounded-2xl border border-border bg-card/40 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold text-foreground">{listing.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {listing.platformName} · {listing.level} · {listing.code}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLE[listing.status]}`}
                  >
                    {LISTING_STATUS_LABEL[listing.status]}
                  </span>
                </div>
                <p className="mt-2 text-base font-extrabold text-primary">{formatIDR(listing.price)}</p>
                {listing.status === 'REJECTED' && listing.adminNote && (
                  <p className="mt-2 rounded-lg bg-red-500/10 p-2 text-xs text-red-300">
                    Catatan admin: {listing.adminNote}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  {listing.status === 'REJECTED' && (
                    <Button asChild size="sm" variant="outline" className="h-9 rounded-full text-xs">
                      <a
                        href={listingWaLink(listing.code, listing.title, user?.name ?? '')}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                        Tanya Admin
                      </a>
                    </Button>
                  )}
                  {listing.status === 'APPROVED' && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                      <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                      Tayang di katalog penjual
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Info komisi */}
          <div className="rounded-2xl border border-primary/25 bg-primary/5 p-4">
            <p className="flex items-center gap-2 text-sm font-extrabold text-foreground">
              <Crown className="h-4 w-4 text-primary" aria-hidden="true" />
              Program Penjual Raja Akun
            </p>
            <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
              <li>• Gratis tanpa biaya pendaftaran — komisi transparan 90/10</li>
              <li>• Pembayaran komisi H+1 setelah pembeli terkirim</li>
              <li>• Admin memegang escrow: uang pembeli baru lepas setelah akun diterima</li>
              <li>
                • Butuh bantuan?{' '}
                <a
                  href={listingWaLink('', '', user?.name ?? '')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary underline underline-offset-2"
                >
                  Chat admin 24/7
                </a>
              </li>
            </ul>
          </div>

          <p className="text-center text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60">
            {initialsOf(user?.name ?? null)} · {SITE_DOMAIN_SHORT}
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}

const SITE_DOMAIN_SHORT = 'rajaakun.web.id'
