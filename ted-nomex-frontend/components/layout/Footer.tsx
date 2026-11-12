"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ScrollToTop } from "./ScrollToTop";
import "@/styles/footer.css";
import { listServices } from "@/modules/cms/services/service";

// service links come from the backend (replaces old SERVICE_LINKS_LEFT)

// service links come from the backend (replaces old SERVICE_LINKS_RIGHT)

const SOCIAL_LINKS = [
  { label: "Facebook", icon: "fa-facebook-f", href: "#" },
  { label: "Twitter", icon: "fa-twitter", href: "#" },
  { label: "Instagram", icon: "fa-instagram", href: "#" },
  { label: "YouTube", icon: "fa-youtube", href: "#" },
];

export function Footer() {
   const [year, setYear] = useState(0);

  // Services loaded from the backend so footer links always match published services
  const [services, setServices] = useState<{ slug: string; title: string }[]>([]);
  useEffect(() => {
    let cancelled = false;
    listServices()
      .then((all) => {
        if (cancelled) return;
        setServices(all.map((s) => ({ slug: s.slug, title: s.title })));
      })
      .catch(() => {
        if (!cancelled) setServices([]);
      });
    return () => { cancelled = true; };
  }, []);

  const half = Math.ceil(services.length / 2);
  const SERVICE_LINKS_LEFT  = services.slice(0, half).map((s) => ({ label: s.title, href: `/services/${s.slug}` }));
  const SERVICE_LINKS_RIGHT = services.slice(half).map((s) => ({ label: s.title, href: `/services/${s.slug}` }));

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <>
      <footer className="footer-container">
        <Image
          src="/About-black.png"
          alt=""
          aria-hidden="true"
          width={500}
          height={300}
          className="footer-bg"
          priority={false}
        />

        <div className="container">
          <div className="footer-links">
            <div className="link">
              <div className="color" />
              <div className="text">
                Established in 2013, Ted-Nomex was founded with a vision to
                redefine construction standards through exceptional
                craftsmanship and innovative practices. With steady growth over
                the years, we have expanded our operations, taking on
                increasingly complex and large-scale projects across various
                sectors.
              </div>
              <Link href="/about" className="btn">
                <p>read more</p>
                <span className="material-symbols-outlined">trending_flat</span>
              </Link>
            </div>

            <div className="link">
              <div className="color" />
              <div className="contact">
                <div className="item">
                  <span className="material-symbols-outlined">phone_enabled</span>
                  <p>Phone :<a href="tel:0595808051">0595808051</a></p>
                </div>
                <div className="item">
                  <span className="material-symbols-outlined">mail</span>
                  <p>Email :<a href="mailto:info@ted-nomex.com">info@ted-nomex.com</a></p>
                </div>
                <div className="item">
                  <span className="material-symbols-outlined">location_on</span>
                  <p>Address :<a href="https://maps.google.com/?q=GJ-275-7823" target="_blank" rel="noopener noreferrer">GJ-275-7823</a></p>
                </div>
              </div>

              <div className="days-container">
                <div className="days">
                  <p>monday - friday:</p>
                  <span>8am - 6pm</span>
                </div>
                <div className="days">
                  <p>saturday:</p>
                  <span>9am - 3pm</span>
                </div>
              </div>
            </div>

            <div className="link">
              <div className="color" />
              {SERVICE_LINKS_LEFT.length > 0 && ( <div className="site-links">
                <ul>
                  {SERVICE_LINKS_LEFT.map((s) => (
                    <li key={s.label}><Link href={s.href}>{s.label}</Link></li>
                  ))}
                </ul>
                <ul>
                  {SERVICE_LINKS_RIGHT.map((s) => (
                    <li key={s.label}><Link href={s.href}>{s.label}</Link></li>
                  ))}
                </ul>
              </div> )}
            </div>
          </div>

          <div className="footer-links2">
            <div className="social-media">
              <p>Follow us:</p>
              <div className="media-icons">
                {SOCIAL_LINKS.map((s) => (
                  <a key={s.label} href={s.href} aria-label={s.label}><i className={`fab ${s.icon}`} /></a>
                ))}
              </div>
            </div>

            <div className="buttons-container">
              <button type="button" className="btn" disabled title="Coming soon">
                <span className="material-symbols-outlined icon">shopping_cart_checkout</span>
                <p>Download Pricing PDF</p>
                <span className="material-symbols-outlined">expand_more</span>
              </button>
              <button type="button" className="btn" disabled title="Coming soon">
                <span className="material-symbols-outlined icon">description</span>
                <p>Company presentation PDF</p>
                <span className="material-symbols-outlined">expand_more</span>
              </button>
            </div>
          </div>
        </div>
      </footer>

      <div className="copyright">
        <div className="container">
          <div className="text-items">
            Â© <span>TED-NOMEX</span> {year}. ALL RIGHTS RESERVED.
          </div>
          <div className="links-items">
            <Link href="/terms">Terms of use</Link>
            <Link href="/privacy">Privacy policy</Link>
            <Link href="/news">News</Link>
            <ScrollToTop />
          </div>
        </div>
      </div>
    </>
  );
}