"use client";

export function ScrollToTop() {
  const onClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button type="button" onClick={onClick} aria-label="Back to top">
      <span className="material-symbols-outlined">expand_less</span>
    </button>
  );
}