export const instant = false;

import Link from "next/link";
import { notFound } from "next/navigation";
import { getService, listServices } from "@/modules/cms/services/service";
import "@/styles/services.css";

type Props = { params: Promise<{ slug: string }> };

type ServiceRow = NonNullable<Awaited<ReturnType<typeof getService>>>;

export default async function ServiceSinglePage({ params }: Props) {
  const { slug } = await params;

  let service: ServiceRow | null = null;
  try {
    service = await getService(slug);
  } catch {
    service = null;
  }
  if (!service) return notFound();

  let others: ServiceRow[] = [];
  try {
    const all = await listServices();
    others = all.filter((s) => s.slug !== service!.slug).slice(0, 6);
  } catch {
    others = [];
  }

  const cover = service.coverImage ?? "";
  const hasCover = cover.length > 0;

  return (
    <>
      {/* ── Hero ── */}
      <section className="svc-detail-hero">
        <div
          className="svc-detail-hero-bg"
          style={hasCover ? { backgroundImage: `url('${cover}')` } : undefined}
        />
        <div className="svc-detail-hero-overlay" />
        <div className="container">
          <nav className="hero-chip" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="dot">·</span>
            <Link href="/services">Services</Link>
            <span className="dot">·</span>
            <span className="current">{service.title}</span>
          </nav>

          <div className="svc-detail-hero-content">
            {service.tags?.length > 0 && (
              <div className="svc-detail-hero-tags">
                {service.tags.map((t: string) => (
                  <span key={t} className="svc-detail-tag">{t}</span>
                ))}
              </div>
            )}
            <h1 className="svc-detail-title">{service.title}</h1>
            <p className="svc-detail-excerpt">{service.excerpt}</p>
          </div>
        </div>
      </section>

      {/* ── Body ── */}
      <section className="svc-detail-body">
        <div className="container">
          <div className="svc-detail-layout">
            {/* Main column */}
            <div className="svc-detail-main">
              {service.content && (
                <div className="svc-detail-section">
                  <p className="svc-detail-kicker">About this service</p>
                  <h2>Overview</h2>
                  <p className="svc-detail-desc">{service.content}</p>
                </div>
              )}

              {service.features?.length > 0 && (
                <div className="svc-detail-section">
                  <p className="svc-detail-kicker">What&apos;s included</p>
                  <h2>Key features</h2>
                  <div className="svc-features">
                    {service.features.map((f: string) => (
                      <div key={f} className="svc-feature">
                        <span className="svc-feature-icon">check_circle</span>
                        <span className="svc-feature-text">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {service.bullets?.length > 0 && (
                <div className="svc-detail-section">
                  <p className="svc-detail-kicker">Deliverables</p>
                  <h2>What you&apos;ll get</h2>
                  <ul className="svc-bullets">
                    {service.bullets.map((b: string) => (
                      <li key={b} className="svc-bullet">
                        <span className="material-symbols-outlined">arrow_right</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sticky sidebar */}
            <aside className="svc-detail-sidebar">
              <div className="svc-detail-card">
                <p className="svc-detail-card-kicker">Get started</p>
                <h3>Request a tailored quote for this service.</h3>
                <p>
                  Tell us about your project and we&apos;ll respond with scope,
                  timeline, and pricing within 24 hours.
                </p>
                <Link href="/contact" className="svc-detail-card-cta">
                  Request a quote
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
                <Link href="/services" className="svc-detail-card-cta-ghost">
                  <span className="material-symbols-outlined">arrow_back</span>
                  All services
                </Link>
              </div>

              {others.length > 0 && (
                <div className="panel">
                  <p className="panel-title">Other services</p>
                  <div className="nav-list">
                    {others.map((s: ServiceRow) => (
                      <Link
                        key={s.id}
                        href={`/services/${s.slug}`}
                        className="nav-link"
                      >
                        {s.title}
                        <span className="material-symbols-outlined">chevron_right</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>

          {/* Related (bottom grid) */}
          {others.length > 0 && (
            <div className="svc-related">
              <div className="svc-related-head">
                <h2>Explore other services</h2>
                <Link href="/services" className="svc-related-link">
                  View all
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
              </div>
              <div className="services-grid-v2">
                {others.slice(0, 3).map((s: ServiceRow, i: number) => (
                  <article key={s.id} className="svc-card">
                    <div
                      className={s.coverImage ? "svc-image" : "svc-image svc-image-empty"}
                      style={s.coverImage ? { backgroundImage: `url('${s.coverImage}')` } : undefined}
                    >
                      <span className="svc-num">
                        {String(i + 1).padStart(2, "0")}.
                      </span>
                    </div>
                    <div className="svc-body">
                      {s.tags?.length > 0 && (
                        <div className="svc-tags">
                          {s.tags.slice(0, 3).map((t: string) => (
                            <span key={t} className="svc-tag">{t}</span>
                          ))}
                        </div>
                      )}
                      <h3>{s.title}</h3>
                      <p>{s.excerpt}</p>
                      <Link href={`/services/${s.slug}`} className="svc-link">
                        Read more
                        <span className="material-symbols-outlined">arrow_forward</span>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}