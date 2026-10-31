import { redirect } from 'next/navigation'

/**
 * /admin — dialihkan permanen ke Pusat Komando Pemilik (/dashboard/admin).
 * Alamat lama tetap berfungsi, tampilan baru lebih lengkap.
 */
export default function AdminRedirectPage() {
  redirect('/dashboard/admin')
}
