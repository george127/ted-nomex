"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { listProducts, type Product } from "@/modules/shop/products/service";
import { ProductCard } from "@/components/marketing/shop/ProductCard";
import "@/styles/product.css";

type Sort = "newest" | "price-asc" | "price-desc" | "name";

export default function ProductPage() {
  const [all, setAll] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState<Sort>("newest");

  useEffect(() => {
    (async () => {
      try { setAll(await listProducts()); }
      catch (err: any) { setError(err?.message ?? "Could not load products"); }
      finally { setLoading(false); }
    })();
  }, []);

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    all.forEach((p) => {
      const c = p.category || "Uncategorized";
      map.set(c, (map.get(c) ?? 0) + 1);
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [all]);

  const filtered = useMemo(() => {
    let out = all.filter((p) => {
      if (search) {
        const q = search.toLowerCase();
        const hay = `${p.name} ${p.description} ${p.category ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (category && (p.category || "Uncategorized") !== category) return false;
      if (maxPrice && Number(p.price) > Number(maxPrice)) return false;
      return true;
    });
    out = [...out];
    switch (sort) {
      case "price-asc":  out.sort((a, b) => Number(a.price) - Number(b.price)); break;
      case "price-desc": out.sort((a, b) => Number(b.price) - Number(a.price)); break;
      case "name":       out.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return out;
  }, [all, search, category, maxPrice, sort]);

  const reset = () => {
    setSearch(""); setCategory(""); setMaxPrice(""); setSort("newest");
  };
  const activeFilters =
    (search ? 1 : 0) + (category ? 1 : 0) + (maxPrice ? 1 : 0);

  return (
    <>
      {/* ── Hero ── */}
      <section className="product-hero">
        <div className="container">
          <nav className="hero-chip" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="dot">·</span>
            <span>Shop</span>
          </nav>
          <p className="hero-eyebrow">Our products</p>
          <h1 className="hero-title">
            Quality materials, <span>delivered</span>.
          </h1>
          <p className="hero-lead">
            Construction supplies, tools and finishing materials — sourced and
            stocked by Ted-Nomex for projects across Ghana.
          </p>
          <div className="product-hero-stats">
            <div className="product-hero-stat">
              <span className="product-hero-stat-value">{all.length}</span>
              <span className="product-hero-stat-label">Products in stock</span>
            </div>
            <div className="product-hero-stat">
              <span className="product-hero-stat-value">{categories.length}</span>
              <span className="product-hero-stat-label">Categories</span>
            </div>
            <div className="product-hero-stat">
              <span className="product-hero-stat-value">12+</span>
              <span className="product-hero-stat-label">Years supplying</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Body ── */}
      <section className="product-body">
        <div className="container">
          <div className="layout">

            {/* Sidebar */}
            <aside className="product-sidebar">
              <div className="filter-head">
                <h3>Filters</h3>
                {activeFilters > 0 && (
                  <button type="button" className="filter-reset" onClick={reset}>
                    Reset ({activeFilters})
                  </button>
                )}
              </div>

              <div className="filter-group">
                <p className="group-label">Search</p>
                <input
                  type="search"
                  className="filter-input"
                  placeholder="Search products…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="filter-group">
                <p className="group-label">Category</p>
                <div className="filter-checks">
                  {categories.length === 0 && (
                    <span className="filter-empty">No categories yet</span>
                  )}
                  {categories.map(([c, n]) => (
                    <label key={c}>
                      <input
                        type="radio"
                        name="category"
                        checked={category === c}
                        onChange={() => setCategory(category === c ? "" : c)}
                      />
                      <span>
                        {c} <em className="filter-count">({n})</em>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <p className="group-label">Max price</p>
                <input
                  type="number"
                  className="filter-input"
                  placeholder="e.g. 5000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </aside>

            {/* Main */}
            <div className="product-main">
              <div className="results-head">
                <p>
                  <span>{filtered.length}</span>{" "}
                  {filtered.length === 1 ? "product" : "products"} available
                </p>
                <div className="results-sort">
                  <label htmlFor="sort">Sort by</label>
                  <select
                    id="sort"
                    value={sort}
                    onChange={(e) => setSort(e.target.value as Sort)}
                  >
                    <option value="newest">Newest</option>
                    <option value="price-asc">Price: low → high</option>
                    <option value="price-desc">Price: high → low</option>
                    <option value="name">Name: A → Z</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="product-loading">
                  <span className="material-symbols-outlined">progress_activity</span>
                  <p>Loading products…</p>
                </div>
              ) : error ? (
                <div className="product-empty">
                  <span className="material-symbols-outlined">error</span>
                  <h3>Could not load products</h3>
                  <p>{error}</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="product-empty">
                  <span className="material-symbols-outlined">inventory_2</span>
                  <h3>No products match your filters</h3>
                  <p>Try adjusting the filters on the left, or reset them to see all products.</p>
                  {activeFilters > 0 && (
                    <button type="button" className="product-empty-cta" onClick={reset}>
                      Clear filters
                    </button>
                  )}
                </div>
              ) : (
                <div className="product-grid">
                  {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="product-cta">
        <div className="container">
          <div className="product-cta-text">
            <h2>
              Need a <span>bulk quote</span>?
            </h2>
            <p>Tell us the quantities — we&apos;ll send pricing and lead times.</p>
          </div>
          <Link href="/contact" className="product-cta-btn">
            Request a quote
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      </section>
    </>
  );
}