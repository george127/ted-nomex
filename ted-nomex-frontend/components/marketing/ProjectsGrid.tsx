"use client";

import Link from "next/link";
import { useState } from "react";
import { IMAGES } from "@/lib/assets";

const PROJECTS = [
  { id: "p1", num: "01.", title: "Trinity River Renovate", excerpt: "Constant care and attention to the patients makes good record", image: IMAGES.projects[0], slug: "trinity-river" },
  { id: "p2", num: "02.", title: "White Walls House", excerpt: "Constant care and attention to the patients makes good record.", image: IMAGES.projects[1], slug: "white-walls" },
  { id: "p3", num: "03.", title: "Project Endoran", excerpt: "Constant care and attention to the patients makes good record.", image: IMAGES.projects[2], slug: "endoran" },
  { id: "p4", num: "04.", title: "World Trade Center", excerpt: "Constant care and attention to the patients makes good record", image: IMAGES.projects[3], slug: "world-trade-center" },
];

export function ProjectsGrid() {
  const [activeId, setActiveId] = useState(PROJECTS[0].id);
  const active = PROJECTS.find((p) => p.id === activeId) ?? PROJECTS[0];

  return (
    <div className="projects-editorial">
      {/* Featured project — swaps on hover */}
      <div className="pe-feature">
        {PROJECTS.map((p) => (
          <Link
            key={p.id}
            href={`/projects/${p.slug}`}
            className={`pe-feature-bg${p.id === activeId ? " is-active" : ""}`}
            style={{ backgroundImage: `url('${p.image}')` }}
            aria-label={p.title}
          >
            <span className="visually-hidden">{p.title}</span>
          </Link>
        ))}
        <div className="pe-feature-overlay" />
        <div className="pe-feature-content">
          <span className="pe-feature-num">{active.num}</span>
          <h3 className="pe-feature-title">{active.title}</h3>
          <p className="pe-feature-excerpt">{active.excerpt}</p>
          <Link href={`/projects/${active.slug}`} className="pe-feature-cta">
            <span>Explore this project</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      </div>

      {/* Index list — hover to preview */}
      <div className="pe-list">
        <p className="pe-list-heading">All projects</p>
        {PROJECTS.map((p) => (
          <Link
            key={p.id}
            href={`/projects/${p.slug}`}
            className={`pe-row${p.id === activeId ? " is-active" : ""}`}
            onMouseEnter={() => setActiveId(p.id)}
            onFocus={() => setActiveId(p.id)}
            onClick={() => setActiveId(p.id)}
          >
            <span className="pe-row-num">{p.num}</span>
            <div className="pe-row-body">
              <span className="pe-row-title">{p.title}</span>
              <span className="pe-row-meta">{p.excerpt.slice(0, 56)}…</span>
            </div>
            <span className="pe-row-arrow material-symbols-outlined">arrow_outward</span>
          </Link>
        ))}
      </div>
    </div>
  );
}