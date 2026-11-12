"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { listProperties } from "@/modules/estate/service";
import "@/styles/estate.css";

type Property = Awaited<ReturnType<typeof listProperties>>[number];
type SortKey = "newest" | "price-asc" | "price-desc";

export default function EstatePage() {
  const [all, setAll] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [status, setStatus] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [beds, setBeds] = useState(0);
  const [baths, setBaths] = useState(0);
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");

  useEffect(() => {
    (async () => {
      try {
        const data = await listProperties();
        setAll(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load properties");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const types = useMemo(() => {
    const s = new Set<string>();
    all.forEach((p) => p.type && s.add(p.type));
    return Array.from(s);
  }, [all]);

  const locations = useMemo(() => {
    const s = new Set<string>();
    all.forEach((p) => p.location && s.add(p.location));
    return Array.from(s);
  }, [all]);

  const filtered = useMemo(() => {
    let out = all.filter((p) => {
      if (status && p.status !== status) return false;
      if (type && p.type !== type) return false;
      if (location && p.location !== location) return false;
      if (beds && p.bedrooms < beds) return false;
      if (baths && p.bathrooms < baths) return false;
      if (minPrice && Number(p.price) < Number(minPrice)) return false;
      if (maxPrice && Number(p.price) > Number(maxPrice)) return false;
      return true;
    });
    out = [...out];
    if (sort === "price-asc") out.sort((a, b) => Number(a.price) - Number(b.price));
    if (sort === "price-desc") out.sort((a, b) => Number(b.price) - Number(a.price));
    return out;
  }, [all, status, type, location, beds, baths, minPrice, maxPrice, sort]);

  const reset = () => {
    setStatus(""); setType(""); setLocation("");
    setMinPrice(""); setMaxPrice(""); setBeds(0); setBaths(0);
    setSort("newest");
  };

  const activeFilters =
    (status ? 1 : 0) + (type ? 1 : 0) + (location ? 1 : 0) +
    (minPrice ? 1 : 0) + (maxPrice ? 1 : 0) + (beds ? 1 : 0) + (baths ? 1 : 0);

  return (
    <>
      {/* Hero */}
      <section className="estate-hero">
        <div className="container">
          <nav className="hero-chip" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="dot">·</span>
            <span>Real estate</span>
          </nav>
          <p className="hero-eyebrow">Our real estate</p>
          <h1 className="hero-title">
            Find your next <span>property</span>.
          </h1>
          <p className="hero-lead">
            At Ted-Nomex Construction Company, we extend our expertise beyond
            construction to offer comprehensive real estate services — from
            residential homes to commercial and industrial developments across
            Ghana.
          </p>

          <div className="estate-hero-stats">
            <div className="estate-hero-stat">
              <span className="estate-hero-stat-value">{all.length}</span>
              <span className="estate-hero-stat-label">Listings available</span>
            </div>
            <div className="estate-hero-stat">
              <span className="estate-hero-stat-value">{locations.length}</span>
              <span className="estate-hero-stat-label">Locations</span>
            </div>
            <div className="estate-hero-stat">
              <span className="estate-hero-stat-value">12+</span>
              <span className="estate-hero-stat-label">Years in real estate</span>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="estate-body">
        <div className="container">
          <div className="layout">

            {/* SIDEBAR */}
            <aside className="estate-sidebar">
              <div className="filter-head">
                <h3>Filters</h3>
                {activeFilters > 0 && (
                  <button type="button" className="filter-reset" onClick={reset}>
                    Reset ({activeFilters})
                  </button>
                )}
              </div>

              <div className="filter-group">
                <p className="group-label">Status</p>
                <div className="filter-checks">
                  {["For Sale", "For Rent"].map((s) => (
                    <label key={s}>
                      <input
                        type="radio"
                        name="status"
                        checked={status === s}
                        onChange={() => setStatus(status === s ? "" : s)}
                      />
                      <span>{s}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <p className="group-label">Type</p>
                <div className="filter-checks">
                  {types.length === 0 && <span className="filter-empty">No types yet</span>}
                  {types.map((t) => (
                    <label key={t}>
                      <input
                        type="radio"
                        name="type"
                        checked={type === t}
                        onChange={() => setType(type === t ? "" : t)}
                      />
                      <span>{t}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <p className="group-label">Price range</p>
                <div className="filter-price">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <span>—</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="filter-group">
                <p className="group-label">Bedrooms</p>
                <div className="filter-pills">
                  {[0, 1, 2, 3, 4].map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={beds === n ? "active" : ""}
                      onClick={() => setBeds(n)}
                    >
                      {n === 0 ? "Any" : `${n}+`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <p className="group-label">Bathrooms</p>
                <div className="filter-pills">
                  {[0, 1, 2, 3, 4].map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={baths === n ? "active" : ""}
                      onClick={() => setBaths(n)}
                    >
                      {n === 0 ? "Any" : `${n}+`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <p className="group-label">Location</p>
                <div className="filter-checks">
                  {locations.length === 0 && <span className="filter-empty">No locations yet</span>}
                  {locations.map((l) => (
                    <label key={l}>
                      <input
                        type="radio"
                        name="location"
                        checked={location === l}
                        onChange={() => setLocation(location === l ? "" : l)}
                      />
                      <span>{l}</span>
                    </label>
                  ))}
                </div>
              </div>
            </aside>

            {/* MAIN */}
            <div className="estate-main">
              <div className="results-head">
                <p>
                  <span>{filtered.length}</span>{" "}
                  {filtered.length === 1 ? "property" : "properties"} available
                </p>
                <div className="results-sort">
                  <label htmlFor="sort">Sort by</label>
                  <select
                    id="sort"
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortKey)}
                  >
                    <option value="newest">Newest</option>
                    <option value="price-asc">Price: low → high</option>
                    <option value="price-desc">Price: high → low</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="estate-loading">
                  <span className="material-symbols-outlined">progress_activity</span>
                  <p>Loading properties…</p>
                </div>
              ) : error ? (
                <div className="estate-empty">
                  <span className="material-symbols-outlined">error</span>
                  <h3>Could not load properties</h3>
                  <p>{error}</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="estate-empty">
                  <span className="material-symbols-outlined">home_work</span>
                  <h3>No properties match your filters</h3>
                  <p>Try adjusting the filters on the left, or reset them to see all listings.</p>
                  {activeFilters > 0 && (
                    <button type="button" className="estate-empty-cta" onClick={reset}>
                      Clear filters
                    </button>
                  )}
                </div>
              ) : (
                <div className="estate-grid">
                  {filtered.map((p) => (
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
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="estate-cta">
        <div className="container">
          <div className="estate-cta-text">
            <h2>
              Looking for <span>something specific</span>?
            </h2>
            <p>Tell us what you need — we'll find it.</p>
          </div>
          <Link href="/contact" className="estate-cta-btn">
            Contact us
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      </section>
    </>
  );
}