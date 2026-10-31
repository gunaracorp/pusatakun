'use client'

/**
 * RAJA AKUN — Dashboard Pemilik (/dashboard/admin)
 * ================================================
 * Pusat komando khusus pemilik situs (akun rajaakun2026):
 *  1) Ringkasan   — KPI pengguna, pesanan, GMV & komisi, listing
 *  2) Pesanan     — kelola semua pesanan (ubah status)
 *  3) Kurasi      — setujui / tolak / tandai terjual listing penjual
 *  4) Pengguna    — daftar pengguna + kelola peran (BUYER/SELLER)
 * Akses: hanya role ADMIN (nomor WhatsApp pemilik).
 */

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  BadgeCheck,
  Banknote,
  Check,
  ClipboardList,
  Clock3,
  Crown,
  Eye,
  Loader2,
  MessageCircle,
  PackageCheck,
  Percent,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Store,
  Tag,
  Trash2,
  Users,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import {
  formatIDR,
  initialsOf,
  listingWaLink,
  LISTING_STATUS_LABEL,
  orderWaLink,
  ORDER_STATUS_LABEL,
  ADMIN_ORDER_STATUSES,
  type AdminOrderDTO,
  type AdminOverviewDTO,
  type AdminUserDTO,
  type ListingStatus,
  type OrderStatus,
  type SellerListingDTO,
} from '@/lib/marketplace'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth-store'
import { DashboardShell } from './dashboard-shell'
import { AccessLimitedPanel } from './dashboard-guard'

const ORDER_STATUS_STYLE: Record<OrderStatus, string> = {
  MENUNGGU_PEMBAYARAN: 'bg-amber-400 text-zinc-950',
  DIPROSES: 'bg-sky-500 text-zinc-950',
  SELESAI: 'bg-emerald-500 text-zinc-950',
  DIBATALKAN: 'bg-red-500 text-white',
}

const LISTING_STATUS_STYLE: Record<ListingStatus, string> = {
  PENDING: 'bg-amber-400 text-zinc-950',
  APPROVED: 'bg-emerald-500 text-zinc-950',
  REJECTED: 'bg-red-500 text-white',
  SOLD: 'bg-zinc-400 text-zinc-950',
}

const LISTING_FILTERS: { value: ListingStatus | ''; label: string }[] = [
  { value: 'PENDING', label: 'Perlu Kurasi' },
  { value: 'APPROVED', label: 'Tayang' },
  { value: 'REJECTED', label: 'Ditolak' },
  { value: 'SOLD', label: 'Terjual' },
  { value: '', label: 'Semua' },
]

const ORDER_FILTERS: { value: OrderStatus | ''; label: string }[] = [
  { value: '', label: 'Semua' },
  { value: 'MENUNGGU_PEMBAYARAN', label: 'Belum Bayar' },
  { value: 'DIPROSES', label: 'Diproses' },
  { value: 'SELESAI', label: 'Selesai' },
  { value: 'DIBATALKAN', label: 'Dibatalkan' },
]

function formatTanggal(iso: string): string {
  const bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return `${String(d.getDate()).padStart(2, '0')} ${bulan[d.getMonth()]} ${d.getFullYear()}`
}

