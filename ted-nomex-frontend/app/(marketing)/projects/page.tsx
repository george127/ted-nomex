"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import "@/styles/projects.css";

type Category = "all" | "renovate" | "building" | "architecture";
type Tab = "gallery" | "description" | "details" | "progress";

type Project = {
  id: number;
  title: string;
  location: string;
  category: Exclude<Category, "all">;
  year: string;
  size: string;
  client: string;
  description: string;
  images: string[];
};

const PROJECTS: Project[] = [
  {
    id: 1,
    title: "West Atlantic Residence",
    location: "Accra, Ghana",
    category: "building",
    year: "2024",
    size: "6,310 sq ft",
    client: "Private",
    description:
      "A six-bedroom contemporary residence featuring open-plan living, a wraparound terrace, and a landscaped courtyard. Delivered on time and within budget across a 14-month build.",
    images: [
      "/projects/building1.jpg",
      "/projects/building2.jpg",
      "/projects/building3.jpg",
    ],
  },
  {
    id: 2,
    title: "East Legon Renovation",
    location: "East Legon, Accra",
    category: "renovate",
    year: "2023",
    size: "3,200 sq ft",
    client: "Mr. Owusu",
    description:
      "Full structural and interior renovation of a 1990s villa. New kitchen, three bathrooms, open staircase, and full electrical rewiring — completed while the family lived on-site.",
    images: [
      "/projects/renovate1.jpg",
      "/projects/renovate2.jpg",
    ],
  },
  {
    id: 3,
    title: "Tema Commercial Complex",
    location: "Tema, Ghana",
    category: "architecture",
    year: "2024",
    size: "12,000 sq ft",
    client: "Tema Holdings Ltd",
    description:
      "Mixed-use commercial development with ground-floor retail and three floors of office space. Designed around passive cooling and daylight, reducing energy load by 30% versus comparable builds.",
    images: [
      "/projects/Architecture1.jpg",
      "/projects/Architecture2.jpg",
      "/projects/Architecture3.jpg",
    ],
  },
  {
    id: 4,
    title: "Airport Residential Duplex",
    location: "Airport Residential, Accra",
    category: "building",
    year: "2023",
    size: "4,100 sq ft",
    client: "Dr. Mensah",
    description:
      "A twin duplex on a tight urban plot. Split-level planning separates living from sleeping zones; the shared courtyard was engineered to double as event space.",
    images: [
      "/projects/building2.jpg",
      "/projects/building3.jpg",
    ],
  },
  {
    id: 5,
    title: "Kumasi Heritage Restoration",
    location: "Kumasi, Ghana",
    category: "renovate",
    year: "2022",
    size: "2,700 sq ft",
    client: "Ashanti Heritage Trust",
    description:
      "Careful restoration of a colonial-era bungalow. Original timber beams salvaged and re-milled on-site; concrete additions designed to read as clearly modern, not faux-historic.",
    images: [
      "/projects/renovate2.jpg",
      "/projects/renovate1.jpg",
    ],
  },
  {
    id: 6,
    title: "Takoradi Beachfront Villas",
    location: "Takoradi, Ghana",
    category: "architecture",
    year: "2024",
    size: "9,500 sq ft",
    client: "Coastal Estates",
    description:
      "Three linked villas on a sloping coastal plot. Elevated concrete bases address erosion risk; each villa has unobstructed sea views and a private plunge pool.",
    images: [
      "/projects/Architecture3.jpg",
      "/projects/Architecture4.jpg",
    ],
  },
  {
    id: 7,
    title: "Adenta Family Home",
    location: "Adenta, Accra",
    category: "building",
    year: "2022",
    size: "3,400 sq ft",
    client: "The Adjei family",
    description:
      "A four-bedroom family home designed around a central courtyard. Cross-ventilation throughout; rainwater harvesting and solar pre-wire included from day one.",
    images: [
      "/projects/building3.jpg",
      "/projects/building1.jpg",
    ],
  },
  {
    id: 8,
    title: "Osu Boutique Offices",
    location: "Osu, Accra",
    category: "renovate",
    year: "2023",
    size: "5,200 sq ft",
    client: "Osu Works",
    description:
      "Conversion of a mid-century warehouse into boutique office space. Original brick retained where possible; new glazed partitions and acoustic ceilings keep the shell's character.",
    images: [
      "/projects/renovate1.jpg",
      "/projects/renovate2.jpg",
      "/projects/building2.jpg",
    ],
  },
  {
    id: 9,
    title: "Cantonments Tower",
    location: "Cantonments, Accra",
    category: "architecture",
    year: "2024",
    size: "18,000 sq ft",
    client: "Cantonments Development Co",
    description:
      "Twelve-storey mixed-use tower with ground-level retail, four floors of offices, and residential apartments above. Post-tensioned slabs keep floor-to-floor heights low.",
    images: [
      "/projects/Architecture2.jpg",
      "/projects/Architecture4.jpg",
      "/projects/Architecture1.jpg",
    ],
  },
];

