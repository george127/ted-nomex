"use client";

import { useEffect, useState } from "react";
import { IMAGES } from "@/lib/assets";
import "@/styles/why-choose-us.css";

type Reason = {
  id: string;
  icon: string;
  title: string;
  summary: string;
  body: string[];
};

const REASONS: Reason[] = [
  {
    id: "experience",
    icon: "energy",
    title: "Experience",
    summary: "With over 12 years in the construction industry.",
    body: [
      "Ted-Nomex was founded in 2013 with a simple goal: deliver construction work that outlasts the contract. Over more than a decade we have completed residential, commercial, and industrial projects across Ghana — from single-family homes in Accra to multi-storey mixed-use developments in Tema and Takoradi.",
      "That track record matters when things get complicated. Site conditions change, supply chains shift, clients adjust scope mid-build. We have seen it all, and we plan for it. Our project managers work from checklists built out of twelve years of actual jobs — not from a textbook.",
      "We are also careful about what we take on. We would rather decline a project than overcommit and shortchange a client. That discipline is why our repeat-client rate is above 60%.",
    ],
  },
  {
    id: "team",
    icon: "biotech",
    title: "Skilled Team",
    summary: "Our team is our greatest asset.",
    body: [
      "Every project is run by a named site manager and a named quantity surveyor. Not a rotating cast. The person who walks your site on day one is the same person who signs off the final handover.",
      "Behind them is a core crew of masons, carpenters, electricians, and finishing specialists who have worked with us for years. We supplement with vetted subcontractors when scope demands it — never the other way around.",
      "Our engineers and site managers are formally certified and continuously trained on current building codes (Ghana Building Code LI 1630 and its amendments), safety regulations, and modern methods of construction.",
    ],
  },
  {
    id: "craftsmanship",
    icon: "handyman",
    title: "Craftsmanship",
    summary:
      "We are dedicated to delivering superior craftsmanship in every project.",
    body: [
      "Craftsmanship is not a slogan — it is the visible difference between a wall that is straight and one that is not, between a joint that disappears and one that draws the eye. We inspect finishes at three stages: substrate, mid-coat, and final.",
      "Where possible we keep traditional trades alive: hand-cut joinery, lime-based plaster, terrazzo inlays. When a modern material does a better job we use it — but we know the difference, and so do our clients.",
      "Every completed project is photographed at handover. Those photos are our portfolio, and they are the reason most of our new work comes from referrals.",
    ],
  },
  {
    id: "safety",
    icon: "engineering",
    title: "Safety Commitment",
    summary: "The safety of our team and clients is paramount.",
    body: [
      "Construction sites are dangerous places, and we treat them that way. Every site we run has a written safety plan, a designated safety officer, and daily toolbox talks. PPE is mandatory and enforced — no exceptions for seniority, experience, or schedule pressure.",
      "We carry public liability insurance on every project and require our subcontractors to carry equivalent cover. Our incident rate over the last five years is below one reportable event per fifty thousand man-hours.",
      "Safety is not separate from quality — the same culture of discipline that keeps a crew safe produces work you can trust. The two go together, and we hire accordingly.",
    ],
  },
];

export function WhyChooseUs() {
  const [openId, setOpenId] = useState<string | null>(null);
  const active = REASONS.find((r) => r.id === openId) ?? null;

  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenId(null);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openId]);

  return (
    <>
      <div className="chooseUs-container Text-Item">
        <img src={IMAGES.servicesBg} alt="" className="image" />
        <br />
        <br />
        <br />
        <br />
        <div className="container">
          <div className="text-container">
            <p>What said about us</p>
            <h2>Why Choose Us</h2>
            <span></span>
            <br />
            <br />
            <p>
              Choosing the right construction company is crucial for the success
              of your project.
            </p>
            <br />
            <br />
          </div>

          <div className="Button-container">
            <div className="buttons">
              {REASONS.slice(0, 2).map((r, i) => (
                <ReasonCard
                  key={r.id}
                  reason={r}
                  index={i + 1}
                  onOpen={() => setOpenId(r.id)}
                />
              ))}
            </div>
            <div className="buttons" style={{ marginTop: "20px" }}>
              {REASONS.slice(2, 4).map((r, i) => (
                <ReasonCard
                  key={r.id}
                  reason={r}
                  index={i + 3}
                  onOpen={() => setOpenId(r.id)}
                />
              ))}
            </div>
          </div>
        </div>
        <br />
        <br />
        <br />
        <br />
      </div>

      {active && (
        <div
          className="why-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="why-modal-title"
          onClick={() => setOpenId(null)}
        >
          <div className="why-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="why-modal-close"
              onClick={() => setOpenId(null)}
              aria-label="Close"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="why-modal-header">
              <div className="why-modal-icon">
                <span className="material-symbols-outlined">
                  {active.icon}
                </span>
              </div>
              <div>
                <p className="why-modal-kicker">Why choose us</p>
                <h3 id="why-modal-title" className="why-modal-title">
                  {active.title}
                </h3>
              </div>
            </div>

            <div className="why-modal-body">
              {active.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="why-modal-foot">
              <p>Ready to start a project?</p>
              <a href="/contact" className="why-modal-cta">
                Contact us
                <span className="material-symbols-outlined">
                  arrow_forward
                </span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ReasonCard({
  reason,
  index,
  onOpen,
}: {
  reason: Reason;
  index: number;
  onOpen: () => void;
}) {
  return (
    <div
      className="item why-card-clickable"
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      aria-label={`Read more about ${reason.title}`}
    >
      <div className="line"></div>
      <div className="list">
        <span className="material-symbols-outlined icon">{reason.icon}</span>
        <div className="Text">
          <h5>{reason.title}</h5>
          <p>{reason.summary}</p>
          <p className="link">read more</p>
        </div>
      </div>
      <div className="num">
        <p>{String(index).padStart(2, "0")}.</p>
      </div>
    </div>
  );
}