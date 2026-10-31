/**
 * Scrub rebrand di database: "Raja Akun"/"rajaakun.web.id" -> "Pusatakun"/"pusatakun.web.id".
 * Akun pemilik "rajaakun2026" (username & email) diproteksi.
 * Idempoten — aman dijalankan berulang.
 */
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const rebrand = (s: string): string =>
  s
    .replace(/rajaakun\.web\.id/g, 'pusatakun.web.id')
    .replace(/rajaakun web id/g, 'pusatakun web id')
    .replace(/Rajaakun2026/g, '@@OWNER@@')
    .replace(/rajaakun2026/g, '@@OWNER@@')
    .replace(/RajaAkun/g, 'Pusatakun')
    .replace(/Raja Akun/g, 'Pusatakun')
    .replace(/RAJA AKUN/g, 'PUSATAKUN')
    .replace(/raja akun/g, 'pusatakun')
    .replace(/rajaakun/g, 'pusatakun')
    .replace(/@@OWNER@@/g, 'rajaakun2026')

const needsChange = (s: string | null): boolean =>
  s !== null && /raja akun|rajaakun/i.test(s.replace(/rajaakun2026/gi, ''))

async function scanText(
  label: string,
  rows: { id: string; fields: Record<string, string | null> }[],
) {
  let changed = 0
  for (const row of rows) {
    const dirty = Object.entries(row.fields).some(([, v]) => needsChange(v))
    if (!dirty) continue
    changed++
    console.log(`  [${label}] ${row.id}:`, Object.entries(row.fields).filter(([k, v]) => needsChange(v)).map(([k]) => k).join(', '))
    const data: Record<string, string> = {}
    for (const [k, v] of Object.entries(row.fields)) {
      if (v !== null && needsChange(v)) data[k] = rebrand(v)
    }
    // dynamic update per tabel
    const table = label
    await (db as any)[table].update({ where: { id: row.id }, data })
  }
  console.log(`${label}: ${changed} baris diperbarui`)
  return changed
}

async function main() {
  console.log('== Scrub rebrand database ==')
  let total = 0

  const products = await db.product.findMany()
  total += await scanText(
    'product',
    products.map((p) => ({
      id: p.id,
      fields: {
        name: p.name,
        description: p.description,
        specs: p.specs, // String terenkode JSON
      },
    })),
  )

  const categories = await db.category.findMany()
  total += await scanText(
    'category',
    categories.map((c) => ({
      id: c.id,
      fields: { name: c.name, tagline: c.tagline },
    })),
  )

  const faqs = await db.faq.findMany()
  total += await scanText(
    'faq',
    faqs.map((f) => ({ id: f.id, fields: { question: f.question, answer: f.answer } })),
  )

  const testimonials = await db.testimonial.findMany()
  total += await scanText(
    'testimonial',
    testimonials.map((t) => ({
      id: t.id,
      fields: { name: t.name, role: t.role, content: t.content },
    })),
  )

  const users = await db.user.findMany()
  const userDirty = users.filter((u) => needsChange(u.name))
  for (const u of userDirty) {
    await db.user.update({ where: { id: u.id }, data: { name: rebrand(u.name!) } })
    console.log(`  [user.name] ${u.id}: ${u.name} -> ${rebrand(u.name!)}`)
  }
  total += userDirty.length

  const listings = await db.listing.findMany()
  const listingDirty = listings.filter(
    (l) => needsChange(l.title) || needsChange(l.description) || needsChange(l.adminNote),
  )
  for (const l of listingDirty) {
    await db.listing.update({
      where: { id: l.id },
      data: {
        title: rebrand(l.title),
        description: rebrand(l.description),
        adminNote: l.adminNote ? rebrand(l.adminNote) : null,
      },
    })
    console.log(`  [listing] ${l.id} diperbarui`)
  }
  total += listingDirty.length

  const orders = await db.order.findMany()
  const orderDirty = orders.filter((o) => needsChange(o.productName))
  for (const o of orderDirty) {
    await db.order.update({
      where: { id: o.id },
      data: { productName: rebrand(o.productName) },
    })
    console.log(`  [order.productName] ${o.id} diperbarui`)
  }
  total += orderDirty.length

  console.log(`\n== SELESAI: total ${total} baris disentuh ==`)

  // Verifikasi akhir: tidak boleh ada sisa selain rajaakun2026
  const [p2, f2, t2, c2] = await Promise.all([
    db.product.count(),
    db.faq.count(),
    db.testimonial.count(),
    db.category.count(),
  ])
  const allFaqs = await db.faq.findMany()
  const leftoverFaqs = allFaqs.filter((f) => needsChange(f.question) || needsChange(f.answer))
  const allT = await db.testimonial.findMany()
  const leftoverT = allT.filter((t) => needsChange(t.content))
  console.log(
    `verifikasi: product=${p2}, faq=${f2} (sisa kotor: ${leftoverFaqs.length}), testimonial=${t2} (sisa: ${leftoverT.length}), category=${c2}`,
  )
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
