'use client'

/**
 * RAJA AKUN — Dashboard Penjual (/dashboard/penjual)
 * ==================================================
 * Toko penjual: KPI listing, estimasi pendapatan (komisi 90/10),
 * daftarkan akun baru, kelola listing (tarik / chat admin).
 * Pengguna BUYER akan diminta mengaktifkan Mode Penjual dulu.
 */

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  BadgeCheck,
  Banknote,
  Clock3,
  Crown,
  Eye,
  Loader2,
  MessageCircle,
  PackageCheck,
  Percent,
  Plus,
  RefreshCw,
  Send,
  Store,
  Trash2,
  XCircle,
} from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
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
} from '@/lib/marketplace'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth-store'
import { DashboardShell } from './dashboard-shell'

const STATUS_STYLE: Record<ListingStatus, string> = {
  PENDING: 'bg-amber-400 text-zinc-950',
  APPROVED: 'bg-emerald-500 text-zinc-950',
  REJECTED: 'bg-red-500 text-white',
  SOLD: 'bg-zinc-400 text-zinc-950',
}

const LEVELS_SELLER = ['FRESH', 'AMAN', 'PREMIUM', 'MONETIZE']

function formatTanggal(iso: string): string {
  const bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return `${String(d.getDate()).padStart(2, '0')} ${bulan[d.getMonth()]} ${d.getFullYear()}`
}

