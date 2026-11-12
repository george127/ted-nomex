"use client";

import { useEffect, useRef, useState } from "react";
import "@/styles/admin.css";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

type News = {
  id: string; slug: string; title: string; excerpt: string; content: string;
  coverImage: string; category: string; published: boolean; publishedAt: string | null;
};

type Draft = {
  title: string; slug: string; excerpt: string; content: string;
  coverImage: string; category: string; published: boolean; publishedAt: string;
};

const emptyDraft: Draft = {
  title: "", slug: "", excerpt: "", content: "",
  coverImage: "", category: "", published: false, publishedAt: "",
};

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
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
  const up = await fetch(
    `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
    { method: "POST", body: form },
  );
  if (!up.ok) {
    const t = await up.text().catch(() => "");
    throw new Error(`Upload failed (${up.status}): ${t.slice(0, 200)}`);
  }
  return (await up.json()).secure_url;
}

function ImageField({
  label, value, onChange, required,
}: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Please choose an image"); return; }
    if (file.size > 8 * 1024 * 1024) { setError("Max 8MB"); return; }
    setError(null); setUploading(true);
    try { onChange(await uploadImage(file, "ted-nomex/news")); }
    catch (err) { setError(err instanceof Error ? err.message : "Upload failed"); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ""; }
  };

  return (
    <div className="admin-field admin-field-full">
      <label>{label}{required && <span style={{ color: "#b91c1c" }}> *</span>}</label>
      {value ? (
        <div className="admin-upload-preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Preview" />
          <div className="admin-upload-actions">
            <button type="button" className="admin-btn-ghost admin-btn-small" onClick={() => fileRef.current?.click()} disabled={uploading}>
              Replace
            </button>
            <button type="button" className="admin-btn-danger admin-btn-small" onClick={() => onChange("")} disabled={uploading}>
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button type="button" className="admin-upload-drop" onClick={() => fileRef.current?.click()} disabled={uploading}>
          {uploading
            ? (<><span className="material-symbols-outlined">progress_activity</span> Uploading…</>)
            : (<><span className="material-symbols-outlined">upload</span> Choose image from your machine</>)}
        </button>
      )}
      <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={onFile} />
      <p className="admin-field-hint">JPG, PNG or WebP, up to 8MB.</p>
      {error && <p className="admin-field-error">{error}</p>}
    </div>
  );
}

export default function AdminNewsPage() {
  const [rows, setRows] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<News | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API}/api/cms/news/admin/all?published=all`, { credentials: "include" });
      if (!res.ok) throw new Error(`Failed (${res.status})`);
      setRows(await res.json());
    } catch (err) { setError(err instanceof Error ? err.message : "Failed to load"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setDraft(emptyDraft); setSaveError(null); setOpen(true); };
  const openEdit = (row: News) => {
    setEditing(row);
    setDraft({
      title: row.title, slug: row.slug, excerpt: row.excerpt, content: row.content,
      coverImage: row.coverImage, category: row.category, published: row.published,
      publishedAt: row.publishedAt ? new Date(row.publishedAt).toISOString().slice(0, 16) : "",
    });
    setSaveError(null); setOpen(true);
  };
  const closeDrawer = () => { if (saving) return; setOpen(false); setEditing(null); };
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => ({ ...d, [k]: v }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setSaveError(null);
    try {
      const payload = {
        title: draft.title, slug: draft.slug || slugify(draft.title),
        excerpt: draft.excerpt, content: draft.content,
        coverImage: draft.coverImage, category: draft.category,
        published: draft.published, publishedAt: draft.publishedAt || null,
      };
      if (editing) await apiCall("PATCH", `/api/cms/news/${editing.id}`, payload);
      else await apiCall("POST", "/api/cms/news", payload);
      setOpen(false); setEditing(null); await load();
    } catch (err) { setSaveError(err instanceof Error ? err.message : "Failed to save"); }
    finally { setSaving(false); }
  };

  const del = async (row: News) => {
    if (!confirm(`Delete "${row.title}"?`)) return;
    try { await apiCall("DELETE", `/api/cms/news/${row.id}`); await load(); }
    catch (err) { alert(err instanceof Error ? err.message : "Failed to delete"); }
  };

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div><h1>News</h1><p>{rows.length} total</p></div>
        <button type="button" className="admin-btn-primary" onClick={openCreate}>
          <span className="material-symbols-outlined">add</span> New post
        </button>
      </header>

      {error && <div className="admin-alert admin-alert-error">{error}</div>}

      {loading ? (
        <p style={{ padding: 20, color: "var(--color-gray)" }}>Loading…</p>
      ) : rows.length === 0 ? (
        <div className="admin-empty">
          <span className="material-symbols-outlined">newspaper</span>
          <h3>No news posts yet</h3>
          <p>Create your first article.</p>
          <button type="button" className="admin-btn-primary" onClick={openCreate}>Create first post</button>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Cover</th><th>Title</th><th>Category</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.coverImage} alt="" style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6, border: "1px solid var(--color-gray-border)" }} />
                  ) : (
                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: "var(--color-gray-mid)" }}>image</span>
                  )}</td>
                  <td><strong>{r.title}</strong></td>
                  <td>{r.category}</td>
                  <td><span className={`status-badge ${r.published ? "status-published" : "status-draft"}`}>{r.published ? "Published" : "Draft"}</span></td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button type="button" className="admin-btn-ghost admin-btn-small" onClick={() => openEdit(r)}>Edit</button>
                      <button type="button" className="admin-btn-danger admin-btn-small" onClick={() => del(r)}>Delete</button>
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
              <h2>{editing ? "Edit news post" : "New news post"}</h2>
              <button type="button" className="admin-drawer-close" onClick={closeDrawer}><span className="material-symbols-outlined">close</span></button>
            </div>
            <form onSubmit={save} style={{ display: "contents" }}>
              <div className="admin-drawer-body">
                <div className="admin-form-fields">
                  <div className="admin-field-row">
                    <div className="admin-field">
                      <label>Title</label>
                      <input type="text" value={draft.title}
                        onChange={(e) => {
                          set("title", e.target.value);
                          if (!editing && !draft.slug) set("slug", slugify(e.target.value));
                        }}
                        required minLength={3} maxLength={200} />
                    </div>
                    <div className="admin-field">
                      <label>Slug</label>
                      <input type="text" value={draft.slug} onChange={(e) => set("slug", e.target.value)} required pattern="[a-z0-9-]+" />
                    </div>
                  </div>
                  <div className="admin-field">
                    <label>Category</label>
                    <input type="text" value={draft.category} onChange={(e) => set("category", e.target.value)} required />
                  </div>
                  <div className="admin-field">
                    <label>Excerpt</label>
                    <textarea value={draft.excerpt} onChange={(e) => set("excerpt", e.target.value)} rows={2} required minLength={10} maxLength={500} />
                  </div>
                  <ImageField label="Cover image" value={draft.coverImage} onChange={(v) => set("coverImage", v)} required />
                  <div className="admin-field">
                    <label>Content</label>
                    <textarea value={draft.content} onChange={(e) => set("content", e.target.value)} rows={12} required minLength={20} />
                  </div>
                  <div className="admin-field admin-field-inline">
                    <label><input type="checkbox" checked={draft.published} onChange={(e) => set("published", e.target.checked)} /> Published</label>
                  </div>
                  {draft.published && (
                    <div className="admin-field">
                      <label>Published at</label>
                      <input type="datetime-local" value={draft.publishedAt} onChange={(e) => set("publishedAt", e.target.value)} />
                    </div>
                  )}
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