'use client'

/**
 * RAJA AKUN — Dashboard Pembeli (/dashboard)
 * ==========================================
 * Pusat akun pembeli: profil, ringkasan belanja, kelola pesanan
 * (bayar / tanya admin / batalkan), dan pintasan jadi penjual.
 */

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Crown,
  ExternalLink,
  Loader2,
  MessageCircle,
  PackageSearch,
  RefreshCw,
  ShoppingBag,
  Store,
  Wallet,
  X,
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
import { useToast } from '@/hooks/use-toast'
import {
  formatIDR,
  orderWaLink,
  ORDER_STATUS_LABEL,
  type OrderDTO,
  type OrderStatus,
} from '@/lib/marketplace'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth-store'
import { DashboardShell } from './dashboard-shell'
import { ROLE_BADGE_LABELS } from './role-badges'

const STATUS_STYLE: Record<OrderStatus, string> = {
  MENUNGGU_PEMBAYARAN: 'bg-amber-400 text-zinc-950',
  DIPROSES: 'bg-sky-500 text-zinc-950',
  SELESAI: 'bg-emerald-500 text-zinc-950',
  DIBATALKAN: 'bg-red-500 text-white',
}

const FILTERS: { value: OrderStatus | ''; label: string }[] = [
  { value: '', label: 'Semua' },
  { value: 'MENUNGGU_PEMBAYARAN', label: 'Menunggu Bayar' },
  { value: 'DIPROSES', label: 'Diproses' },
  { value: 'SELESAI', label: 'Selesai' },
  { value: 'DIBATALKAN', label: 'Dibatalkan' },
]

function formatTanggal(iso: string): string {
  // deterministik (tanpa Intl): 2025-01-31T... -> 31 Jan 2025
  const bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return `${String(d.getDate()).padStart(2, '0')} ${bulan[d.getMonth()]} ${d.getFullYear()}`
}

