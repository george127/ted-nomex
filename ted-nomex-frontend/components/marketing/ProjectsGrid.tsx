"use client";

import Link from "next/link";
import { useState } from "react";
import { IMAGES } from "@/lib/assets";

const PROJECTS = [
  {
    id: "p1",
    num: "01.",
    title: "Trinity River Renovate",
    excerpt:
      "A full-scale renovation of a riverfront home, restoring the original timber frames and opening the living areas toward the water.",
    category: "Renovation",
    year: "2023",
    location: "Greater Accra",
    status: "Completed",
    image: IMAGES.projects[0],
    slug: "trinity-river-renovate",
  },
  {
    id: "p2",
    num: "02.",
    title: "White Walls House",
    excerpt:
      "A minimalist residential build with a strong emphasis on natural light, clean lines, and quiet, warm interiors.",
    category: "New Build",
    year: "2023",
    location: "Eastern Region",
    status: "Completed",
    image: IMAGES.projects[1],
    slug: "white-walls-house",
  },
  {
    id: "p3",
    num: "03.",
    title: "Project Endoran",
    excerpt:
      "An industrial construction project focused on modular steel framing and efficient site logistics.",
    category: "Industrial",
    year: "2024",
    location: "Central Region",
    status: "In progress",
    image: IMAGES.projects[2],
    slug: "project-endoran",
  },
  {
    id: "p4",
    num: "04.",
    title: "World Trade Center",
    excerpt:
      "A modern commercial landmark built around a public plaza, with a glass façade and flexible office floorplates.",
    category: "Commercial",
    year: "2024",
    location: "Greater Accra",
    status: "In progress",
    image: IMAGES.projects[3],
    slug: "world-trade-center",
  },
];

export function ProjectsGrid() {
  const [activeId, setActiveId] = useState(PROJECTS[0].id);
  const [modalOpen, setModalOpen] = useState(false);

  const active = PROJECTS.find((p) => p.id === activeId) ?? PROJECTS[0];

  const openModal = (id: string) => {
    setActiveId(id);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  return (
    <>
      <div className="projects-editorial">
        {/* Featured project — swaps on hover */}
        <div className="pe-feature">
          {PROJECTS.map((p) => (
            <div
              key={p.id}
              className={`pe-feature-bg${p.id === activeId ? " is-active" : ""}`}
              style={{ backgroundImage: `url('${p.image}')` }}
              aria-hidden="true"
            />
          ))}
          <div className="pe-feature-overlay" />
          <div className="pe-feature-content">
            <span className="pe-feature-num">{active.num}</span>
            <h3 className="pe-feature-title">{active.title}</h3>
            <p className="pe-feature-excerpt">{active.excerpt}</p>
            <button
              type="button"
              className="pe-feature-cta"
              onClick={() => openModal(active.id)}
            >
              <span>Explore this project</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Index list — hover to preview */}
        <div className="pe-list">
          <p className="pe-list-heading">All projects</p>
          {PROJECTS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`pe-row${p.id === activeId ? " is-active" : ""}`}
              onMouseEnter={() => setActiveId(p.id)}
              onFocus={() => setActiveId(p.id)}
              onClick={() => openModal(p.id)}
            >
              <span className="pe-row-num">{p.num}</span>
              <div className="pe-row-body">
                <span className="pe-row-title">{p.title}</span>
                <span className="pe-row-meta">{p.excerpt.slice(0, 56)}…</span>
              </div>
              <span className="pe-row-arrow material-symbols-outlined">
                arrow_outward
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Modal — shows full project details */}
      {modalOpen && (
        <div className="pe-modal-overlay" onClick={closeModal}>
          <div className="pe-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="pe-modal-close"
              onClick={closeModal}
              aria-label="Close"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div
              className="pe-modal-image"
              style={{ backgroundImage: `url('${active.image}')` }}
            >
              <span className="pe-modal-num">{active.num}</span>
            </div>

            <div className="pe-modal-body">
              <span className="pe-modal-category">{active.category}</span>
              <h2>{active.title}</h2>
              <p className="pe-modal-excerpt">{active.excerpt}</p>

              <div className="pe-modal-meta">
                <div>
                  <span className="label">Year</span>
                  <span className="value">{active.year}</span>
                </div>
                <div>
                  <span className="label">Location</span>
                  <span className="value">{active.location}</span>
                </div>
                <div>
                  <span className="label">Status</span>
                  <span className="value">{active.status}</span>
                </div>
              </div>

              <div className="pe-modal-actions">
                <Link
                  href="/projects"
                  className="pe-modal-primary"
                  onClick={closeModal}
                >
                  View all projects
                  <span className="material-symbols-outlined">
                    arrow_forward
                  </span>
                </Link>
                <button
                  type="button"
                  className="pe-modal-secondary"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}