import Link from "next/link";
import { Suspense } from "react";
import { listNews } from "@/modules/cms/news/service";
import "@/styles/news.css";

export const metadata = { title: "News" };

async function NewsList() {
  const news = await listNews();
  const [featured, ...rest] = news;
  return (
    <section className="news-body">
      <div className="container">
        <div className="layout">
          <div>
            {featured && (
              <article className="news-featured">
                <div className="featured-image" style={{ backgroundImage: `url('${featured.coverImage}')` }}><span className="badge">Featured</span></div>
                <div className="featured-body">
                  <div className="featured-meta"><span className="cat">{featured.category}</span><span>{featured.publishedAt}</span></div>
                  <h2><Link href={`/news/${featured.slug}`}>{featured.title}</Link></h2>
                  <p>{featured.excerpt}</p>
                  <Link href={`/news/${featured.slug}`} className="read-more">Read article<span className="material-symbols-outlined">arrow_forward</span></Link>
                </div>
              </article>
            )}
            <div className="news-grid">
              {rest.map((post) => (
                <Link key={post.id} href={`/news/${post.slug}`} className="news-card">
                  <div className="nc-image" style={{ backgroundImage: `url('${post.coverImage}')` }}><span className="nc-cat">{post.category}</span></div>
                  <div className="nc-body">
                    <div className="nc-meta"><span>{post.category}</span><span>·</span><span>{post.publishedAt}</span></div>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <span className="nc-link">Read more<span className="material-symbols-outlined">arrow_forward</span></span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <aside className="news-sidebar">
            <div className="panel"><p className="panel-title">Recent posts</p>{news.slice(0, 4).map((post) => (<Link key={post.id} href={`/news/${post.slug}`} className="post-mini"><img src={post.coverImage} alt="" /><div className="text"><p className="title">{post.title}</p><span className="date"><span className="material-symbols-outlined">calendar_today</span>{post.publishedAt}</span></div></Link>))}</div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default function NewsPage() {
  return (
    <>
      <section className="news-hero">
        <div className="container">
          <nav className="hero-chip" aria-label="Breadcrumb"><Link href="/">Home</Link><span className="dot">·</span><span>News</span></nav>
          <p className="hero-eyebrow">Latest</p>
          <h1 className="hero-title">News &amp; <span>insights</span> from the field.</h1>
          <p className="hero-lead">Stay updated with the latest news and developments at Ted-Nomex Construction Company.</p>
        </div>
      </section>
      <Suspense fallback={<div className="news-body"><div className="container"><p>Loading news…</p></div></div>}>
        <NewsList />
      </Suspense>
    
      <section className="news-cta">
        <div className="container">
          <div className="news-cta-text">
            <h2>
              Have a story to <span>share</span>?
            </h2>
            <p>Press, partnerships, or project enquiries — we&apos;d love to hear from you.</p>
          </div>
          <Link href="/contact" className="news-cta-btn">
            Get in touch
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      </section></>
  );
}