const CATEGORIES: { label: string; value: Category }[] = [
  { label: "All", value: "all" },
  { label: "Renovation", value: "renovate" },
  { label: "Building", value: "building" },
  { label: "Architecture", value: "architecture" },
];

const TABS: { label: string; value: Tab; icon: string }[] = [
  { label: "Gallery", value: "gallery", icon: "photo_library" },
  { label: "Description", value: "description", icon: "description" },
  { label: "Details", value: "details", icon: "list_alt" },
  { label: "Progress & Location", value: "progress", icon: "insights" },
];

export default function ProjectsPage() {
  const [category, setCategory] = useState<Category>("all");
  const [tab, setTab] = useState<Tab>("gallery");
  const [showLocation, setShowLocation] = useState(false);
  const [modalProjectId, setModalProjectId] = useState<number | null>(null);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const modalProject = useMemo(
    () => PROJECTS.find((p) => p.id === modalProjectId) ?? null,
    [modalProjectId]
  );

  const filtered = useMemo(
    () =>
      category === "all"
        ? PROJECTS
        : PROJECTS.filter((p) => p.category === category),
    [category]
  );

  const openModal = (id: number, imageIndex = 0) => {
    setModalProjectId(id);
    setModalImageIndex(imageIndex);
  };
  const closeModal = () => setModalProjectId(null);

  const nextImage = () => {
    if (!modalProject) return;
    setModalImageIndex((i) => (i + 1) % modalProject.images.length);
  };
  const prevImage = () => {
    if (!modalProject) return;
    setModalImageIndex(
      (i) => (i - 1 + modalProject.images.length) % modalProject.images.length
    );
  };

  useEffect(() => {
    if (modalProjectId === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalProjectId, modalProject]);

  const groupedCounts = useMemo(() => {
    return {
      all: PROJECTS.length,
      renovate: PROJECTS.filter((p) => p.category === "renovate").length,
      building: PROJECTS.filter((p) => p.category === "building").length,
      architecture: PROJECTS.filter((p) => p.category === "architecture").length,
    } as Record<Category, number>;
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="projects-hero">
        <div
          className="projects-hero-bg"
          style={{ backgroundImage: "url('/projects/Projects-banner.jpg')" }}
        />
        <div className="projects-hero-overlay" />
        <div className="projects-hero-content">
          <nav className="hero-chip" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="dot">·</span>
            <Link href="/projects">Portfolio</Link>
            <span className="dot">·</span>
            <span className="current">Gallery</span>
          </nav>
          <p className="hero-eyebrow">Our portfolio</p>
          <h1 className="hero-title">
            Work we&apos;re <span>proud</span> to sign.
          </h1>
          <p className="hero-lead">
            Residential, commercial, and industrial projects across Ghana.
            Every build is a case study in craft, planning, and follow-through.
          </p>

          <div className="projects-hero-stats">
            <div className="stat">
              <span className="stat-value">{PROJECTS.length}</span>
              <span className="stat-label">Featured projects</span>
            </div>
            <div className="stat">
              <span className="stat-value">{groupedCounts.architecture}</span>
              <span className="stat-label">Architectural builds</span>
            </div>
            <div className="stat">
              <span className="stat-value">{groupedCounts.renovate}</span>
              <span className="stat-label">Renovations</span>
            </div>
          </div>
        </div>
      </section>

      {/* BODY */}
      <section className="projects-body">
        <div className="container">
          <div className="projects-layout">
            {/* SIDEBAR */}
            <aside className="projects-sidebar">
              <div className="sidebar-block">
                <h2 className="sidebar-title">Sections</h2>
                <nav className="sidebar-tabs">
                  {TABS.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      className={`sidebar-tab ${tab === t.value ? "active" : ""}`}
                      onClick={() => setTab(t.value)}
                    >
                      <span className="material-symbols-outlined">{t.icon}</span>
                      <span>{t.label}</span>
                      <span className="material-symbols-outlined arrow">
                        chevron_right
                      </span>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="sidebar-block">
                <h2 className="sidebar-title">Brochures</h2>
                <div className="sidebar-brochures">
                  <a
                    href="/brochures/ted-nomex-portfolio.pdf"
                    className="brochure-btn"
                    download
                  >
                    <span className="material-symbols-outlined">download</span>
                    <span className="label">
                      Portfolio
                      <small>PDF · 4.2 MB</small>
                    </span>
                  </a>
                  <a
                    href="/brochures/ted-nomex-brochure.pdf"
                    className="brochure-btn"
                    download
                  >
                    <span className="material-symbols-outlined">description</span>
                    <span className="label">
                      Company brochure
                      <small>PDF · 1.8 MB</small>
                    </span>
                  </a>
                </div>
              </div>

              <div className="sidebar-block sidebar-contact">
                <p className="sidebar-kicker">Want something like this?</p>
                <h3>Talk to our project team.</h3>
                <Link href="/contact" className="sidebar-cta">
                  Contact us
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
              </div>
            </aside>

            {/* MAIN CONTENT */}
            <div className="projects-main">
              {/* GALLERY TAB */}
              {tab === "gallery" && (
                <div className="panel">
                  <div className="panel-head">
                    <div>
                      <p className="panel-kicker">Selected work</p>
                      <h2>Project gallery</h2>
                    </div>
                    <div className="filter-pills">
                      {CATEGORIES.map((c) => (
                        <button
                          key={c.value}
                          type="button"
                          className={category === c.value ? "active" : ""}
                          onClick={() => setCategory(c.value)}
                        >
                          {c.label}
                          <span>{groupedCounts[c.value]}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {filtered.length === 0 ? (
                    <div className="empty">
                      <span className="material-symbols-outlined">
                        folder_off
                      </span>
                      <h3>No projects in this category</h3>
                      <p>Try a different filter, or view all work.</p>
                    </div>
                  ) : (
                    <div className="gallery">
                      {filtered.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          className={`gallery-tile cat-${p.category}`}
                          onClick={() => openModal(p.id)}
                          aria-label={`Open ${p.title}`}
                        >
                          <div
                            className="tile-image"
                            style={{ backgroundImage: `url('${p.images[0]}')` }}
                          />
                          <span className="tile-cat">{p.category}</span>
                          <div className="tile-body">
                            <h3>{p.title}</h3>
                            <p>{p.location}</p>
                          </div>
                          <span className="tile-action">
                            <span className="material-symbols-outlined">
                              fullscreen
                            </span>
                            View
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* DESCRIPTION TAB */}
              {tab === "description" && (
                <div className="panel">
                  <div className="panel-head">
                    <div>
                      <p className="panel-kicker">About our portfolio</p>
                      <h2>What we build</h2>
                    </div>
                  </div>
                  <div className="prose">
                    <p>
                      Ted-Nomex Construction Company delivers residential,
                      commercial, and industrial projects across Ghana. Every
                      project is planned, engineered, and executed in-house —
                      from site survey to final handover.
                    </p>
                    <p>
                      We work in two modes: <strong>new build</strong> (where we
                      take a plot from survey through structural completion) and{" "}
                      <strong>renovation</strong> (where we restore or
                      reconfigure existing structures while preserving as much
                      of the original fabric as possible).
                    </p>
                  </div>
                  <div className="phases">
                    {[
                      { label: "Site preparation", n: "01" },
                      { label: "Foundation construction", n: "02" },
                      { label: "Structural framing", n: "03" },
                      { label: "Exterior finishes", n: "04" },
                      { label: "Interior finishes", n: "05" },
                      { label: "Utilities installation", n: "06" },
                      { label: "Landscaping", n: "07" },
                      { label: "Final inspection", n: "08" },
                    ].map((p) => (
                      <div key={p.n} className="phase">
                        <span className="phase-num">{p.n}</span>
                        <span className="phase-label">{p.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* DETAILS TAB */}
              {tab === "details" && (
                <div className="panel">
                  <div className="panel-head">
                    <div>
                      <p className="panel-kicker">Reference project</p>
                      <h2>Cantonments Tower</h2>
                    </div>
                  </div>
                  <dl className="details-table">
                    {[
                      ["Project type", "Mixed-use tower"],
                      ["Client", "Cantonments Development Co"],
                      ["Completion", "December 2024"],
                      ["Size", "18,000 sq ft"],
                      ["Floors", "12"],
                      ["Location", "Cantonments, Accra"],
                    ].map(([l, v]) => (
                      <div key={l} className="details-row">
                        <dt>{l}</dt>
                        <dd>{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {/* PROGRESS TAB */}
              {tab === "progress" && (
                <div className="panel">
                  <div className="panel-head">
                    <div>
                      <p className="panel-kicker">Live status</p>
                      <h2>Progress &amp; location</h2>
                    </div>
                    <div className="progress-toggle">
                      <button
                        type="button"
                        className={!showLocation ? "active" : ""}
                        onClick={() => setShowLocation(false)}
                      >
                        <span className="material-symbols-outlined">
                          checklist
                        </span>
                        Scope of work
                      </button>
                      <button
                        type="button"
                        className={showLocation ? "active" : ""}
                        onClick={() => setShowLocation(true)}
                      >
                        <span className="material-symbols-outlined">pin_drop</span>
                        Project location
                      </button>
                    </div>
                  </div>

                  {!showLocation ? (
                    <div className="progress-view">
                      <div className="progress-bars">
                        {[
                          { label: "Home remodelling", value: 55 },
                          { label: "House renovation", value: 95 },
                          { label: "Indoor painting", value: 37 },
                        ].map((s) => (
                          <div key={s.label} className="progress-row">
                            <div className="progress-meta">
                              <span>{s.label}</span>
                              <span>{s.value}%</span>
                            </div>
                            <div className="progress-track">
                              <span style={{ width: `${s.value}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="progress-ring">
                        <div className="ring-track">
                          <div className="ring-hole" />
                          <span className="ring-value">93%</span>
                        </div>
                        <span className="ring-label">Overall progress</span>
                      </div>
                    </div>
                  ) : (
                    <div className="map-view">
                      <iframe
                        title="Project location"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.9380921681686!2d-0.29515118603715057!3d5.576171195957227!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf990707c35f19%3A0xae1f391c20c3ca58!2sWest%20Atlantic%20College%20of%20Technology!5e0!3m2!1sen!2sgh!4v1679211039662!5m2!1sen!2sgh"
                        width="100%"
                        height="440"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* MODAL */}
      {modalProject && (
        <div
          className="projects-modal-backdrop"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-label={modalProject.title}
        >
          <div
            className="projects-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close"
              onClick={closeModal}
              aria-label="Close"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="modal-image">
              <div
                className="modal-image-bg"
                style={{
                  backgroundImage: `url('${modalProject.images[modalImageIndex]}')`,
                }}
              />
              {modalProject.images.length > 1 && (
                <>
                  <button
                    type="button"
                    className="modal-arrow prev"
                    onClick={prevImage}
                    aria-label="Previous image"
                  >
                    <span className="material-symbols-outlined">
                      chevron_left
                    </span>
                  </button>
                  <button
                    type="button"
                    className="modal-arrow next"
                    onClick={nextImage}
                    aria-label="Next image"
                  >
                    <span className="material-symbols-outlined">
                      chevron_right
                    </span>
                  </button>
                  <div className="modal-counter">
                    {modalImageIndex + 1} / {modalProject.images.length}
                  </div>
                </>
              )}
            </div>

            <div className="modal-body">
              <span className={`modal-cat cat-${modalProject.category}`}>
                {modalProject.category}
              </span>
              <h2 className="modal-title">{modalProject.title}</h2>
              <p className="modal-location">
                <span className="material-symbols-outlined">location_on</span>
                {modalProject.location}
              </p>

              <div className="modal-meta">
                <div>
                  <span className="meta-label">Year</span>
                  <span className="meta-value">{modalProject.year}</span>
                </div>
                <div>
                  <span className="meta-label">Size</span>
                  <span className="meta-value">{modalProject.size}</span>
                </div>
                <div>
                  <span className="meta-label">Client</span>
                  <span className="meta-value">{modalProject.client}</span>
                </div>
              </div>

              <p className="modal-desc">{modalProject.description}</p>

              {modalProject.images.length > 1 && (
                <div className="modal-strip">
                  {modalProject.images.map((img, i) => (
                    <button
                      key={img}
                      type="button"
                      className={`strip-thumb ${i === modalImageIndex ? "active" : ""}`}
                      onClick={() => setModalImageIndex(i)}
                      style={{ backgroundImage: `url('${img}')` }}
                      aria-label={`View image ${i + 1}`}
                    />
                  ))}
                </div>
              )}

              <Link
                href="/contact"
                className="modal-cta"
                onClick={closeModal}
              >
                Start a similar project
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}