export function SellerDashboard() {
  const { toast } = useToast()
  const { user, setUser } = useAuthStore()

  const [categories, setCategories] = useState<CategoryDTO[]>([])
  const [listings, setListings] = useState<SellerListingDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [activating, setActivating] = useState(false)

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
      if (data.ok && data.listings) setListings(data.listings)
    } catch {
      // senyap
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    let alive = true
    fetch('/api/categories', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data: { ok: boolean; categories?: CategoryDTO[] }) => {
        if (alive && data.ok && data.categories) setCategories(data.categories)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  const stats = useMemo(() => {
    const sold = listings.filter((l) => l.status === 'SOLD')
    const omzet = sold.reduce((s, l) => s + l.price, 0)
    return {
      total: listings.length,
      pending: listings.filter((l) => l.status === 'PENDING').length,
      approved: listings.filter((l) => l.status === 'APPROVED').length,
      sold: sold.length,
      omzet,
      dana: Math.round(omzet * 0.9),
      komisi: Math.round(omzet * 0.1),
    }
  }, [listings])

  async function aktifkanPenjual() {
    setActivating(true)
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'SELLER' }),
      })
      const data = (await res.json()) as { ok: boolean; user?: typeof user; error?: string }
      if (!res.ok || !data.ok || !data.user) {
        toast({ title: 'Gagal aktivasi', description: data.error ?? 'Coba lagi ya.', variant: 'destructive' })
        return
      }
      setUser(data.user)
      toast({ title: 'Mode Penjual aktif!', description: 'Tokomu siap — daftarkan akun pertamamu.' })
    } finally {
      setActivating(false)
    }
  }

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
        description: 'Menunggu kurasi admin (maks. 1x24 jam). Pantau status di daftar bawah.',
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

  async function tarikListing(listing: SellerListingDTO) {
    setBusyId(listing.id)
    try {
      const res = await fetch(`/api/listings?id=${listing.id}`, { method: 'DELETE' })
      const data = (await res.json()) as { ok: boolean; error?: string }
      if (!res.ok || !data.ok) {
        toast({ title: 'Gagal menarik listing', description: data.error ?? 'Coba lagi ya.', variant: 'destructive' })
        return
      }
      setListings((prev) => prev.filter((l) => l.id !== listing.id))
      toast({ title: `Listing ${listing.code} ditarik`, description: 'Akun tidak lagi diproses kurasi.' })
    } finally {
      setBusyId(null)
    }
  }

  if (!user) return null

  // ===== Gerbang: BUYER harus aktifkan mode penjual dulu =====
  if (user.role === 'BUYER') {
    return (
      <DashboardShell active="penjual">
        <div className="mx-auto max-w-lg rounded-3xl border border-border bg-card p-8 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/12">
            <Store className="h-8 w-8 text-primary" aria-hidden="true" />
          </span>
          <h1 className="mt-5 text-2xl font-extrabold text-foreground">Buka Toko di Raja Akun</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Aktifkan Mode Penjual untuk mendaftarkan akun media sosial yang ingin kamu jual.
            Gratis tanpa biaya pendaftaran — komisi transparan 90/10, pembayaran H+1 setelah
            pembeli menerima akun.
          </p>
          <ul className="mx-auto mt-5 max-w-sm space-y-2 text-left text-sm text-muted-foreground">
            {[
              'Daftarkan akun, admin kurasi maks. 1x24 jam',
              'Akun tayang di katalog penjual terverifikasi',
              'Dana escrow aman — lepas setelah pembeli OK',
            ].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
          <Button
            onClick={() => void aktifkanPenjual()}
            disabled={activating}
            className="mt-6 h-12 w-full rounded-full text-base font-bold"
          >
            {activating ? (
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            ) : (
              <Crown className="mr-2 h-5 w-5" aria-hidden="true" />
            )}
            Aktifkan Mode Penjual — Gratis
          </Button>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell active="penjual">
      <div className="space-y-6">
        {/* ===== Sapaan ===== */}
        <header className="rounded-3xl border border-border bg-card p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">
                Dashboard Penjual
              </p>
              <h1 className="mt-2 truncate text-2xl font-extrabold text-foreground sm:text-3xl">
                Toko {user.name ?? 'Penjual'} 🏪
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Kelola akun yang kamu jual — daftarkan baru, pantau kurasi, dan pantau penjualan.
              </p>
            </div>
            <Button
              onClick={() => setShowForm((s) => !s)}
              className="h-11 rounded-full px-5 font-bold"
              aria-expanded={showForm}
            >
              {showForm ? (
                <XCircle className="mr-2 h-4 w-4" aria-hidden="true" />
              ) : (
                <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
              )}
              {showForm ? 'Tutup Form' : 'Daftarkan Akun'}
            </Button>
          </div>
        </header>

        {/* ===== KPI ===== */}
        <section aria-label="Ringkasan toko" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: 'Total Listing', value: String(stats.total), Icon: PackageCheck },
            { label: 'Menunggu Kurasi', value: String(stats.pending), Icon: Clock3 },
            { label: 'Tayang', value: String(stats.approved), Icon: Eye },
            { label: 'Terjual', value: String(stats.sold), Icon: Crown },
          ].map((kpi) => (
            <div key={kpi.label} className="rounded-2xl border border-border bg-card p-4 sm:p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/12">
                <kpi.Icon className="h-4.5 w-4.5 text-primary" aria-hidden="true" />
              </span>
              <p className="mt-3 text-xl font-extrabold text-foreground sm:text-2xl">{kpi.value}</p>
              <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {kpi.label}
              </p>
            </div>
          ))}
        </section>

        {/* ===== Estimasi pendapatan ===== */}
        <section
          aria-label="Estimasi pendapatan"
          className="rounded-3xl border border-primary/25 bg-primary/5 p-6 sm:p-8"
        >
          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Banknote className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                Estimasi Dana Kamu (90%)
              </p>
              <p className="mt-2 text-2xl font-extrabold text-primary sm:text-3xl">
                {formatIDR(stats.dana)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Dari {stats.sold} akun terjual · dibayar H+1
              </p>
            </div>
            <div>
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Percent className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                Komisi Platform (10%)
              </p>
              <p className="mt-2 text-2xl font-extrabold text-foreground">
                {formatIDR(stats.komisi)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Omzet terjual {formatIDR(stats.omzet)}</p>
            </div>
            <div className="flex items-end">
              <p className="text-xs leading-relaxed text-muted-foreground">
                Dana escrow dipegang admin dan dilepas H+1 setelah pembeli mengonfirmasi akun
                diterima aman. Ada pertanyaan soal dana?{' '}
                <a
                  href={listingWaLink('', '', user.name ?? '')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary underline underline-offset-2"
                >
                  Chat admin 24/7
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* ===== Form daftar akun ===== */}
        {showForm && (
          <section aria-label="Form daftarkan akun" className="rounded-3xl border border-border bg-card p-5 sm:p-6">
            <h2 className="text-base font-extrabold text-foreground">Daftarkan Akun untuk Dijual</h2>
            <form
              className="mt-4 space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                void handleSubmit()
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="seller-platform">Platform</Label>
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger id="seller-platform" className="h-11">
                      <SelectValue placeholder="Pilih platform" />
                    </SelectTrigger>
                    <SelectContent className="max-h-72 bg-card">
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.slug}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seller-level">Level akun</Label>
                  <Select value={level} onValueChange={setLevel}>
                    <SelectTrigger id="seller-level" className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card">
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
                <Label htmlFor="seller-title">Judul akun</Label>
                <Input
                  id="seller-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="cth. Akun IG Aman 12K Follower Niche Kuliner"
                  maxLength={120}
                  className="h-11"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="seller-followers">Jumlah follower (opsional)</Label>
                  <Input
                    id="seller-followers"
                    value={followers}
                    onChange={(e) => setFollowers(e.target.value)}
                    placeholder="cth. 12.5K / 1.2 Jt"
                    maxLength={30}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seller-price">Harga jual (Rp)</Label>
                  <Input
                    id="seller-price"
                    inputMode="numeric"
                    value={price}
                    onChange={(e) => setPrice(e.target.value.replace(/[^\d]/g, ''))}
                    placeholder="cth. 450000"
                    className="h-11"
                  />
                  {price && (
                    <p className="text-xs font-semibold text-primary">
                      Kamu terima ~{formatIDR(Math.round(Number(price || 0) * 0.9))} · platform{' '}
                      {formatIDR(Math.round(Number(price || 0) * 0.1))}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seller-desc">Deskripsi & spesifikasi</Label>
                <Textarea
                  id="seller-desc"
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
            </form>
          </section>
        )}

        {/* ===== Daftar listing ===== */}
        <section aria-label="Akun saya" className="rounded-3xl border border-border bg-card p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-foreground">Akun Saya</h2>
            <Button variant="ghost" size="sm" className="h-9 gap-1.5 text-xs" onClick={() => void load()}>
              <RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} aria-hidden="true" />
              Muat ulang
            </Button>
          </div>

          <div className="mt-4 space-y-3">
            {loading && listings.length === 0 && (
              <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden="true" />
              </div>
            )}

            {!loading && listings.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border p-10 text-center">
                <Store className="mx-auto h-9 w-9 text-muted-foreground/50" aria-hidden="true" />
                <p className="mt-3 text-sm font-bold text-foreground">Belum ada akun terdaftar</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Klik &ldquo;Daftarkan Akun&rdquo; di atas untuk mulai berjualan.
                </p>
              </div>
            )}

            {listings.map((listing) => (
              <article
                key={listing.id}
                className="rounded-2xl border border-border bg-card/60 p-4 transition-colors hover:border-primary/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold text-foreground">{listing.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {listing.platformName} · {listing.level}
                      {listing.followers ? ` · ${listing.followers} follower` : ''} ·{' '}
                      <span className="font-mono font-bold text-primary/90">{listing.code}</span> ·{' '}
                      {formatTanggal(listing.createdAt)}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider',
                      STATUS_STYLE[listing.status],
                    )}
                  >
                    {LISTING_STATUS_LABEL[listing.status]}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-base font-extrabold text-primary">{formatIDR(listing.price)}</p>
                    {listing.status === 'SOLD' && (
                      <p className="text-xs font-semibold text-emerald-400">
                        Dana kamu {formatIDR(Math.round(listing.price * 0.9))} (H+1)
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {listing.status === 'REJECTED' && (
                      <Button asChild size="sm" variant="outline" className="h-9 rounded-full text-xs">
                        <a
                          href={listingWaLink(listing.code, listing.title, user.name ?? '')}
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
                        <BadgeCheck className="h-4 w-4" aria-hidden="true" />
                        Tayang di katalog penjual
                      </span>
                    )}
                    {(listing.status === 'PENDING' || listing.status === 'REJECTED') && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-9 rounded-full text-xs text-destructive hover:text-destructive"
                            disabled={busyId === listing.id}
                          >
                            <Trash2 className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                            Tarik
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-card">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Tarik listing {listing.code}?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Akun &ldquo;{listing.title}&rdquo; akan dihapus dari antrean kurasi.
                              Tindakan ini tidak bisa dibatalkan.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-full">Kembali</AlertDialogCancel>
                            <AlertDialogAction
                              className="rounded-full bg-destructive text-white hover:bg-destructive/90"
                              onClick={() => void tarikListing(listing)}
                            >
                              Ya, Tarik
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
                {listing.status === 'REJECTED' && listing.adminNote && (
                  <p className="mt-3 rounded-xl bg-red-500/10 p-3 text-xs leading-relaxed text-red-300">
                    Catatan admin: {listing.adminNote}
                  </p>
                )}
              </article>
            ))}
          </div>

          <p className="mt-5 text-center text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60">
            {initialsOf(user.name)} · Komisi transparan 90/10 · Escrow aman
          </p>
        </section>
      </div>
    </DashboardShell>
  )
}
