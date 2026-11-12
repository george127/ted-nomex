"use client";

import { useState } from "react";
import "@/styles/cost.css";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const WALL_OPTIONS = [
  { label: "Painting (GH₵ 154)", value: 154 },
  { label: "Painting + Minor Repairs (GH₵ 257)", value: 257 },
  { label: "Hanging Lining Paper (GH₵ 354)", value: 354 },
];

export default function CostPage() {
  const [wallValue, setWallValue] = useState(WALL_OPTIONS[0].value);
  const [area, setArea] = useState(0);
  const [windows, setWindows] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [sqm, setSqm] = useState(0);
  const [floors, setFloors] = useState(1);

  // Save-to-DB form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: "success" | "error"; text: string } | null>(null);

  const total =
    wallValue + area * 4 + windows * 120 + rooms * 300 + sqm * 6 + floors * 500;

const saveEstimate = async (e: React.FormEvent) => {
  e.preventDefault();
  setMessage(null);
  setSaving(true);
  try {
    // Match the backend's inputsSchema exactly:
    //   walls, area, windows, rooms, sqm, floors — all numbers
    const payload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim() || null,
      inputs: {
        walls: wallValue,          // ← `walls`, not `wallValue`
        area: Number(area),
        windows: Number(windows),
        rooms: Number(rooms),
        sqm: Number(sqm),
        floors: Number(floors),
      },
      estimate: Number(total),
      currency: "GHS",
      notes: notes.trim() || null,
    };

    // Append the human-readable wall option to notes so admin sees it
    const wallLabel = WALL_OPTIONS.find((o) => o.value === wallValue)?.label ?? "";
    const noteLine = `Wall option: ${wallLabel}`;
    payload.notes = payload.notes ? `${payload.notes}\n\n${noteLine}` : noteLine;

    const res = await fetch(`${API}/api/quotes`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const details =
        data?.errors ??
        data?.issues ??
        data?.message ??
        `Failed (${res.status})`;
      throw new Error(
        typeof details === "string" ? details : JSON.stringify(details)
      );
    }

    setMessage({
      kind: "success",
      text: "Estimate saved. Our team will reach out to confirm.",
    });
    setName("");
    setEmail("");
    setPhone("");
    setNotes("");
  } catch (err) {
    setMessage({
      kind: "error",
      text: err instanceof Error ? err.message : "Could not save estimate",
    });
  } finally {
    setSaving(false);
  }
};

  return (
    <div className="cost-page">

      <section className="cost-body">
        <div className="container">
          <div className="cost-layout">

            {/* ── LEFT: Calculator ── */}
            <div className="calculator-shell">
              <div>
                <h2>Build your estimate</h2>
                <p>
                  Adjust the sliders and dropdowns below to estimate the cost of
                  your project. Save your estimate on the right to send it to our
                  team.
                </p>
              </div>

              <div className="calc-row">
                <label>Walls & Ceilings</label>
                <select
                  value={wallValue}
                  onChange={(e) => setWallValue(Number(e.target.value))}
                >
                  {WALL_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="calc-row">
                <label>
                  Area to be renovated
                  <span className="calc-value">{area} m²</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={500}
                  value={area}
                  style={{ ["--fill" as any]: `${(area / 500) * 100}%` }}
                  onChange={(e) => setArea(Number(e.target.value))}
                />
              </div>

              <div className="calc-row">
                <label>
                  Windows to replace
                  <span className="calc-value">{windows}</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={15}
                  value={windows}
                  style={{ ["--fill" as any]: `${(windows / 15) * 100}%` }}
                  onChange={(e) => setWindows(Number(e.target.value))}
                />
              </div>

              <div className="calc-row">
                <label>Number of rooms</label>
                <select
                  value={rooms}
                  onChange={(e) => setRooms(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6].map((r) => (
                    <option key={r} value={r}>
                      Room {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="calc-row">
                <label>
                  Square metres
                  <span className="calc-value">{sqm} m²</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={500}
                  value={sqm}
                  style={{ ["--fill" as any]: `${(sqm / 500) * 100}%` }}
                  onChange={(e) => setSqm(Number(e.target.value))}
                />
              </div>

              <div className="calc-row">
                <label>Number of floors</label>
                <select
                  value={floors}
                  onChange={(e) => setFloors(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6].map((f) => (
                    <option key={f} value={f}>
                      {f} floor{f > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="calc-total">
                <p className="calc-total-kicker">Estimated total</p>
                <p className="calc-total-value">
                  <span>GHS</span>
                  {total.toLocaleString()}
                </p>
                <p className="calc-total-note">
                  This is an indicative estimate. Final pricing depends on site
                  inspection, materials, and timeline.
                </p>
              </div>
            </div>

            {/* ── RIGHT: Save form ── */}
            <aside className="cost-save">
              <p className="cost-save-kicker">Save your estimate</p>
              <h2>Send this estimate to our team</h2>
              <p>
                Fill in your details below and we&apos;ll save your estimate and
                get back to you within 24 hours.
              </p>

              <form onSubmit={saveEstimate} style={{ display: "contents" }}>
                <div className="cost-field">
                  <label htmlFor="cost-name">Full name</label>
                  <input
                    id="cost-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Kwame Mensah"
                    minLength={2}
                    maxLength={120}
                  />
                </div>
                <div className="cost-field">
                  <label htmlFor="cost-email">Email</label>
                  <input
                    id="cost-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="kwame@example.com"
                  />
                </div>
                <div className="cost-field">
                  <label htmlFor="cost-phone">Phone (optional)</label>
                  <input
                    id="cost-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+233 ..."
                  />
                </div>
                <div className="cost-field">
                  <label htmlFor="cost-notes">Notes (optional)</label>
                  <textarea
                    id="cost-notes"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Timeline, location, special requests…"
                  />
                </div>

                <button
                  type="submit"
                  className="cost-save-cta"
                  disabled={saving}
                >
                  {saving ? "Saving…" : "Save estimate"}
                  {!saving && (
                    <span className="material-symbols-outlined">arrow_forward</span>
                  )}
                </button>

                {message && (
                  <p
                    className={`cost-message cost-message-${message.kind}`}
                    role="alert"
                  >
                    {message.text}
                  </p>
                )}
              </form>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}