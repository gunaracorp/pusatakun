import { db } from '@/lib/db'
import {
  breadcrumbJsonLd,
  faqJsonLd,
  organizationJsonLd,
  personJsonLd,
  productListJsonLd,
  websiteJsonLd,
} from '@/lib/seo'
import type { CategoryDTO, FaqDTO, ProductDTO, StatsDTO, TestimonialDTO } from '@/lib/marketplace'
import { HomeClient } from '@/components/rajaakun/home-client'

export const dynamic = 'force-dynamic'

async function getHomeData() {
  const [categoriesRaw, productsRaw, testimonialsRaw, faqsRaw, totalProducts, totalCategories, agg] =
    await Promise.all([
      db.category.findMany({
        orderBy: { order: 'asc' },
        include: { _count: { select: { products: true } } },
      }),
      db.product.findMany({
        orderBy: { sold: 'desc' },
        take: 24,
        include: { category: { select: { slug: true, name: true } } },
      }),
      db.testimonial.findMany({ orderBy: { order: 'asc' } }),
      db.faq.findMany({ orderBy: { order: 'asc' } }),
      db.product.count(),
      db.category.count(),
      db.product.aggregate({ _sum: { sold: true, stock: true }, _avg: { rating: true } }),
    ])

  const categories: CategoryDTO[] = categoriesRaw.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    tagline: c.tagline,
    icon: c.icon,
    gradient: c.gradient,
    order: c.order,
    productCount: c._count.products,
  }))

  const products: ProductDTO[] = productsRaw.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    categorySlug: p.category.slug,
    categoryName: p.category.name,
    description: p.description,
    price: p.price,
    oldPrice: p.oldPrice,
    stock: p.stock,
    totalStock: p.totalStock,
    level: p.level,
    warranty: p.warranty,
    featured: p.featured,
    hot: p.hot,
    sold: p.sold,
    rating: p.rating,
    specs: safeParseSpecs(p.specs),
  }))

  const testimonials: TestimonialDTO[] = testimonialsRaw.map((t) => ({
    id: t.id,
    name: t.name,
    city: t.city,
    role: t.role,
    content: t.content,
    rating: t.rating,
    initials: t.initials,
  }))

  const faqs: FaqDTO[] = faqsRaw.map((f) => ({
    id: f.id,
    question: f.question,
    answer: f.answer,
  }))

  const stats: StatsDTO = {
    totalProducts,
    totalCategories,
    totalSold: agg._sum.sold ?? 0,
    totalStock: agg._sum.stock ?? 0,
    avgRating: Math.round((agg._avg.rating ?? 4.9) * 10) / 10,
  }

  return { categories, products, testimonials, faqs, stats, totalProducts }
}

function safeParseSpecs(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return []
  }
}

export default async function Page() {
  const { categories, products, testimonials, faqs, stats, totalProducts } = await getHomeData()

  const jsonLdBlocks = [
    organizationJsonLd(),
    personJsonLd(),
    websiteJsonLd(),
    breadcrumbJsonLd(),
    faqJsonLd(faqs),
    productListJsonLd(products),
  ]

  return (
    <>
      {jsonLdBlocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
      <HomeClient
        stats={stats}
        categories={categories}
        initialProducts={products}
        initialTotal={totalProducts}
        testimonials={testimonials}
        faqs={faqs}
      />
    </>
  )
}
