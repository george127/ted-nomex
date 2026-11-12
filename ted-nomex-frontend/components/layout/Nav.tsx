"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { getCart, getCartCount, subscribeToCart, type CartItem } from "@/modules/cart/service";
import "@/styles/nav.css";

const NAV_LINKS = [
  { href: "/", label: "home" },
  { href: "/about", label: "about" },
  { href: "/services", label: "services" },
  { href: "/estate", label: "estate" },
  { href: "/news", label: "news" },
  { href: "/projects", label: "project" },
  { href: "/contact", label: "contact" },
];

// Public searchable pages ONLY (no dashboard, no admin).
const SEARCH_INDEX: { href: string; label: string; icon: string; keywords: string }[] = [
  { href: "/", label: "Home", icon: "home", keywords: "home landing main start" },
  { href: "/about", label: "About", icon: "info", keywords: "about story team who we are mission values" },
  { href: "/services", label: "Services", icon: "handyman", keywords: "services what we do construction renovation engineering" },
  { href: "/estate", label: "Estate", icon: "home_work", keywords: "estate properties real estate houses land rent sale apartment" },
  { href: "/news", label: "News", icon: "newspaper", keywords: "news articles blog updates press releases" },
  { href: "/projects", label: "Projects", icon: "apartment", keywords: "projects portfolio completed work case studies" },
  { href: "/product", label: "Products", icon: "inventory_2", keywords: "products shop store buy materials tools supplies" },
  { href: "/cart", label: "Cart", icon: "shopping_cart", keywords: "cart basket items shopping" },
  { href: "/checkout", label: "Checkout", icon: "payment", keywords: "checkout payment pay order complete stripe" },
  { href: "/cost", label: "Cost Calculator", icon: "calculate", keywords: "calculator cost estimate quote price budget" },
  { href: "/contact", label: "Contact", icon: "mail", keywords: "contact message email call phone get in touch" },
  { href: "/login", label: "Sign in", icon: "person", keywords: "login sign in account access" },
  { href: "/register", label: "Create account", icon: "person_add", keywords: "register sign up create account new user" },
  { href: "/forgot-password", label: "Forgot password", icon: "lock_reset", keywords: "forgot reset password recovery" },
];

