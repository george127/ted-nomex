"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import "@/styles/team-slider.css";

export type TeamMember = {
  name: string;
  role: string;
  img: string;
  desc: string;
};

type Props = { team: TeamMember[] };

// Extended bios — keyed by name so the slider data can stay as-is.
// Extend these as you add people. Falls back to `member.desc` if missing.
const BIOS: Record<string, string[]> = {
  "Nodin Somuah": [
    "Nodin Somuah founded Ted-Nomex in 2012 with a simple conviction: construction in Ghana deserved better — better planning, better craft, better communication with clients. Twelve years later, that conviction is still the operating principle.",
    "As Founder and CEO, Nodin oversees the firm's strategic direction, capital planning, and the client relationships that define the company's reputation. He is directly involved in every major project from pitch to handover — no project goes out the door without his review.",
    "Nodin holds a BSc in Civil Engineering and has spent his career split between site work and firm leadership. He sits on the board of two industry associations and mentors young engineers entering the field.",
  ],
  "Jeffrey Luke": [
    "Jeffrey Luke runs the operational machinery behind Ted-Nomex: scheduling, procurement logistics, permit coordination, and the daily rhythm that keeps multiple concurrent sites moving.",
    "Before joining Ted-Nomex he spent eight years in logistics for a regional construction supplier, where he learned the same lesson on the supply side: projects don't fail from bad drawings, they fail from late material deliveries. He brought that insight to the operations team and it changed how the firm schedules.",
    "Jeffrey manages a small team of coordinators and works closely with the site managers to make sure nothing waits.",
  ],
  "Austin Evon": [
    "Austin Evon is the Main Manager on site — the person who turns plans into structures. He supervises the construction teams across all active projects, enforces quality standards, and signs off on every phase transition.",
    "Austin came up through the trades: ten years as a site foreman before stepping into management. That background shows in how he runs jobs — he can read a structural drawing as fast as the engineer who produced it, and he knows when a detail is going to be a problem six weeks down the line.",
    "He is certified in construction safety management and runs the firm's internal training program for junior site staff.",
  ],
};

export function TeamSlider({ team }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const updateButtons = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
    const cardWidth = el.scrollWidth / team.length;
    const idx = Math.round(el.scrollLeft / cardWidth);
    setActive(Math.min(team.length - 1, Math.max(0, idx)));
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateButtons, { passive: true });
    window.addEventListener("resize", updateButtons);
    updateButtons();
    return () => {
      el.removeEventListener("scroll", updateButtons);
      window.removeEventListener("resize", updateButtons);
    };
  }, [team.length]);

  // Modal: lock body scroll + Esc
  useEffect(() => {
    if (openIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIdx(null);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openIdx]);

  const scrollToIndex = (idx: number) => {
    const el = trackRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / team.length;
    el.scrollTo({ left: cardWidth * idx, behavior: "smooth" });
  };

  const goPrev = () => scrollToIndex(Math.max(0, active - 1));
  const goNext = () => scrollToIndex(Math.min(team.length - 1, active + 1));

  const activeMember = openIdx !== null ? team[openIdx] : null;
  const activeBio =
    activeMember && BIOS[activeMember.name]
      ? BIOS[activeMember.name]
      : activeMember
      ? [activeMember.desc]
      : [];

  return (
    <>
      <div className="team-slider">
        <div className="team-slider-controls">
          <button
            type="button"
            className="team-slider-arrow"
            onClick={goPrev}
            disabled={!canScrollLeft}
            aria-label="Previous team member"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <button
            type="button"
            className="team-slider-arrow"
            onClick={goNext}
            disabled={!canScrollRight}
            aria-label="Next team member"
          >
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>

        <div className="team-slider-track" ref={trackRef}>
          {team.map((t, i) => (
            <article
              className="team-card team-card-clickable"
              key={t.name}
              onClick={() => setOpenIdx(i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setOpenIdx(i);
                }
              }}
              aria-label={`Read more about ${t.name}`}
            >
              <div
                className="team-card-image"
                style={{ backgroundImage: `url('${t.img}')` }}
              >
                <div className="team-card-overlay">
                  <span className="team-card-cta">
                    <span>Read more</span>
                    <span className="material-symbols-outlined">
                      arrow_outward
                    </span>
                  </span>
                </div>
                <span className="team-card-num">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="team-card-body">
                <div className="team-card-head">
                  <h3 className="team-card-name">{t.name}</h3>
                  <span className="team-role-pill">{t.role}</span>
                </div>
                <p className="team-card-desc">{t.desc}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="team-slider-dots">
          {team.map((_, i) => (
            <button
              type="button"
              key={i}
              className={`team-slider-dot${i === active ? " active" : ""}`}
              onClick={() => scrollToIndex(i)}
              aria-label={`Go to team member ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {activeMember && (
        <div
          className="team-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="team-modal-title"
          onClick={() => setOpenIdx(null)}
        >
          <div
            className="team-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="team-modal-close"
              onClick={() => setOpenIdx(null)}
              aria-label="Close"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div
              className="team-modal-image"
              style={{ backgroundImage: `url('${activeMember.img}')` }}
            >
              <span className="team-modal-num">
                {String((openIdx ?? 0) + 1).padStart(2, "0")}
              </span>
            </div>

            <div className="team-modal-body">
              <span className="team-modal-role">{activeMember.role}</span>
              <h2 id="team-modal-title" className="team-modal-name">
                {activeMember.name}
              </h2>

              <div className="team-modal-bio">
                {activeBio.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              <div className="team-modal-foot">
                <p>Want to work with {activeMember.name.split(" ")[0]}?</p>
                <Link
                  href="/contact"
                  className="team-modal-cta"
                  onClick={() => setOpenIdx(null)}
                >
                  Get in touch
                  <span className="material-symbols-outlined">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}