export function BuyerDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, setUser } = useAuthStore()

  const [orders, setOrders] = useState<OrderDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<OrderStatus | ''>('')
  const [busyId, setBusyId] = useState<string | null>(null)

  // profil
  const [name, setName] = useState(user?.name ?? '')
  const [savingName, setSavingName] = useState(false)
  const [activating, setActivating] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/orders', { cache: 'no-store' })
      const data = (await res.json()) as { ok: boolean; orders?: OrderDTO[] }
      if (data.ok && data.orders) setOrders(data.orders)
    } catch {
      // senyap — kartu tetap menampilkan state kosong
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const stats = useMemo(() => {
    const aktif = orders.filter(
      (o) => o.status === 'MENUNGGU_PEMBAYARAN' || o.status === 'DIPROSES',
    ).length
    const selesai = orders.filter((o) => o.status === 'SELESAI')
    const belanja = selesai.reduce((sum, o) => sum + o.amount, 0)
    return { total: orders.length, aktif, selesai: selesai.length, belanja }
  }, [orders])

  const filtered = useMemo(
    () => (filter ? orders.filter((o) => o.status === filter) : orders),
    [orders, filter],
  )

  async function batalkanPesanan(order: OrderDTO) {
    setBusyId(order.id)
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: order.id, action: 'cancel' }),
      })
      const data = (await res.json()) as { ok: boolean; error?: string }
      if (!res.ok || !data.ok) {
        toast({ title: 'Gagal membatalkan', description: data.error ?? 'Coba lagi ya.', variant: 'destructive' })
        return
      }
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status: 'DIBATALKAN' } : o)),
      )
      toast({
        title: `Pesanan ${order.code} dibatalkan`,
        description: 'Tidak ada tagihan. Silakan pesan lagi kapan pun kamu siap.',
      })
    } finally {
      setBusyId(null)
    }
  }

  async function simpanNama() {
    const nama = name.trim()
    if (nama.length < 2) {
      toast({ title: 'Nama terlalu pendek', description: 'Minimal 2 huruf ya.', variant: 'destructive' })
      return
    }
    setSavingName(true)
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nama }),
      })
      const data = (await res.json()) as { ok: boolean; user?: typeof user; error?: string }
      if (!res.ok || !data.ok || !data.user) {
        toast({ title: 'Gagal menyimpan', description: data.error ?? 'Coba lagi ya.', variant: 'destructive' })
        return
      }
      setUser(data.user)
      toast({ title: 'Profil tersimpan', description: `Salam, ${nama}!` })
    } finally {
      setSavingName(false)
    }
  }

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
      toast({
        title: 'Mode Penjual aktif!',
        description: 'Selamat datang di sisi penjual — daftarkan akun pertamamu.',
      })
      router.push('/dashboard/penjual')
    } finally {
      setActivating(false)
    }
  }

  if (!user) return null
  const badge = ROLE_BADGE_LABELS[user.role]

  return (
    <DashboardShell active="pembeli">
      <div className="space-y-6">
        {/* ===== Sapaan ===== */}
        <header className="rounded-3xl border border-border bg-card p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">
                Dashboard Pembeli
              </p>
              <h1 className="mt-2 truncate text-2xl font-extrabold text-foreground sm:text-3xl">
                Selamat datang, {user.name ?? 'Raja'} 👑
              </h1>
              <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  Member sejak {formatTanggal(user.createdAt)}
                </span>
                <span
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                    badge.className,
                  )}
                >
                  <badge.Icon className="h-3 w-3" aria-hidden="true" />
                  {badge.label}
                </span>
              </p>
            </div>
            <Button asChild className="h-11 rounded-full px-5 font-bold">
              <Link href="/katalog">
                <ShoppingBag className="mr-2 h-4 w-4" aria-hidden="true" />
                Belanja Akun
              </Link>
            </Button>
          </div>
        </header>

        {/* ===== KPI ===== */}
        <section aria-label="Ringkasan belanja" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: 'Total Pesanan', value: String(stats.total), Icon: ShoppingBag },
            { label: 'Sedang Aktif', value: String(stats.aktif), Icon: Loader2 },
            { label: 'Selesai', value: String(stats.selesai), Icon: CheckCircle2 },
            { label: 'Total Belanja', value: formatIDR(stats.belanja), Icon: Wallet },
          ].map((kpi) => (
            <div key={kpi.label} className="rounded-2xl border border-border bg-card p-4 sm:p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/12">
                <kpi.Icon className="h-4.5 w-4.5 text-primary" aria-hidden="true" />
              </span>
              <p className="mt-3 truncate text-xl font-extrabold text-foreground sm:text-2xl">
                {kpi.value}
              </p>
              <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {kpi.label}
              </p>
            </div>
          ))}
        </section>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* ===== Daftar pesanan ===== */}
          <section aria-label="Riwayat pesanan" className="rounded-3xl border border-border bg-card p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-base font-extrabold text-foreground">Pesanan Saya</h2>
              <Button variant="ghost" size="sm" className="h-9 gap-1.5 text-xs" onClick={() => void load()}>
                <RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} aria-hidden="true" />
                Muat ulang
              </Button>
            </div>

            {/* Filter status */}
            <div className="scrollbar-none -mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1" role="tablist" aria-label="Filter status pesanan">
              {FILTERS.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  role="tab"
                  aria-selected={filter === f.value}
                  onClick={() => setFilter(f.value)}
                  className={cn(
                    'min-h-[36px] shrink-0 rounded-full border px-3.5 text-xs font-bold transition-colors',
                    filter === f.value
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border text-muted-foreground hover:text-foreground',
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="mt-4 space-y-3">
              {loading && orders.length === 0 && (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden="true" />
                </div>
              )}

              {!loading && filtered.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border p-10 text-center">
                  <PackageSearch className="mx-auto h-9 w-9 text-muted-foreground/50" aria-hidden="true" />
                  <p className="mt-3 text-sm font-bold text-foreground">
                    {orders.length === 0 ? 'Belum ada pesanan' : 'Tidak ada pesanan pada filter ini'}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {orders.length === 0
                      ? 'Jelajahi katalog & klik Beli — pesanan tercatat otomatis di sini.'
                      : 'Coba pilih filter status lain.'}
                  </p>
                  {orders.length === 0 && (
                    <Button asChild className="mt-4 h-10 rounded-full px-5 text-xs font-bold">
                      <Link href="/katalog">Jelajahi Katalog</Link>
                    </Button>
                  )}
                </div>
              )}

              {filtered.map((order) => (
                <article
                  key={order.id}
                  className="rounded-2xl border border-border bg-card/60 p-4 transition-colors hover:border-primary/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-mono text-xs font-bold text-primary">{order.code}</p>
                      <p className="mt-1 truncate text-sm font-extrabold text-foreground">
                        {order.productName}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {formatTanggal(order.createdAt)}
                        {order.quantity > 1 ? ` · ${order.quantity} item` : ''}
                      </p>
                    </div>
                    <span
                      className={cn(
                        'shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider',
                        STATUS_STYLE[order.status],
                      )}
                    >
                      {ORDER_STATUS_LABEL[order.status]}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-base font-extrabold text-primary">{formatIDR(order.amount)}</p>
                    <div className="flex gap-2">
                      {order.status === 'MENUNGGU_PEMBAYARAN' && (
                        <>
                          <Button asChild size="sm" className="h-9 rounded-full text-xs font-bold">
                            <a
                              href={orderWaLink(order.code, order.productName, user.name ?? '')}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <MessageCircle className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                              Bayar via WA
                            </a>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-9 rounded-full text-xs"
                                disabled={busyId === order.id}
                              >
                                <X className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                                Batalkan
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-card">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Batalkan pesanan {order.code}?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Pesanan {order.productName} ({formatIDR(order.amount)}) akan
                                  dibatalkan dan tidak bisa dikembalikan. Kamu bisa pesan lagi
                                  kapan pun.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="rounded-full">Kembali</AlertDialogCancel>
                                <AlertDialogAction
                                  className="rounded-full bg-destructive text-white hover:bg-destructive/90"
                                  onClick={() => void batalkanPesanan(order)}
                                >
                                  Ya, Batalkan
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}
                      {order.status !== 'MENUNGGU_PEMBAYARAN' && (
                        <Button asChild size="sm" variant="outline" className="h-9 rounded-full text-xs">
                          <a
                            href={orderWaLink(order.code, order.productName, user.name ?? '')}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                            Tanya Admin
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <p className="mt-5 text-center text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60">
              Semua transaksi bergaransi & tercatat
            </p>
          </section>

          {/* ===== Kolom kanan: profil & aksi ===== */}
          <div className="space-y-6">
            <section aria-label="Profil saya" className="rounded-3xl border border-border bg-card p-5 sm:p-6">
              <h2 className="flex items-center gap-2 text-base font-extrabold text-foreground">
                <BadgeCheck className="h-4.5 w-4.5 text-primary" aria-hidden="true" />
                Profil Saya
              </h2>
              <div className="mt-4 space-y-3">
                <div>
                  <label htmlFor="buyer-name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Nama tampilan
                  </label>
                  <div className="mt-1.5 flex gap-2">
                    <Input
                      id="buyer-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="cth. Gugun"
                      maxLength={60}
                      className="h-11"
                    />
                    <Button
                      size="sm"
                      onClick={() => void simpanNama()}
                      disabled={savingName}
                      className="h-11 shrink-0 rounded-xl px-4 font-bold"
                    >
                      {savingName ? (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      ) : (
                        'Simpan'
                      )}
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    WhatsApp (ID login)
                  </p>
                  <p className="mt-1 font-mono text-sm font-bold text-foreground">+{user.phone}</p>
                </div>
              </div>
            </section>

            {/* Kartu jadi penjual */}
            <section aria-label="Program penjual" className="rounded-3xl border border-primary/25 bg-primary/5 p-5 sm:p-6">
              <h2 className="flex items-center gap-2 text-base font-extrabold text-foreground">
                <Crown className="h-4.5 w-4.5 text-primary" aria-hidden="true" />
                Punya Akun untuk Dijual?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Buka toko gratis di Raja Akun. Komisi transparan 90/10 — kamu menerima 90% dari
                setiap akun yang terjual, dibayar H+1.
              </p>
              {user.role === 'BUYER' ? (
                <Button
                  onClick={() => void aktifkanPenjual()}
                  disabled={activating}
                  className="mt-4 h-11 w-full rounded-full font-bold"
                >
                  {activating ? (
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                  ) : (
                    <Store className="mr-2 h-4 w-4" aria-hidden="true" />
                  )}
                  Aktifkan Mode Penjual
                </Button>
              ) : (
                <Button asChild className="mt-4 h-11 w-full rounded-full font-bold">
                  <Link href="/dashboard/penjual">
                    <Store className="mr-2 h-4 w-4" aria-hidden="true" />
                    Buka Dashboard Penjual
                  </Link>
                </Button>
              )}
            </section>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
