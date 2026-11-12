import Link from "next/link";
import { TeamSlider } from "@/components/marketing/TeamSlider";
import { MOCK_TEAM } from "@/data/static-mocks";
import { IMAGES } from "@/lib/assets";
import "@/styles/about.css";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="about-page">

      {/* HERO â€” Split editorial */}
      <section className="about-hero-new">
        <div className="about-hero-inner">
          <div className="about-hero-media">
            <div className="about-hero-ribbon" aria-hidden="true" />
            <div
              className="about-hero-image"
              style={{ backgroundImage: `url('${IMAGES.aboutWorking}')` }}
            >
              <span className="about-hero-image-badge">Since 2012</span>
            </div>
            <div className="about-hero-float">
              <span className="about-hero-float-value">12+</span>
              <span className="about-hero-float-label">Years in the field</span>
            </div>
          </div>

          <div className="about-hero-copy">
            <span className="about-hero-pill">
              <span className="about-hero-pill-dot" />
              Est. 2012
            </span>

            <h1 className="about-hero-title">
              Building the future,<br />
              <span>one project</span> at a time.
            </h1>

            <p className="about-hero-lead">
              Ted-Nomex is a Ghanaian construction and engineering firm delivering
              residential, commercial, and industrial work with uncompromising
              craftsmanship â€” from the first sketch to the final handover.
            </p>

            <p className="about-hero-sub">
              Over 12 years of experience, hundreds of delivered projects, and a
              team that treats every site like their own.
            </p>

            <div className="about-hero-actions">
              <Link href="/services" className="about-hero-cta">
                <span>Our services</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
              <Link href="/contact" className="about-hero-cta-ghost">
                Meet the team
              </Link>
            </div>

            <div className="about-hero-metrics">
              <div className="about-hero-metric">
                <span className="about-hero-metric-value">461</span>
                <span className="about-hero-metric-label">Projects delivered</span>
              </div>
              <div className="about-hero-metric">
                <span className="about-hero-metric-value">568</span>
                <span className="about-hero-metric-label">Happy clients</span>
              </div>
              <div className="about-hero-metric">
                <span className="about-hero-metric-value">55</span>
                <span className="about-hero-metric-label">Craftspeople</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="Text-container">
        <div className="container">
          <div className="text">
            <Link href="/">home</Link>
            <span>-</span>
            <Link href="/about">Pages</Link>
            <span>-</span>
            <p>About us</p>
          </div>
          <span className="material-symbols-outlined">ungroup</span>
        </div>
      </div>

      {/* Our Story */}
      <section className="about-story">
        <div className="about-story-inner">

          {/* Left — narrative */}
          <div className="about-story-copy">
            <span className="about-story-kicker">Our story</span>
            <h2 className="about-story-heading">
              Who we are<span className="about-story-dot">.</span>
            </h2>
            <div className="about-story-ribbon" />

            <p className="about-story-lead">
              Welcome to Ted-Nomex Construction Company, where excellence,
              innovation, and client satisfaction are at the heart of everything
              we do.
            </p>
            <p className="about-story-body">
              With over 12 years of experience, we have built a reputation for
              delivering high-quality and successful projects across various
              sectors — from residential builds to complex commercial and
              industrial works. Here's more about who we are and what we stand
              for.
            </p>

            <div className="about-story-actions">
              <Link href="/contact" className="about-story-cta">
                <span>Our story</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
              <Link href="/projects" className="about-story-cta-ghost">
                View projects
              </Link>
            </div>
          </div>

          {/* Right — image composition */}
          <div className="about-story-media">
            <div className="about-story-image-backdrop" aria-hidden="true" />
            <div
              className="about-story-image"
              style={{ backgroundImage: `url('${IMAGES.aboutHero}')` }}
            >
              <span className="about-story-image-badge">Tec-Nomex</span>
            </div>

            <div className="about-story-quote">
              <span className="about-story-quote-mark" aria-hidden="true">&ldquo;</span>
              <p>
                Our expertise spans across various sectors — residential,
                commercial, and industrial projects.
              </p>
              <div className="about-story-quote-author">
                <span className="about-story-quote-name">Nordin Somuah</span>
                <span className="about-story-quote-role">Tec-Nomex</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CTA Banner */}
      <section className="banner-container">
        <div className="text-description">
          <p>You need more information about our services and company capabilities?</p>
          <span></span>
        </div>
        <div className="btn-container">
          <span></span>
          <div className="btn"><Link href="/services">View All Services</Link></div>
        </div>
      </section>

      {/* Team â€” Slider */}
      <section className="our-team">
        <div className="container">
          <div className="text-container">
            <p>The Crew</p>
            <h2>Our Awesome Team</h2>
            <span></span>
          </div>
        </div>
        <TeamSlider team={MOCK_TEAM} />
      </section>

    </div>
  );
}