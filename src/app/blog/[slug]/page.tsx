import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CalendarDays, Clock, Tag, User } from 'lucide-react'
import { PageShell } from '@/components/pusatakun/page-shell'
import { PageHero, Breadcrumbs } from '@/components/pusatakun/page-hero'
import { Reveal } from '@/components/pusatakun/motion-primitives'
import { SITE, waLink } from '@/lib/marketplace'
import { getPageCategories } from '@/lib/page-data'
import {
  BLOG_ARTICLES,
  formatDateID,
  getArticleBySlug,
  getRelatedArticles,
} from '@/lib/blog-data'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) return { title: 'Artikel tidak ditemukan' }
  return {
    title: article.title,
    description: article.excerpt,
    keywords: article.tags,
    alternates: { canonical: `/blog/${article.slug}` },
    robots: { index: true, follow: true },
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.excerpt,
      publishedTime: article.date,
      url: `${SITE.url}/blog/${article.slug}`,
    },
  }
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) notFound()

  const categories = await getPageCategories()
  const related = getRelatedArticles(article.slug, article.category)

  const slugify = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const blogPostingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    dateModified: article.date,
    inLanguage: 'id-ID',
    wordCount:
      article.intro.split(/\s+/).length +
      article.sections.reduce((n, s) => n + s.paragraphs.join(' ').split(/\s+/).length, 0),
    author: { '@type': 'Organization', name: SITE.name, url: SITE.url },
    publisher: { '@id': `${SITE.url}/#organization` },
    mainEntityOfPage: `${SITE.url}/blog/${article.slug}`,
    keywords: article.tags.join(', '),
    articleSection: article.category,
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: article.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <PageShell categories={categories}>
      {[blogPostingJsonLd, faqJsonLd].map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}

      <PageHero
        kicker={`BLOG — ${article.category.toUpperCase()}`}
        title={article.title}
        description={article.excerpt}
        breadcrumb={[{ label: 'Blog', href: '/blog' }, { label: article.category }]}
      />

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_280px] lg:px-8">
        {/* Isi artikel */}
        <article>
          {/* Meta penulis */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 font-semibold">
              <User className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              {article.author}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              {formatDateID(article.date)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              {article.readMinutes} menit baca
            </span>
          </div>

          <p className="mt-6 border-l-2 border-primary/60 pl-4 text-base font-medium leading-relaxed text-foreground/90 sm:text-lg">
            {article.intro}
          </p>

          {article.sections.map((section, i) => (
            <Reveal key={i} delay={0.04}>
              <section className="mt-10" aria-labelledby={`sec-${i}`}>
                <h2
                  id={`sec-${slugify(section.heading)}`}
                  className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl"
                >
                  <span className="mr-2 text-primary">{String(i + 1).padStart(2, '0')}</span>
                  {section.heading}
                </h2>
                {section.paragraphs.map((p, j) => (
                  <p key={j} className="mt-4 leading-relaxed text-muted-foreground">
                    {p}
                  </p>
                ))}
                {section.bullets ? (
                  <ul className="mt-4 space-y-2.5">
                    {section.bullets.map((b, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                        {b}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            </Reveal>
          ))}

          {/* Kesimpulan */}
          <div className="glass mt-12 rounded-2xl border-l-4 border-l-primary p-6">
            <h2 className="text-sm font-extrabold uppercase tracking-[0.2em] text-primary">
              Kesimpulan
            </h2>
            <p className="mt-3 leading-relaxed text-foreground/90">{article.conclusion}</p>
          </div>

          {/* FAQ */}
          <section className="mt-12" aria-labelledby="faq-blog">
            <h2 id="faq-blog" className="text-xl font-extrabold text-foreground sm:text-2xl">
              Pertanyaan yang Sering Diajukan
            </h2>
            <div className="mt-5 space-y-3">
              {article.faqs.map((f, i) => (
                <details key={i} className="glass group rounded-xl p-5">
                  <summary className="cursor-pointer list-none text-sm font-bold text-foreground transition-colors group-open:text-primary">
                    {f.q}
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* Tag + CTA */}
          <div className="mt-10 flex flex-wrap items-center gap-2">
            <Tag className="h-4 w-4 text-primary" aria-hidden="true" />
            {article.tags.map((t) => (
              <span key={t} className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted-foreground">
                #{t}
              </span>
            ))}
          </div>
          <div className="glass mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl p-6 sm:flex-row sm:items-center">
            <p className="text-sm font-semibold text-foreground">
              Masih ragu atau butuh rekomendasi akun?
            </p>
            <a
              href={waLink(`Halo Admin Pusatakun! Saya baru baca artikel "${article.title}". Boleh tanya-tanya?`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center rounded-xl bg-primary px-5 text-sm font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Chat Admin 24/7
            </a>
          </div>
        </article>

        {/* Sidebar: TOC + artikel terkait */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <nav aria-label="Daftar isi" className="glass rounded-2xl p-5">
            <h2 className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
              Daftar Isi
            </h2>
            <ol className="mt-4 space-y-2.5">
              {article.sections.map((s, i) => (
                <li key={i}>
                  <a
                    href={`#${slugify(s.heading)}`}
                    className="text-sm leading-snug text-muted-foreground transition-colors hover:text-primary"
                  >
                    {i + 1}. {s.heading}
                  </a>
                </li>
              ))}
              <li>
                <a href="#faq-blog" className="text-sm leading-snug text-muted-foreground transition-colors hover:text-primary">
                  FAQ
                </a>
              </li>
            </ol>
          </nav>

          <nav aria-label="Artikel terkait" className="glass rounded-2xl p-5">
            <h2 className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
              Artikel Terkait
            </h2>
            <ul className="mt-4 space-y-4">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={`/blog/${r.slug}`} className="group block">
                    <p className="text-[11px] font-bold text-primary">{r.category}</p>
                    <p className="mt-1 text-sm font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
                      {r.title}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDateID(r.date)} · {r.readMinutes} mnt
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>

      {/* Navigasi antar artikel */}
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Blog', href: '/blog' }, { label: article.category }]} />
        <div className="mt-4 flex flex-wrap justify-between gap-3">
          {BLOG_ARTICLES.map((a, i) => {
            if (a.slug !== article.slug) return null
            const prev = BLOG_ARTICLES[i - 1]
            const next = BLOG_ARTICLES[i + 1]
            return (
              <div key={a.slug} className="flex w-full flex-wrap justify-between gap-3">
                {prev ? (
                  <Link
                    href={`/blog/${prev.slug}`}
                    className="glass min-h-[44px] flex-1 rounded-xl px-4 py-3 text-sm font-bold text-muted-foreground transition-colors hover:text-primary sm:max-w-[48%]"
                  >
                    ← {prev.title}
                  </Link>
                ) : (
                  <span className="flex-1 sm:max-w-[48%]" />
                )}
                {next ? (
                  <Link
                    href={`/blog/${next.slug}`}
                    className="glass min-h-[44px] flex-1 rounded-xl px-4 py-3 text-right text-sm font-bold text-muted-foreground transition-colors hover:text-primary sm:max-w-[48%]"
                  >
                    {next.title} →
                  </Link>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    </PageShell>
  )
}
