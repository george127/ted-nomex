"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { IMAGES } from "@/lib/assets";

const SLIDES = [
  {
    image: IMAGES.homeSlides[0],
    kicker: "guaranteed high quality",
    title: "Welcome to the Ted-Nomex",
    highlight: "construction services",
    extra: "company",
    description: "Welcome to Ted-Nomex, your trusted partner in construction services. We are committed to delivering high-quality results for your projects.",
    cta: { label: "View our service", href: "/services" },
    stat: { value: "12+", label: "Years of Craft" },
  },
  {
    image: IMAGES.homeSlides[1],
    kicker: "Architecture Project",
    title: "Our New Project",
    highlight: "World trade center",
    extra: "",
    description: "Discover our latest architectural masterpiece, the World Trade Center. We blend innovation and elegance to create iconic structures.",
    cta: { label: "View project details", href: "/projects" },
    stat: { value: "461", label: "Projects Delivered" },
  },
  {
    image: IMAGES.homeSlides[2],
    kicker: "guaranteed high quality",
    title: "I need an equipment on rent?",
    highlight: "Start today?",
    extra: "",
    description: "Embark on your construction journey with ease. Rent top-quality equipment from us and get your project started today.",
    cta: { label: "View our Shop", href: "/product" },
    stat: { value: "55+", label: "Machines Ready" },
  },
];

export function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 9000);
    return () => clearInterval(id);
  }, []);

  const prev = () => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setIndex((i) => (i + 1) % SLIDES.length);
  const active = SLIDES[index];

  return (
    <section className="hero-home" id="home">
      {/* Layered backgrounds */}
      <div className="hero-bg-stack">
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className={`hero-bg${i === index ? " active" : ""}`}
            style={{ backgroundImage: `url('${slide.image}')` }}
          />
        ))}
        <div className="hero-bg-overlay" />
        <div className="hero-grain" />
      </div>

      {/* Decorative floating shapes */}
      <div className="hero-shape hero-shape-1" />
      <div className="hero-shape hero-shape-2" />
      <div className="hero-shape hero-shape-3" />

      {/* Main content */}
      <div className="hero-content container">
        <div className="hero-grid">
          {/* Left column: text */}
          <div className="hero-text" key={index}>
            <div className="hero-kicker">
              <span className="hero-kicker-dot" />
              <span>{active.kicker}</span>
            </div>

            <h1 className="hero-headline">
              <span className="hero-line">{active.title}</span>
              <span className="hero-line hero-line-accent">{active.highlight}</span>
              {active.extra && <span className="hero-line">{active.extra}</span>}
            </h1>

            <p className="hero-lead">{active.description}</p>

            <div className="hero-cta-row">
              <Link href={active.cta.href} className="hero-cta-primary">
                <span>{active.cta.label}</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
              <Link href="/contact" className="hero-cta-ghost">
                Get in touch
              </Link>
            </div>
          </div>

          {/* Right column: stat + progress */}
          <div className="hero-side">
            <div className="hero-stat" key={`stat-${index}`}>
              <div className="hero-stat-value">{active.stat.value}</div>
              <div className="hero-stat-label">{active.stat.label}</div>
            </div>

            <div className="hero-progress">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  className={`hero-progress-item${i === index ? " active" : ""}`}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                >
                  <span className="hero-progress-bar" />
                  <span className="hero-progress-num">0{i + 1}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar: controls + scroll hint */}
      <div className="hero-bottom container">
        <div className="hero-controls">
          <button type="button" onClick={prev} aria-label="Previous slide" className="hero-arrow">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="hero-counter">
            <span className="hero-counter-current">0{index + 1}</span>
            <span className="hero-counter-divider">/</span>
            <span className="hero-counter-total">0{SLIDES.length}</span>
          </div>
          <button type="button" onClick={next} aria-label="Next slide" className="hero-arrow">
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>

        <a href="#services" className="hero-scroll">
          <span className="hero-scroll-line" />
          <span>Scroll to explore</span>
        </a>
      </div>
    </section>
  );
}