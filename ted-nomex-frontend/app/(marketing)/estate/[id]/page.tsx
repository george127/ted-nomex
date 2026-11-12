import Link from "next/link";
import { notFound } from "next/navigation";
import { getProperty, listProperties } from "@/modules/estate/service";
import "@/styles/estate.css";
export const instant = false;
export default async function EstateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getProperty(id);
  if (!property) return notFound();

  // Fetch related for the bottom section
  let related: Awaited<ReturnType<typeof listProperties>> = [];
  try {
    const all = await listProperties();
    related = all.filter((p) => p.id !== property.id).slice(0, 3);
  } catch {}

  return (
    <>
      {/* Hero */}
      <section className="estate-detail-hero">
        <div className="estate-detail-hero-bg" style={{ backgroundImage: `url('${property.images[0] ?? ""}')` }}>
          <div className="estate-detail-hero-overlay" />
        </div>
        <div className="container">
          <nav className="hero-chip" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="dot">·</span>
            <Link href="/estate">Real estate</Link>
            <span className="dot">·</span>
            <span className="current">{property.title}</span>
          </nav>

          <div className="estate-detail-hero-content">
            <div className="estate-detail-hero-meta">
              <span className="estate-detail-status">{property.status}</span>
              <span className="estate-detail-type">{property.type}</span>
            </div>
            <h1 className="estate-detail-title">{property.title}</h1>
            <p className="estate-detail-location">
              <span className="material-symbols-outlined">location_on</span>
              {property.location}
            </p>
            <div className="estate-detail-price">
              <span className="estate-detail-price-currency">{property.currency}</span>
              <span className="estate-detail-price-value">
                {Number(property.price).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="estate-detail-body">
        <div className="container">
          <div className="estate-detail-layout">

            {/* Main column */}
            <div className="estate-detail-main">
              {/* Specs strip */}
              <div className="estate-detail-specs">
                <div className="spec">
                  <span className="material-symbols-outlined">bed</span>
                  <span className="spec-value">{property.bedrooms}</span>
                  <span className="spec-label">Bedrooms</span>
                </div>
                <div className="spec">
                  <span className="material-symbols-outlined">bathtub</span>
                  <span className="spec-value">{property.bathrooms}</span>
                  <span className="spec-label">Bathrooms</span>
                </div>
                <div className="spec">
                  <span className="material-symbols-outlined">directions_car</span>
                  <span className="spec-value">{property.parking}</span>
                  <span className="spec-label">Parking</span>
                </div>
                <div className="spec">
                  <span className="material-symbols-outlined">square_foot</span>
                  <span className="spec-value">{property.area}</span>
                  <span className="spec-label">Sqft</span>
                </div>
              </div>

              {/* Description */}
              <div className="estate-detail-section">
                <p className="estate-detail-kicker">About the property</p>
                <h2>Property description</h2>
                <p className="estate-detail-desc">{property.description}</p>
              </div>

              {/* Amenities */}
              {property.amenities?.length > 0 && (
                <div className="estate-detail-section">
                  <p className="estate-detail-kicker">What's included</p>
                  <h2>Amenities</h2>
                  <div className="estate-detail-amenities">
                    {property.amenities.map((a) => (
                      <div key={a} className="amenity">
                        <span className="material-symbols-outlined">check_circle</span>
                        {a}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Features / type */}
              <div className="estate-detail-section">
                <p className="estate-detail-kicker">Overview</p>
                <h2>Key details</h2>
                <div className="estate-detail-facts">
                  <div className="fact">
                    <span className="fact-label">Property type</span>
                    <span className="fact-value">{property.type}</span>
                  </div>
                  <div className="fact">
                    <span className="fact-label">Status</span>
                    <span className="fact-value">{property.status}</span>
                  </div>
                  <div className="fact">
                    <span className="fact-label">Location</span>
                    <span className="fact-value">{property.location}</span>
                  </div>
                  <div className="fact">
                    <span className="fact-label">Currency</span>
                    <span className="fact-value">{property.currency}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky sidebar — booking */}
            <aside className="estate-detail-sidebar">
              <div className="estate-detail-card">
                <p className="estate-detail-card-kicker">Listed at</p>
                <div className="estate-detail-card-price">
                  <span>{property.currency}</span>
                  {Number(property.price).toLocaleString()}
                </div>

                <div className="estate-detail-card-meta">
                  <div>
                    <span className="meta-label">Type</span>
                    <span className="meta-value">{property.type}</span>
                  </div>
                  <div>
                    <span className="meta-label">Status</span>
                    <span className="meta-value">{property.status}</span>
                  </div>
                </div>

                <Link href="/contact" className="estate-detail-card-cta">
                  Book a viewing
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
                <Link href="/contact" className="estate-detail-card-cta-ghost">
                  <span className="material-symbols-outlined">call</span>
                  Call us
                </Link>

                <p className="estate-detail-card-note">
                  A member of our team will respond within 24 hours.
                </p>
              </div>

              <div className="estate-detail-agent">
                <div className="estate-detail-agent-avatar">T</div>
                <div>
                  <p className="estate-detail-agent-name">Ted-Nomex Realty</p>
                  <p className="estate-detail-agent-role">Sales &amp; lettings</p>
                </div>
              </div>
            </aside>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="estate-related">
              <div className="estate-related-head">
                <h2>You may also like</h2>
                <Link href="/estate" className="estate-related-link">
                  View all properties
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
              </div>
              <div className="estate-grid">
                {related.map((p) => (
                  <Link
                    key={p.id}
                    href={`/estate/${p.id}`}
                    className="property-card"
                  >
                    <div
                      className="pc-image"
                      style={{ backgroundImage: `url('${p.images[0] ?? ""}')` }}
                    >
                      <span className="pc-status">{p.status}</span>
                      <span className="pc-price-tag">
                        <span className="pc-price-currency">{p.currency}</span>
                        {Number(p.price).toLocaleString()}
                      </span>
                    </div>
                    <div className="pc-body">
                      <h3>{p.title}</h3>
                      <p className="pc-location">
                        <span className="material-symbols-outlined">location_on</span>
                        {p.location}
                      </p>
                      <div className="pc-specs">
                        <span className="spec">
                          <span className="material-symbols-outlined">bed</span>
                          {p.bedrooms} bd
                        </span>
                        <span className="spec">
                          <span className="material-symbols-outlined">bathtub</span>
                          {p.bathrooms} ba
                        </span>
                        <span className="spec">
                          <span className="material-symbols-outlined">square_foot</span>
                          {p.area} sqft
                        </span>
                      </div>
                      <span className="pc-link">
                        View details
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