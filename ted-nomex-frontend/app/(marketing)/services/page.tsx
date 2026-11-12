import Link from "next/link";
import { Suspense } from "react";
import { listServices } from "@/modules/cms/services/service";
import "@/styles/services.css";

export const metadata = { title: "Our Services" };

async function ServicesList() {
  const services = await listServices();

  if (services.length === 0) {
    return (
      <section className="services-body">
        <div className="container">
          <div className="svc-empty">
            <span className="material-symbols-outlined">handyman</span>
            <h3>No services yet</h3>
            <p>Our team is preparing service listings. Check back soon.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="services-body">
      <div className="container">
        <div className="layout">
          <div className="services-grid-v2">
            {services.map((service, i) => (
              <article key={service.id} className="svc-card">
                <div
                  className={service.coverImage ? "svc-image" : "svc-image svc-image-empty"}
                  style={service.coverImage ? { backgroundImage: `url('${service.coverImage}')` } : undefined}
                >
                  <span className="svc-num">
                    {String(i + 1).padStart(2, "0")}.
                  </span>
                </div>
                <div className="svc-body">
                  {service.tags?.length > 0 && (
                    <div className="svc-tags">
                      {service.tags.slice(0, 3).map((t) => (
                        <span key={t} className="svc-tag">{t}</span>
                      ))}
                    </div>
                  )}
                  <h3>{service.title}</h3>
                  <p>{service.excerpt}</p>
                  <Link href={`/services/${service.slug}`} className="svc-link">
                    Read more
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <aside className="svc-sidebar">
            <div className="panel">
              <p className="panel-title">All services</p>
              <div className="nav-list">
                {services.map((s) => (
                  <Link key={s.id} href={`/services/${s.slug}`} className="nav-link">
                    {s.title}
                    <span className="material-symbols-outlined">chevron_right</span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default function ServicesPage() {
  return (
    <>
      <section className="services-hero">
        <div className="container">
          <nav className="hero-chip" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="dot">·</span>
            <span>Services</span>
          </nav>
          <p className="hero-eyebrow">What we do</p>
          <h1 className="hero-title">
            Our <span>services</span> — built to last.
          </h1>
          <p className="hero-lead">
            From interior renovation to full construction management, we deliver
            superior craftsmanship across Ghana.
          </p>
          <div className="services-hero-stats">
            <div className="services-hero-stat">
              <span className="services-hero-stat-value">10+</span>
              <span className="services-hero-stat-label">Service lines</span>
            </div>
            <div className="services-hero-stat">
              <span className="services-hero-stat-value">12+</span>
              <span className="services-hero-stat-label">Years experience</span>
            </div>
            <div className="services-hero-stat">
              <span className="services-hero-stat-value">100%</span>
              <span className="services-hero-stat-label">Satisfaction</span>
            </div>
          </div>
        </div>
      </section>

      <Suspense
        fallback={
          <div className="services-body">
            <div className="container">
              <div className="svc-loading">
                <span className="material-symbols-outlined">progress_activity</span>
                <p>Loading services…</p>
              </div>
            </div>
          </div>
        }
      >
        <ServicesList />
      </Suspense>

      <section className="svc-cta">
        <div className="container">
          <h2>
            Need something <span>custom</span>?
          </h2>
          <Link href="/contact" className="btn-solid">
            Request a quote
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      </section>
    </>
  );
}