function searchPages(query: string): typeof SEARCH_INDEX {
  const q = query.toLowerCase().trim();
  if (!q) return SEARCH_INDEX;
  return SEARCH_INDEX.filter((entry) => {
    const hay = `${entry.label} ${entry.keywords} ${entry.href}`.toLowerCase();
    return hay.includes(q);
  });
}
export function Nav() {
  const router = useRouter();
  const [shareUrl, setShareUrl] = useState("");
  useEffect(() => { setShareUrl(window.location.href); }, []);
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<"mobile" | "cart" | "share" | "search" | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartSubtotal, setCartSubtotal] = useState(0);
  const [badgePop, setBadgePop] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const searchResults = useMemo(() => searchPages(searchTerm), [searchTerm]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!openMenu) return;
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpenMenu(null); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [openMenu]);

  useEffect(() => {
    const refreshCart = () => {
      const items = getCart();
      setCartItems(items);
      setCartCount(getCartCount());
      setCartSubtotal(items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0));
    };
    refreshCart();
    const onVis = () => { if (!document.hidden) refreshCart(); };
    document.addEventListener("visibilitychange", onVis);
    const unsubscribe = subscribeToCart(refreshCart);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (cartCount === 0) return;
    setBadgePop(true);
    const t = setTimeout(() => setBadgePop(false), 320);
    return () => clearTimeout(t);
  }, [cartCount]);

  useEffect(() => {
    setActiveIndex(0);
  }, [searchTerm]);

  useEffect(() => {
    if (openMenu === "search") {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [openMenu]);

  const toggle = (k: NonNullable<typeof openMenu>) => setOpenMenu((p) => (p === k ? null : k));
  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(shareUrl); setOpenMenu(null); } catch {}
  };

  const goToResult = (href: string) => {
    setOpenMenu(null);
    setSearchTerm("");
    router.push(href);
  };

  const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, searchResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = searchResults[activeIndex];
      if (target) goToResult(target.href);
    }
  };

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`,
  };

  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}`}>
      <div className="container">
        <div className="logo-container"><Link href="/">Ted-Nomex</Link></div>
        <div className="links-container" ref={menuRef}>
          <ul className="items-container">
            {NAV_LINKS.map((link) => (
              <li key={link.href} className="items">
                <Link href={link.href} className={isActive(link.href) ? "active" : undefined}>
                  <p>{link.label}</p>
                </Link>
              </li>
            ))}
          </ul>

          <div className="icons-container">
            <div className="icon" id="DropDow" onClick={() => toggle("mobile")} role="button" tabIndex={0} aria-label="Open menu">
              <div className="item"><span className="material-symbols-outlined">{openMenu === "mobile" ? "close" : "menu"}</span></div>
            </div>

            <div className="icon" onClick={() => toggle("cart")} role="button" tabIndex={0} aria-label="Cart">
              <div className="item">
                <span className="material-symbols-outlined">local_mall</span>
                <div className={`value${badgePop ? " pop" : ""}`}>{cartCount}</div>
              </div>
            </div>

            <div className="icon" onClick={() => toggle("share")} role="button" tabIndex={0} aria-label="Share">
              <div className="item"><span className="material-symbols-outlined">share</span></div>
            </div>

            <div className="icon" onClick={() => toggle("search")} role="button" tabIndex={0} aria-label="Search">
              <div className="item"><span className="material-symbols-outlined">search</span></div>
            </div>

            <div className={`dropdown-panel mobile-menu-panel${openMenu === "mobile" ? " is-open" : ""}`}>
              {NAV_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className={isActive(l.href) ? "active" : undefined} onClick={() => setOpenMenu(null)}>{l.label}</Link>
              ))}
            </div>

            <div className={`dropdown-panel cart-panel${openMenu === "cart" ? " is-open" : ""}`}>
              <div className="head"><p>Your Cart</p><p><span>{cartCount}</span> items</p></div>
              {cartCount === 0 ? <p className="empty">Your cart is empty</p> : null}
              <div className="total">
                <p>Subtotal:</p>
                <p>{cartItems.length === 0 ? "$0" : `${cartItems[0]?.currency ?? "GHS"} ${cartSubtotal.toLocaleString()}`}</p>
              </div>
              <div className="link-items">
                <Link href="/cart" className="btn" onClick={() => setOpenMenu(null)}>view cart</Link>
                <Link href="/checkout" className="btn" onClick={() => setOpenMenu(null)}>checkout</Link>
              </div>
            </div>

            <div className={`dropdown-panel share-panel${openMenu === "share" ? " is-open" : ""}`}>
              <a href={shareUrls.facebook} target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook" /> Facebook</a>
              <a href={shareUrls.twitter} target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter" /> Twitter</a>
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram" /> Instagram</a>
              <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer"><i className="fab fa-youtube" /> YouTube</a>
              <button type="button" onClick={copyLink} style={{ gridColumn: "1 / -1" }}><span className="material-symbols-outlined">link</span> Copy link</button>
            </div>

            <div className={`dropdown-panel search-panel${openMenu === "search" ? " is-open" : ""}`}>
              <div className="search-container">
                <input
                  ref={searchInputRef}
                  type="text"
                  className="searchInput"
                  placeholder="Search pages… (try 'services' or 'contact')"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={onSearchKeyDown}
                  aria-label="Search pages"
                  autoComplete="off"
                />
                <button
                  className="search-button"
                  type="button"
                  onClick={() => {
                    const target = searchResults[activeIndex];
                    if (target) goToResult(target.href);
                  }}
                  aria-label="Go to first result"
                >
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>

              <ul className="results" role="listbox">
                {searchResults.length === 0 ? (
                  <li className="no-results">
                    <span className="material-symbols-outlined">search_off</span>
                    No pages match “{searchTerm}”
                  </li>
                ) : (
                  searchResults.map((r, i) => (
                    <li
                      key={r.href}
                      role="option"
                      aria-selected={i === activeIndex}
                      className={i === activeIndex ? "active" : undefined}
                      onMouseEnter={() => setActiveIndex(i)}
                      onClick={() => goToResult(r.href)}
                    >
                      <span className="material-symbols-outlined">{r.icon}</span>
                      <div className="result-text">
                        <p className="result-label">{r.label}</p>
                        <p className="result-path">{r.href}</p>
                      </div>
                      <span className="material-symbols-outlined result-arrow">arrow_forward</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>

          <Link href="/cost" className="calculator-container">
            <p>Cost Calculator</p>
            <span className="material-symbols-outlined">function</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}