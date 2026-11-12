export const instant = false;

import Link from "next/link";
import { notFound } from "next/navigation";
import { getNews, listNews } from "@/modules/cms/news/service";
import "@/styles/news.css";

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Resolve the post by slug — works whether getNews returns
  // a single item (by id/slug) or the full list.
  const found = await getNews(slug).catch(() => null);
  const all = await listNews();

  const post =
    found && (found as any).slug === slug
      ? found
      : all.find((p) => p.slug === slug);

  if (!post) return notFound();

  // Related — 3 most recent excluding current
  let related: Awaited<ReturnType<typeof listNews>> = [];
  try {
    const all = await listNews();
    related = all.filter((p) => p.slug !== post.slug).slice(0, 3);
  } catch {}

  // If your schema has a rich-text/HTML field, swap this for the real one.
  // Fallback uses `excerpt` so the page never breaks.
  const bodyHtml = (post as any).content ?? (post as any).body ?? null;
  const paragraphs: string[] =
    !bodyHtml && (post as any).excerpt
      ? [String((post as any).excerpt)]
      : [];

  return (
    <>
      {/* Hero */}
      <section className="news-detail-hero">
        <div
          className="news-detail-hero-bg"
          style={{ backgroundImage: `url('${post.coverImage}')` }}
        />
        <div className="news-detail-hero-overlay" />
        <div className="container">
          <nav className="hero-chip" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="dot">·</span>
            <Link href="/news">News</Link>
            <span className="dot">·</span>
            <span className="current">{post.title}</span>
          </nav>

          <div className="news-detail-hero-content">
            <div className="news-detail-hero-meta">
              <span className="news-detail-status">{post.category}</span>
              <span className="news-detail-type">Article</span>
            </div>
            <h1 className="news-detail-title">{post.title}</h1>
            <p className="news-detail-meta-line">
              <span className="material-symbols-outlined">calendar_today</span>
              {post.publishedAt}
              <span className="dot">·</span>
              <span className="material-symbols-outlined">person</span>
              Ted-Nomex Editorial
            </p>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="news-detail-body">
        <div className="container">
          <div className="news-detail-layout">
            {/* Main */}
            <div className="news-detail-main">
              <article className="news-prose">
                {bodyHtml ? (
                  <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
                ) : paragraphs.length > 0 ? (
                  paragraphs.map((p, i) => <p key={i}>{p}</p>)
                ) : (
                  <p>This article is coming soon. Please check back later.</p>
                )}
              </article>
            </div>

            {/* Sidebar */}
            <aside className="news-detail-sidebar">
              <div className="news-detail-card">
                <p className="news-detail-card-kicker">Stay in the loop</p>
                <h3>Get project updates in your inbox.</h3>
                <p>
                  Occasional stories about what we&apos;re building across Ghana —
                  no spam, unsubscribe anytime.
                </p>
                <Link href="/contact" className="news-detail-card-cta">
                  Contact us
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
                <Link href="/news" className="news-detail-card-cta-ghost">
                  <span className="material-symbols-outlined">arrow_back</span>
                  All articles
                </Link>
              </div>

              <div className="news-detail-author">
                <div className="news-detail-author-avatar">T</div>
                <div>
                  <p className="news-detail-author-name">Ted-Nomex Editorial</p>
                  <p className="news-detail-author-role">Newsroom</p>
                </div>
              </div>
            </aside>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="news-related">
              <div className="news-related-head">
                <h2>More from the newsroom</h2>
                <Link href="/news" className="news-related-link">
                  View all
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
              </div>
              <div className="news-grid">
                {related.map((p) => (
                  <Link
                    key={p.id}
                    href={`/news/${p.slug}`}
                    className="news-card"
                  >
                    <div
                      className="nc-image"
                      style={{ backgroundImage: `url('${p.coverImage}')` }}
                    >
                      <span className="nc-cat">{p.category}</span>
                    </div>
                    <div className="nc-body">
                      <div className="nc-meta">
                        <span>{p.category}</span>
                        <span>·</span>
                        <span>{p.publishedAt}</span>
                      </div>
                      <h3>{p.title}</h3>
                      <p>{p.excerpt}</p>
                      <span className="nc-link">
                        Read more
                        <span className="material-symbols-outlined">arrow_forward</span>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}