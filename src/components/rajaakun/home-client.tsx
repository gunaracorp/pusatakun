'use client'

import { useCallback, useState } from 'react'
import type { CategoryDTO, FaqDTO, ProductDTO, StatsDTO, TestimonialDTO } from '@/lib/marketplace'
import { useCatalogStore } from '@/store/catalog-store'
import { ActivityTicker } from './activity-ticker'
import { BackToTop } from './back-to-top'
import { Catalog } from './catalog'
import { CategoriesSection } from './categories-section'
import { CtaSection } from './cta-section'
import { FaqSection } from './faq-section'
import { FloatingWhatsApp } from './floating-whatsapp'
import { Footer } from './footer'
import { Hero } from './hero'
import { HowItWorks } from './how-it-works'
import { Navbar } from './navbar'
import { ProductDetailSheet } from './product-detail-sheet'
import { TestimonialsSection } from './testimonials'
import { TrustMarquee } from './trust-marquee'
import { WhyUs } from './why-us'

export function HomeClient({
  stats,
  categories,
  initialProducts,
  initialTotal,
  testimonials,
  faqs,
}: {
  stats: StatsDTO
  categories: CategoryDTO[]
  initialProducts: ProductDTO[]
  initialTotal: number
  testimonials: TestimonialDTO[]
  faqs: FaqDTO[]
}) {
  const [detailProduct, setDetailProduct] = useState<ProductDTO | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const openDetail = useCallback((product: ProductDTO) => {
    setDetailProduct(product)
    setDetailOpen(true)
  }, [])

  const selectCategory = useCallback((categoryId: string) => {
    useCatalogStore.getState().setCategory(categoryId)
    document.getElementById('katalog')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Skip link untuk aksesibilitas */}
      <a
        href="#katalog"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Langsung ke katalog
      </a>

      <Navbar />

      <main className="flex-1">
        <Hero stats={stats} categories={categories} />
        <TrustMarquee />
        <CategoriesSection categories={categories} onSelect={selectCategory} />
        <Catalog
          categories={categories}
          initialProducts={initialProducts}
          initialTotal={initialTotal}
          onOpenDetail={openDetail}
        />
        <WhyUs />
        <HowItWorks />
        <TestimonialsSection testimonials={testimonials} />
        <FaqSection faqs={faqs} />
        <CtaSection />
      </main>

      <Footer categories={categories} />

      {/* Floating utilities */}
      <FloatingWhatsApp />
      <BackToTop />
      <ActivityTicker />

      <ProductDetailSheet
        product={detailProduct}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  )
}
