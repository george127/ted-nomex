"use client";

import { useEffect, useRef, useState } from "react";
import "@/styles/admin.css";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

type Property = {
  id: string; title: string; description: string; price: string; currency: string;
  status: string; location: string; type: string; style: string | null;
  rooms: number; bedrooms: number; bathrooms: number; parking: number; area: number;
  images: string[]; amenities: string[]; options: string[]; published: boolean;
};

type Draft = {
  title: string; description: string; price: string; currency: string;
  status: string; location: string; type: string; style: string;
  rooms: number; bedrooms: number; bathrooms: number; parking: number; area: number;
  images: string[]; amenitiesText: string; optionsText: string; published: boolean;
};

const emptyDraft: Draft = {
  title: "", description: "", price: "0", currency: "GHS",
  status: "For Sale", location: "", type: "", style: "",
  rooms: 1, bedrooms: 1, bathrooms: 1, parking: 0, area: 0,
  images: [], amenitiesText: "", optionsText: "", published: true,
};

function splitLines(s: string) {
  return s.split(/\r?\n|,/).map((x) => x.trim()).filter(Boolean);
}
function formatPrice(amount: string, currency: string) {
  const symbol = currency === "GHS" ? "GH₵" : currency;
  return `${symbol} ${Number(amount).toLocaleString()}`;
}

async function apiCall(method: string, path: string, body?: unknown) {
  const res = await fetch(`${API}${path}`, {
    method, credentials: "include",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  let json: any = null;
  try { json = await res.json(); } catch {}
  if (!res.ok) throw new Error(json?.message ?? `Failed (${res.status})`);
  return json;
}

async function uploadImage(file: File, folder: string): Promise<string> {
  const signRes = await fetch(`${API}/api/media/sign`, {
    method: "POST", credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder }),
  });
  if (!signRes.ok) {
    const e = await signRes.text().catch(() => "");
    throw new Error(`Sign failed (${signRes.status}): ${e.slice(0, 150)}`);
  }
  const sig: any = await signRes.json();
  const form = new FormData();
  form.append("file", file);
  form.append("api_key", sig.apiKey);
  form.append("timestamp", String(sig.timestamp));
  form.append("signature", sig.signature);
  form.append("folder", sig.folder);
  const up = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, { method: "POST", body: form });
  if (!up.ok) {
    const t = await up.text().catch(() => "");
    throw new Error(`Upload failed (${up.status}): ${t.slice(0, 200)}`);
  }
  return (await up.json()).secure_url;
}

function ImagesField({ values, onChange }: { values: string[]; onChange: (v: string[]) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const onFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setError(null); setUploading(true);
    const next = [...values];
    try {
      for (const file of files) {
        if (!file.type.startsWith("image/")) continue;
        if (file.size > 8 * 1024 * 1024) continue;
        next.push(await uploadImage(file, "ted-nomex/estate"));
      }
      onChange(next);
    } catch (err) { setError(err instanceof Error ? err.message : "Upload failed"); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ""; }
  };

  return (
    <div className="admin-field admin-field-full">
      <label>Images</label>
      <div className="admin-upload-grid">
        {values.map((url, i) => (
          <div key={`${url}-${i}`} className="admin-upload-thumb">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={`Image ${i + 1}`} />
            <button type="button" className="admin-upload-thumb-remove" onClick={() => onChange(values.filter((_, idx) => idx !== i))} aria-label="Remove">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        ))}
        <button type="button" className="admin-upload-add" onClick={() => fileRef.current?.click()} disabled={uploading}>
          {uploading ? (<span className="material-symbols-outlined">progress_activity</span>) : (<><span className="material-symbols-outlined">add_photo_alternate</span>Add</>)}
        </button>
      </div>
      <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={onFiles} />
      <p className="admin-field-hint">JPG, PNG or WebP, up to 8MB each. Upload multiple at once.</p>
      {error && <p className="admin-field-error">{error}</p>}
    </div>
  );
}

