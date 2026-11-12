import Link from "next/link";
import { IMAGES } from "@/lib/assets";

export function AboutSection() {
  return (
    <section className="about-editorial">
      {/* LEFT: Story */}
      <div className="ae-story">
        <span className="ae-pill">est. 2012</span>
        <p className="ae-kicker">our story</p>
        <h2 className="ae-heading">
          Who we are<span className="ae-dot">.</span>
        </h2>
        <div className="ae-ribbon" />

        <p className="ae-body">
          Welcome to Ted-Nomex Construction Company! With over 12 years of
          industry experience, we have established ourselves as a leading
          construction firm dedicated to delivering exceptional building
          solutions.
        </p>
        <p className="ae-body">
          Our journey began with a vision to transform the construction
          landscape through innovative practices, superior craftsmanship, and
          unwavering commitment to quality.
        </p>

        <div className="ae-metrics">
          <div className="ae-metric">
            <span className="ae-metric-value">12+</span>
            <span className="ae-metric-label">Years of craft</span>
          </div>
          <div className="ae-metric">
            <span className="ae-metric-value">461</span>
            <span className="ae-metric-label">Projects delivered</span>
          </div>
          <div className="ae-metric">
            <span className="ae-metric-value">55</span>
            <span className="ae-metric-label">Craftspeople</span>
          </div>
        </div>

        <div className="ae-cta-row">
          <Link href="/about" className="ae-cta">
            <span>Read more about us</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
          <Link href="/contact" className="ae-cta-ghost">
            Get in touch
          </Link>
        </div>
      </div>

      {/* RIGHT: Image composition */}
      <div className="ae-image-stack">
        <div className="ae-image-backdrop" />
        <div
          className="ae-image-main"
          style={{ backgroundImage: `url('${IMAGES.aboutHero}')` }}
        >
          <div className="ae-image-tint" />
          <div className="ae-brand-banner">Tec-Nomex</div>
        </div>

        <div className="ae-stat-card">
          <span className="ae-stat-value">55</span>
          <div className="ae-stat-body">
            <span className="ae-stat-label">Lifting Cranes</span>
            <span className="ae-stat-meta">Equipment ready</span>
          </div>
          <span className="ae-stat-icon material-symbols-outlined">precision_manufacturing</span>
        </div>

        <div className="ae-quote-card">
          <span className="ae-quote-mark">&ldquo;</span>
          <p>
            Built to last — every structure tells the story of the hands that
            made it.
          </p>
          <span className="ae-quote-author">— Nordin Somuah, Founder</span>
        </div>
      </div>
    </section>
  );
}