export function OwnerDashboard() {
  const { toast } = useToast()
  const { user } = useAuthStore()

  const [overview, setOverview] = useState<AdminOverviewDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('ringkasan')

  // Pesanan
  const [orders, setOrders] = useState<AdminOrderDTO[]>([])
  const [orderFilter, setOrderFilter] = useState<OrderStatus | ''>('')
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [busyOrderId, setBusyOrderId] = useState<string | null>(null)

  // Kurasi
  const [listings, setListings] = useState<SellerListingDTO[]>([])
  const [listingFilter, setListingFilter] = useState<ListingStatus | ''>('PENDING')
  const [listingsLoading, setListingsLoading] = useState(false)
  const [busyListingId, setBusyListingId] = useState<string | null>(null)
  const [rejectTarget, setRejectTarget] = useState<SellerListingDTO | null>(null)
  const [rejectNote, setRejectNote] = useState('')

  // Pengguna
  const [users, setUsers] = useState<AdminUserDTO[]>([])
  const [userQuery, setUserQuery] = useState('')
  const [usersLoading, setUsersLoading] = useState(false)
  const [busyUserId, setBusyUserId] = useState<string | null>(null)

  const isAdmin = user?.role === 'ADMIN'

  const loadOverview = useCallback(async () => {
    if (!isAdmin) return
    setLoading(true)
    try {
      const res = await fetch('/api/admin/overview', { cache: 'no-store' })
      const data = (await res.json()) as { ok: boolean; overview?: AdminOverviewDTO }
      if (data.ok && data.overview) setOverview(data.overview)
    } catch {
      // senyap
    } finally {
      setLoading(false)
    }
  }, [isAdmin])

  const loadOrders = useCallback(
    async (status: OrderStatus | '') => {
      if (!isAdmin) return
      setOrdersLoading(true)
      try {
        const qs = status ? `&status=${status}` : ''
        const res = await fetch(`/api/admin/orders?admin=1${qs}`, { cache: 'no-store' })
        const data = (await res.json()) as { ok: boolean; orders?: AdminOrderDTO[] }
        if (data.ok && data.orders) setOrders(data.orders)
      } catch {
        // senyap
      } finally {
        setOrdersLoading(false)
      }
    },
    [isAdmin],
  )

  const loadListings = useCallback(
    async (status: ListingStatus | '') => {
      if (!isAdmin) return
      setListingsLoading(true)
      try {
        const qs = status ? `&status=${status}` : ''
        const res = await fetch(`/api/listings?admin=1${qs}`, { cache: 'no-store' })
        const data = (await res.json()) as { ok: boolean; listings?: SellerListingDTO[] }
        if (data.ok && data.listings) setListings(data.listings)
      } catch {
        // senyap
      } finally {
        setListingsLoading(false)
      }
    },
    [isAdmin],
  )

  const loadUsers = useCallback(
    async (q: string) => {
      if (!isAdmin) return
      setUsersLoading(true)
      try {
        const qs = q ? `&q=${encodeURIComponent(q)}` : ''
        const res = await fetch(`/api/admin/users?admin=1${qs}`, { cache: 'no-store' })
        const data = (await res.json()) as { ok: boolean; users?: AdminUserDTO[] }
        if (data.ok && data.users) setUsers(data.users)
      } catch {
        // senyap
      } finally {
        setUsersLoading(false)
      }
    },
    [isAdmin],
  )

  useEffect(() => {
    void loadOverview()
  }, [loadOverview])

  // Muat data tab saat tab dibuka
  useEffect(() => {
    if (tab === 'pesanan') void loadOrders(orderFilter)
    if (tab === 'kurasi') void loadListings(listingFilter)
    if (tab === 'pengguna') void loadUsers(userQuery)
  }, [tab])

  if (!isAdmin) {
    return (
      <DashboardShell active="admin">
        <AccessLimitedPanel
          title="Akses Khusus Pemilik"
          description="Pusat komando ini hanya untuk akun pemilik Raja Akun (rajaakun2026). Masuklah dengan nomor WhatsApp pemilik situs."
        />
      </DashboardShell>
    )
  }

  // ===== Aksi pesanan =====
  async function ubahStatusPesanan(order: AdminOrderDTO, status: OrderStatus) {
    setBusyOrderId(order.id)
    const prev = orders
    setOrders((arr) => arr.map((o) => (o.id === order.id ? { ...o, status } : o)))
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: order.id, status }),
      })
      const data = (await res.json()) as { ok: boolean; error?: string }
      if (!res.ok || !data.ok) throw new Error(data.error)
      toast({ title: `Pesanan ${order.code}`, description: `Status → ${ORDER_STATUS_LABEL[status]}` })
      void loadOverview()
    } catch {
      setOrders(prev)
      toast({ title: 'Gagal mengubah status', description: 'Coba lagi ya.', variant: 'destructive' })
    } finally {
      setBusyOrderId(null)
    }
  }

  // ===== Aksi kurasi =====
  async function moderate(id: string, action: 'approve' | 'reject' | 'mark-sold' | 'delete', note?: string) {
    setBusyListingId(id)
    try {
      const res = await fetch('/api/admin/listings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action, note }),
      })
      const data = (await res.json()) as { ok: boolean; error?: string }
      if (!res.ok || !data.ok) throw new Error(data.error)
      toast({ title: 'Kurasi diproses', description: 'Daftar listing diperbarui.' })
      void loadListings(listingFilter)
      void loadOverview()
    } catch {
      toast({ title: 'Gagal memproses kurasi', description: 'Coba lagi ya.', variant: 'destructive' })
    } finally {
      setBusyListingId(null)
    }
  }

  // ===== Aksi pengguna =====
  async function ubahPeran(u: AdminUserDTO, role: 'BUYER' | 'SELLER') {
    setBusyUserId(u.id)
    const prev = users
    setUsers((arr) => arr.map((x) => (x.id === u.id ? { ...x, role } : x)))
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: u.id, role }),
      })
      const data = (await res.json()) as { ok: boolean; error?: string }
      if (!res.ok || !data.ok) throw new Error(data.error)
      toast({ title: `Peran ${u.name ?? u.phone} diubah`, description: `Sekarang: ${role === 'SELLER' ? 'Penjual' : 'Pembeli'}` })
      void loadOverview()
    } catch (e) {
      setUsers(prev)
      toast({
        title: 'Gagal mengubah peran',
        description: e instanceof Error ? e.message : 'Coba lagi ya.',
        variant: 'destructive',
      })
    } finally {
      setBusyUserId(null)
    }
  }

  const kpiCards = overview
    ? [
        {
          label: 'Total Pengguna',
          value: String(overview.users.total),
          sub: `${overview.users.buyer} pembeli · ${overview.users.seller} penjual`,
          Icon: Users,
        },
        {
          label: 'Total Pesanan',
          value: String(overview.orders.total),
          sub: `${overview.orders.menunggu} belum bayar · ${overview.orders.diproses} diproses`,
          Icon: ClipboardList,
        },
        {
          label: 'GMV Selesai',
          value: formatIDR(overview.orders.gmv),
          sub: `${overview.orders.selesai} transaksi sukses`,
          Icon: Banknote,
        },
        {
          label: 'Estimasi Komisi (10%)',
          value: formatIDR(overview.orders.komisi),
          sub: `Bagian platform dari GMV`,
          Icon: Percent,
        },
        {
          label: 'Listing Kurasi',
          value: String(overview.listings.pending),
          sub: `${overview.listings.approved} tayang · ${overview.listings.sold} terjual`,
          Icon: Tag,
        },
        {
          label: 'Akun Terjual (semua)',
          value: String(overview.products.totalSold),
          sub: 'Total unit terjual dari katalog',
          Icon: PackageCheck,
        },
      ]
    : []

  return (
    <DashboardShell active="admin">
      <div className="space-y-6">
        {/* ===== Sapaan ===== */}
        <header className="rounded-3xl border border-amber-400/30 bg-gradient-to-br from-primary/12 via-card to-card p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-amber-400" aria-hidden="true" />
                Pusat Komando Pemilik
              </p>
              <h1 className="mt-2 truncate text-2xl font-extrabold text-foreground sm:text-3xl">
                Rajaakun2026 Command Center 👑
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Seluruh pasar dalam satu halaman: pengguna, pesanan, kurasi & pendapatan platform.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                void loadOverview()
                void loadOrders(orderFilter)
                void loadListings(listingFilter)
                void loadUsers(userQuery)
              }}
              className="h-11 rounded-full px-5 font-bold"
            >
              <RefreshCw className={cn('mr-2 h-4 w-4', loading && 'animate-spin')} aria-hidden="true" />
              Segarkan Semua
            </Button>
          </div>
        </header>

        {/* ===== KPI ===== */}
        {loading && !overview ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" aria-hidden="true" />
          </div>
        ) : (
          <section aria-label="KPI situs" className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
            {kpiCards.map((kpi) => (
              <div key={kpi.label} className="rounded-2xl border border-border bg-card p-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/12">
                  <kpi.Icon className="h-4.5 w-4.5 text-primary" aria-hidden="true" />
                </span>
                <p className="mt-3 text-lg font-extrabold leading-tight text-foreground xl:text-xl">
                  {kpi.value}
                </p>
                <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary/90">
                  {kpi.label}
                </p>
                <p className="mt-1 truncate text-[11px] text-muted-foreground" title={kpi.sub}>
                  {kpi.sub}
                </p>
              </div>
            ))}
          </section>
        )}

        {/* ===== Tabs ===== */}
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="h-12 w-full justify-start gap-1 overflow-x-auto rounded-full border border-border bg-card p-1.5">
            <TabsTrigger value="ringkasan" className="rounded-full text-xs font-bold sm:text-sm">
              <Eye className="mr-1.5 h-4 w-4" aria-hidden="true" />
              Ringkasan
            </TabsTrigger>
            <TabsTrigger value="pesanan" className="rounded-full text-xs font-bold sm:text-sm">
              <ClipboardList className="mr-1.5 h-4 w-4" aria-hidden="true" />
              Pesanan
              {overview && overview.orders.menunggu + overview.orders.diproses > 0 && (
                <span className="ml-1.5 rounded-full bg-amber-400 px-1.5 py-0.5 text-[10px] font-extrabold text-zinc-950">
                  {overview.orders.menunggu + overview.orders.diproses}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="kurasi" className="rounded-full text-xs font-bold sm:text-sm">
              <Tag className="mr-1.5 h-4 w-4" aria-hidden="true" />
              Kurasi
              {overview && overview.listings.pending > 0 && (
                <span className="ml-1.5 rounded-full bg-amber-400 px-1.5 py-0.5 text-[10px] font-extrabold text-zinc-950">
                  {overview.listings.pending}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="pengguna" className="rounded-full text-xs font-bold sm:text-sm">
              <Users className="mr-1.5 h-4 w-4" aria-hidden="true" />
              Pengguna
            </TabsTrigger>
          </TabsList>

          {/* ============ TAB: RINGKASAN ============ */}
          <TabsContent value="ringkasan" className="mt-5">
            {overview && (
              <div className="grid gap-4 lg:grid-cols-3">
                {/* Pesanan terbaru */}
                <section className="rounded-3xl border border-border bg-card p-5" aria-label="Pesanan terbaru">
                  <h2 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-foreground">
                    <ClipboardList className="h-4 w-4 text-primary" aria-hidden="true" />
                    Pesanan Terbaru
                  </h2>
                  <div className="mt-4 space-y-3">
                    {overview.recentOrders.length === 0 && (
                      <p className="py-6 text-center text-xs text-muted-foreground">Belum ada pesanan.</p>
                    )}
                    {overview.recentOrders.map((o) => (
                      <div key={o.id} className="rounded-2xl border border-border bg-card/60 p-3">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-mono text-xs font-bold text-primary">{o.code}</p>
                          <span
                            className={cn(
                              'rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider',
                              ORDER_STATUS_STYLE[o.status],
                            )}
                          >
                            {ORDER_STATUS_LABEL[o.status]}
                          </span>
                        </div>
                        <p className="mt-1 truncate text-xs font-bold text-foreground">{o.productName}</p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          {o.buyerName ?? o.buyerInitials} · +{o.buyerPhone} · {formatIDR(o.amount)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="mt-4 h-9 w-full rounded-full text-xs" onClick={() => setTab('pesanan')}>
                    Kelola Semua Pesanan
                  </Button>
                </section>

                {/* Kurasi terbaru */}
                <section className="rounded-3xl border border-border bg-card p-5" aria-label="Listing terbaru">
                  <h2 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-foreground">
                    <Tag className="h-4 w-4 text-primary" aria-hidden="true" />
                    Listing Terbaru
                  </h2>
                  <div className="mt-4 space-y-3">
                    {overview.recentListings.length === 0 && (
                      <p className="py-6 text-center text-xs text-muted-foreground">Belum ada listing.</p>
                    )}
                    {overview.recentListings.map((l) => (
                      <div key={l.id} className="rounded-2xl border border-border bg-card/60 p-3">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-xs font-bold text-foreground">{l.title}</p>
                          <span
                            className={cn(
                              'shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider',
                              LISTING_STATUS_STYLE[l.status],
                            )}
                          >
                            {LISTING_STATUS_LABEL[l.status]}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          {l.sellerName ?? l.sellerInitials} · {formatIDR(l.price)} ·{' '}
                          <span className="font-mono text-primary/90">{l.code}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="mt-4 h-9 w-full rounded-full text-xs" onClick={() => setTab('kurasi')}>
                    Buka Antrean Kurasi
                  </Button>
                </section>

                {/* Pengguna baru */}
                <section className="rounded-3xl border border-border bg-card p-5" aria-label="Pengguna terbaru">
                  <h2 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-foreground">
                    <Users className="h-4 w-4 text-primary" aria-hidden="true" />
                    Pengguna Terbaru
                  </h2>
                  <div className="mt-4 space-y-3">
                    {overview.recentUsers.length === 0 && (
                      <p className="py-6 text-center text-xs text-muted-foreground">Belum ada pengguna.</p>
                    )}
                    {overview.recentUsers.map((u) => (
                      <div key={u.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card/60 p-3">
                        <span
                          aria-hidden="true"
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 text-[10px] font-extrabold text-zinc-950"
                        >
                          {initialsOf(u.name)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-bold text-foreground">
                            {u.name ?? 'Tanpa nama'}
                          </p>
                          <p className="truncate text-[11px] text-muted-foreground">
                            +{u.phone} · {u.orderCount} pesanan · {u.listingCount} listing
                          </p>
                        </div>
                        <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          {u.role}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="mt-4 h-9 w-full rounded-full text-xs" onClick={() => setTab('pengguna')}>
                    Kelola Pengguna
                  </Button>
                </section>
              </div>
            )}
          </TabsContent>

          {/* ============ TAB: PESANAN ============ */}
          <TabsContent value="pesanan" className="mt-5">
            <section className="rounded-3xl border border-border bg-card p-5 sm:p-6" aria-label="Kelola pesanan">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-base font-extrabold text-foreground">Semua Pesanan Pembeli</h2>
                <Button variant="ghost" size="sm" className="h-9 gap-1.5 text-xs" onClick={() => void loadOrders(orderFilter)}>
                  <RefreshCw className={cn('h-3.5 w-3.5', ordersLoading && 'animate-spin')} aria-hidden="true" />
                  Muat ulang
                </Button>
              </div>

              <div className="scrollbar-none -mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1" role="tablist" aria-label="Filter status pesanan">
                {ORDER_FILTERS.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    role="tab"
                    aria-selected={orderFilter === f.value}
                    onClick={() => {
                      setOrderFilter(f.value)
                      void loadOrders(f.value)
                    }}
                    className={cn(
                      'min-h-[36px] shrink-0 rounded-full border px-3.5 text-xs font-bold transition-colors',
                      orderFilter === f.value
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {ordersLoading && orders.length === 0 ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden="true" />
                </div>
              ) : orders.length === 0 ? (
                <div className="mt-4 rounded-2xl border border-dashed border-border p-10 text-center">
                  <ClipboardList className="mx-auto h-9 w-9 text-muted-foreground/50" aria-hidden="true" />
                  <p className="mt-3 text-sm font-bold text-foreground">Tidak ada pesanan pada filter ini</p>
                </div>
              ) : (
                <div className="mt-4 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Kode</TableHead>
                        <TableHead>Pembeli</TableHead>
                        <TableHead>Produk</TableHead>
                        <TableHead className="text-right">Nilai</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((o) => (
                        <TableRow key={o.id}>
                          <TableCell className="whitespace-nowrap font-mono text-xs font-bold text-primary">
                            {o.code}
                          </TableCell>
                          <TableCell>
                            <p className="text-xs font-bold text-foreground">{o.buyerName ?? 'Tanpa nama'}</p>
                            <p className="font-mono text-[11px] text-muted-foreground">+{o.buyerPhone}</p>
                          </TableCell>
                          <TableCell className="max-w-[220px] truncate text-xs">{o.productName}</TableCell>
                          <TableCell className="whitespace-nowrap text-right text-xs font-extrabold text-primary">
                            {formatIDR(o.amount)}
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-[11px] text-muted-foreground">
                            {formatTanggal(o.createdAt)}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={o.status}
                              onValueChange={(v) => void ubahStatusPesanan(o, v as OrderStatus)}
                              disabled={busyOrderId === o.id}
                            >
                              <SelectTrigger
                                className={cn(
                                  'h-8 w-[170px] rounded-full border-0 text-[10px] font-bold uppercase tracking-wider',
                                  ORDER_STATUS_STYLE[o.status],
                                )}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-card">
                                {ADMIN_ORDER_STATUSES.map((s) => (
                                  <SelectItem key={s} value={s} className="text-xs">
                                    {ORDER_STATUS_LABEL[s]}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button asChild size="sm" variant="ghost" className="h-8 rounded-full text-[11px]">
                              <a
                                href={orderWaLink(o.code, o.productName, o.buyerName ?? '')}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <MessageCircle className="mr-1 h-3 w-3" aria-hidden="true" />
                                Chat
                              </a>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </section>
          </TabsContent>

          {/* ============ TAB: KURASI ============ */}
          <TabsContent value="kurasi" className="mt-5">
            <section className="rounded-3xl border border-border bg-card p-5 sm:p-6" aria-label="Kurasi listing">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-base font-extrabold text-foreground">Kurasi Listing Penjual</h2>
                <Button variant="ghost" size="sm" className="h-9 gap-1.5 text-xs" onClick={() => void loadListings(listingFilter)}>
                  <RefreshCw className={cn('h-3.5 w-3.5', listingsLoading && 'animate-spin')} aria-hidden="true" />
                  Muat ulang
                </Button>
              </div>

              <div className="scrollbar-none -mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1" role="tablist" aria-label="Filter status listing">
                {LISTING_FILTERS.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    role="tab"
                    aria-selected={listingFilter === f.value}
                    onClick={() => {
                      setListingFilter(f.value)
                      void loadListings(f.value)
                    }}
                    className={cn(
                      'min-h-[36px] shrink-0 rounded-full border px-3.5 text-xs font-bold transition-colors',
                      listingFilter === f.value
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="mt-4 space-y-3">
                {listingsLoading && listings.length === 0 && (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden="true" />
                  </div>
                )}

                {!listingsLoading && listings.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-border p-10 text-center">
                    <Crown className="mx-auto h-9 w-9 text-muted-foreground/50" aria-hidden="true" />
                    <p className="mt-3 text-sm font-bold text-foreground">Antrean kosong</p>
                    <p className="mt-1 text-xs text-muted-foreground">Tidak ada listing pada filter ini.</p>
                  </div>
                )}

                {listings.map((l) => (
                  <article key={l.id} className="rounded-2xl border border-border bg-card/60 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-extrabold text-foreground">{l.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {l.platformName} · {l.level}
                          {l.followers ? ` · ${l.followers} follower` : ''} ·{' '}
                          <span className="font-mono font-bold text-primary/90">{l.code}</span> ·{' '}
                          {l.sellerName ?? l.sellerInitials} · {formatTanggal(l.createdAt)}
                        </p>
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{l.description}</p>
                      </div>
                      <span
                        className={cn(
                          'shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider',
                          LISTING_STATUS_STYLE[l.status],
                        )}
                      >
                        {LISTING_STATUS_LABEL[l.status]}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <Tag className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                      <p className="text-sm font-extrabold text-primary">{formatIDR(l.price)}</p>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {l.status === 'PENDING' && (
                        <>
                          <Button
                            size="sm"
                            className="h-9 rounded-full text-xs font-bold"
                            disabled={busyListingId === l.id}
                            onClick={() => void moderate(l.id, 'approve')}
                          >
                            <Check className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                            Setujui
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-9 rounded-full text-xs"
                            disabled={busyListingId === l.id}
                            onClick={() => {
                              setRejectTarget(l)
                              setRejectNote('')
                            }}
                          >
                            <X className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                            Tolak
                          </Button>
                        </>
                      )}
                      {l.status === 'APPROVED' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-9 rounded-full text-xs"
                          disabled={busyListingId === l.id}
                          onClick={() => void moderate(l.id, 'mark-sold')}
                        >
                          <Crown className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                          Tandai Terjual
                        </Button>
                      )}
                      {l.status !== 'PENDING' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-9 rounded-full text-xs text-destructive"
                          disabled={busyListingId === l.id}
                          onClick={() => void moderate(l.id, 'delete')}
                        >
                          <Trash2 className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                          Hapus
                        </Button>
                      )}
                      <Button asChild size="sm" variant="ghost" className="h-9 rounded-full text-xs">
                        <a
                          href={listingWaLink(l.code, l.title, l.sellerName ?? '')}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MessageCircle className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                          Chat Penjual
                        </a>
                      </Button>
                    </div>
                    {l.status === 'REJECTED' && l.adminNote && (
                      <p className="mt-3 rounded-xl bg-red-500/10 p-3 text-xs text-red-300">
                        Catatan: {l.adminNote}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </section>
          </TabsContent>

          {/* ============ TAB: PENGGUNA ============ */}
          <TabsContent value="pengguna" className="mt-5">
            <section className="rounded-3xl border border-border bg-card p-5 sm:p-6" aria-label="Kelola pengguna">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-base font-extrabold text-foreground">Kelola Pengguna</h2>
                <form
                  className="flex gap-2"
                  onSubmit={(e) => {
                    e.preventDefault()
                    void loadUsers(userQuery)
                  }}
                >
                  <div className="relative">
                    <Search
                      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Input
                      value={userQuery}
                      onChange={(e) => setUserQuery(e.target.value)}
                      placeholder="Cari nomor WA…"
                      inputMode="numeric"
                      className="h-10 w-44 pl-9 sm:w-56"
                      aria-label="Cari pengguna berdasarkan nomor WhatsApp"
                    />
                  </div>
                  <Button type="submit" size="sm" className="h-10 rounded-xl px-4 text-xs font-bold">
                    Cari
                  </Button>
                </form>
              </div>

              {usersLoading && users.length === 0 ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden="true" />
                </div>
              ) : users.length === 0 ? (
                <div className="mt-4 rounded-2xl border border-dashed border-border p-10 text-center">
                  <Users className="mx-auto h-9 w-9 text-muted-foreground/50" aria-hidden="true" />
                  <p className="mt-3 text-sm font-bold text-foreground">Belum ada pengguna terdaftar</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Pengguna otomatis terdaftar saat pertama kali masuk via WhatsApp OTP.
                  </p>
                </div>
              ) : (
                <div className="mt-4 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Pengguna</TableHead>
                        <TableHead>WhatsApp</TableHead>
                        <TableHead className="text-center">Aktivitas</TableHead>
                        <TableHead>Bergabung</TableHead>
                        <TableHead>Peran</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((u) => {
                        const isOwner = u.role === 'ADMIN'
                        return (
                          <TableRow key={u.id}>
                            <TableCell>
                              <div className="flex items-center gap-2.5">
                                <span
                                  aria-hidden="true"
                                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 text-[10px] font-extrabold text-zinc-950"
                                >
                                  {initialsOf(u.name)}
                                </span>
                                <p className="text-xs font-bold text-foreground">
                                  {u.name ?? 'Tanpa nama'}
                                  {isOwner && (
                                    <span className="ml-1.5 inline-flex items-center gap-0.5 rounded-full bg-amber-400 px-1.5 py-0.5 text-[9px] font-extrabold text-zinc-950">
                                      <Crown className="h-2.5 w-2.5" aria-hidden="true" />
                                      PEMILIK
                                    </span>
                                  )}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="whitespace-nowrap font-mono text-xs text-muted-foreground">
                              +{u.phone}
                            </TableCell>
                            <TableCell className="whitespace-nowrap text-center text-[11px] text-muted-foreground">
                              {u.orderCount} pesanan · {u.listingCount} listing
                            </TableCell>
                            <TableCell className="whitespace-nowrap text-[11px] text-muted-foreground">
                              {formatTanggal(u.createdAt)}
                            </TableCell>
                            <TableCell>
                              {isOwner ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-950">
                                  <Crown className="h-3 w-3" aria-hidden="true" />
                                  Pemilik
                                </span>
                              ) : (
                                <Select
                                  value={u.role}
                                  onValueChange={(v) => void ubahPeran(u, v as 'BUYER' | 'SELLER')}
                                  disabled={busyUserId === u.id}
                                >
                                  <SelectTrigger className="h-8 w-[120px] rounded-full text-xs font-bold" aria-label={`Ubah peran ${u.name ?? u.phone}`}>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-card">
                                    <SelectItem value="BUYER" className="text-xs">
                                      Pembeli
                                    </SelectItem>
                                    <SelectItem value="SELLER" className="text-xs">
                                      Penjual
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}

              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                Peran <strong className="text-foreground">Pemilik</strong> terikat pada nomor WhatsApp
                resmi situs dan tidak dapat diubah dari panel. Pengguna lain bisa dipromosikan
                menjadi Penjual atau dikembalikan menjadi Pembeli.
              </p>
            </section>
          </TabsContent>
        </Tabs>
      </div>

      {/* ===== Dialog tolak listing (dengan catatan) ===== */}
      <Dialog open={rejectTarget !== null} onOpenChange={(o) => !o && setRejectTarget(null)}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>Tolak listing {rejectTarget?.code}?</DialogTitle>
            <DialogDescription>
              Berikan alasan yang jelas — catatan ini tampil di dashboard penjual agar mereka bisa
              memperbaiki akunnya.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reject-note">Catatan untuk penjual</Label>
            <Textarea
              id="reject-note"
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              placeholder="cth. Deskripsi kurang detail, sertakan umur akun & bukti email ikutan."
              rows={3}
              maxLength={300}
            />
            <p className="text-right text-[10px] text-muted-foreground">{rejectNote.length}/300</p>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-full" onClick={() => setRejectTarget(null)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              className="rounded-full"
              disabled={rejectTarget === null}
              onClick={() => {
                if (rejectTarget) {
                  void moderate(rejectTarget.id, 'reject', rejectNote || undefined)
                  setRejectTarget(null)
                }
              }}
            >
              <X className="mr-1.5 h-4 w-4" aria-hidden="true" />
              Tolak Listing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  )
}
