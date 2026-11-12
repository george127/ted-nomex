"use client";

import { useEffect, useRef, useState } from "react";

function useCounter(target: number, duration = 1800) {
  const [value, setValue] = useState(0);
  const started = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          setValue(Math.round(progress * target));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);

  return { value, ref };
}

function CounterItem({ label, target, icon }: { label: string; target: number; icon?: string }) {
  const { value, ref } = useCounter(target);
  return (
    <div className="list-item" ref={ref}>
      {icon && <span className="material-symbols-outlined">{icon}</span>}
      <div className="list">
        <div className="counter">{value}</div>
        <p>{label}</p>
      </div>
    </div>
  );
}

export function Counters({ data, style }: { data: { label: string; target: number }[]; style?: "static" | "plain" }) {
  if (style === "plain") {
    return (
      <div className="list-items">
        {data.map((c) => (
          <div key={c.label} className="list">
            <CounterItemPlain label={c.label} target={c.target} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="counter-container">
      {data.map((c) => (
        <CounterItem key={c.label} label={c.label} target={c.target} icon="add" />
      ))}
    </div>
  );
}

function CounterItemPlain({ label, target }: { label: string; target: number }) {
  const { value, ref } = useCounter(target);
  return (
    <div ref={ref}>
      <div className="counter">{value}</div>
      <p>{label}</p>
    </div>
  );
}