export default function AdminEstatePage() {
  const [rows, setRows] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Property | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API}/api/estate/admin/all`, { credentials: "include" });
      if (!res.ok) throw new Error(`Failed (${res.status})`);
      setRows(await res.json());
    } catch (err) { setError(err instanceof Error ? err.message : "Failed to load"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setDraft(emptyDraft); setSaveError(null); setOpen(true); };
  const openEdit = (row: Property) => {
    setEditing(row);
    setDraft({
      title: row.title, description: row.description, price: String(row.price),
      currency: row.currency, status: row.status, location: row.location,
      type: row.type, style: row.style ?? "", rooms: row.rooms,
      bedrooms: row.bedrooms, bathrooms: row.bathrooms, parking: row.parking,
      area: row.area, images: row.images ?? [],
      amenitiesText: (row.amenities ?? []).join("\n"),
      optionsText: (row.options ?? []).join("\n"),
      published: row.published,
    });
    setSaveError(null); setOpen(true);
  };
  const closeDrawer = () => { if (saving) return; setOpen(false); setEditing(null); };
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => ({ ...d, [k]: v }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setSaveError(null);
    try {
      const payload = {
        title: draft.title, description: draft.description,
        price: Number(draft.price), currency: draft.currency,
        status: draft.status, location: draft.location, type: draft.type,
        style: draft.style || null,
        rooms: Number(draft.rooms), bedrooms: Number(draft.bedrooms),
        bathrooms: Number(draft.bathrooms), parking: Number(draft.parking),
        area: Number(draft.area), images: draft.images,
        amenities: splitLines(draft.amenitiesText),
        options: splitLines(draft.optionsText),
        published: draft.published,
      };
      if (editing) await apiCall("PATCH", `/api/estate/${editing.id}`, payload);
      else await apiCall("POST", "/api/estate", payload);
      setOpen(false); setEditing(null); await load();
    } catch (err) { setSaveError(err instanceof Error ? err.message : "Failed to save"); }
    finally { setSaving(false); }
  };

  const del = async (row: Property) => {
    if (!confirm(`Delete "${row.title}"?`)) return;
    try { await apiCall("DELETE", `/api/estate/${row.id}`); await load(); }
    catch (err) { alert(err instanceof Error ? err.message : "Failed to delete"); }
  };

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div><h1>Estate</h1><p>{rows.length} total</p></div>
        <button type="button" className="admin-btn-primary" onClick={openCreate}>
          <span className="material-symbols-outlined">add</span> New property
        </button>
      </header>

      {error && <div className="admin-alert admin-alert-error">{error}</div>}

      {loading ? (
        <p style={{ padding: 20, color: "var(--color-gray)" }}>Loading…</p>
      ) : rows.length === 0 ? (
        <div className="admin-empty">
          <span className="material-symbols-outlined">home_work</span>
          <h3>No properties yet</h3>
          <p>List properties for sale or rent.</p>
          <button type="button" className="admin-btn-primary" onClick={openCreate}>Add first property</button>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Cover</th><th>Title</th><th>Location</th><th>Price</th><th>Beds</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id}>
                  <td>{p.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.images[0]} alt="" style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6, border: "1px solid var(--color-gray-border)" }} />
                  ) : (
                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: "var(--color-gray-mid)" }}>image</span>
                  )}</td>
                  <td><strong>{p.title}</strong></td>
                  <td>{p.location}</td>
                  <td>{formatPrice(p.price, p.currency)}</td>
                  <td>{p.bedrooms}/{p.bathrooms}</td>
                  <td><span className={`status-badge ${p.published ? "status-published" : "status-draft"}`}>{p.published ? "Published" : "Draft"}</span></td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button type="button" className="admin-btn-ghost admin-btn-small" onClick={() => openEdit(p)}>Edit</button>
                      <button type="button" className="admin-btn-danger admin-btn-small" onClick={() => del(p)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open && (
        <>
          <div className="admin-drawer-backdrop" onClick={closeDrawer} />
          <aside className="admin-drawer">
            <div className="admin-drawer-head">
              <h2>{editing ? "Edit property" : "New property"}</h2>
              <button type="button" className="admin-drawer-close" onClick={closeDrawer}><span className="material-symbols-outlined">close</span></button>
            </div>
            <form onSubmit={save} style={{ display: "contents" }}>
              <div className="admin-drawer-body">
                <div className="admin-form-fields">
                  <div className="admin-field"><label>Title</label>
                    <input type="text" value={draft.title} onChange={(e) => set("title", e.target.value)} required />
                  </div>
                  <div className="admin-field"><label>Description</label>
                    <textarea value={draft.description} onChange={(e) => set("description", e.target.value)} rows={4} required />
                  </div>
                  <div className="admin-field-row">
                    <div className="admin-field"><label>Price</label>
                      <input type="number" value={draft.price} onChange={(e) => set("price", e.target.value)} required min={0} step="0.01" />
                    </div>
                    <div className="admin-field"><label>Currency</label>
                      <select value={draft.currency} onChange={(e) => set("currency", e.target.value)}>
                        <option value="GHS">GHS</option><option value="USD">USD</option><option value="EUR">EUR</option><option value="GBP">GBP</option>
                      </select>
                    </div>
                  </div>
                  <div className="admin-field-row">
                    <div className="admin-field"><label>Status</label>
                      <input type="text" value={draft.status} onChange={(e) => set("status", e.target.value)} required placeholder="For Sale / For Rent" />
                    </div>
                    <div className="admin-field"><label>Type</label>
                      <input type="text" value={draft.type} onChange={(e) => set("type", e.target.value)} required placeholder="Apartment / House" />
                    </div>
                  </div>
                  <div className="admin-field-row">
                    <div className="admin-field"><label>Location</label>
                      <input type="text" value={draft.location} onChange={(e) => set("location", e.target.value)} required />
                    </div>
                    <div className="admin-field"><label>Style (optional)</label>
                      <input type="text" value={draft.style} onChange={(e) => set("style", e.target.value)} />
                    </div>
                  </div>
                  <div className="admin-field-row">
                    <div className="admin-field"><label>Rooms</label>
                      <input type="number" value={draft.rooms} onChange={(e) => set("rooms", Number(e.target.value))} min={0} />
                    </div>
                    <div className="admin-field"><label>Bedrooms</label>
                      <input type="number" value={draft.bedrooms} onChange={(e) => set("bedrooms", Number(e.target.value))} min={0} />
                    </div>
                  </div>
                  <div className="admin-field-row">
                    <div className="admin-field"><label>Bathrooms</label>
                      <input type="number" value={draft.bathrooms} onChange={(e) => set("bathrooms", Number(e.target.value))} min={0} />
                    </div>
                    <div className="admin-field"><label>Parking</label>
                      <input type="number" value={draft.parking} onChange={(e) => set("parking", Number(e.target.value))} min={0} />
                    </div>
                  </div>
                  <div className="admin-field"><label>Area (sqft)</label>
                    <input type="number" value={draft.area} onChange={(e) => set("area", Number(e.target.value))} min={0} />
                  </div>
                  <ImagesField values={draft.images} onChange={(v) => set("images", v)} />
                  <div className="admin-field"><label>Amenities (one per line)</label>
                    <textarea value={draft.amenitiesText} onChange={(e) => set("amenitiesText", e.target.value)} rows={3} />
                  </div>
                  <div className="admin-field"><label>Options (one per line)</label>
                    <textarea value={draft.optionsText} onChange={(e) => set("optionsText", e.target.value)} rows={3} />
                  </div>
                  <div className="admin-field admin-field-inline">
                    <label><input type="checkbox" checked={draft.published} onChange={(e) => set("published", e.target.checked)} /> Published</label>
                  </div>
                  {saveError && <div className="admin-alert admin-alert-error">{saveError}</div>}
                </div>
              </div>
              <div className="admin-drawer-foot">
                <button type="button" className="admin-btn-ghost" onClick={closeDrawer} disabled={saving}>Cancel</button>
                <button type="submit" className="admin-btn-primary" disabled={saving}>
                  {saving ? "Saving…" : editing ? "Save changes" : "Create"}
                </button>
              </div>
            </form>
          </aside>
        </>
      )}
    </div>
  );
}