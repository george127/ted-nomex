"use client";

import Link from "next/link";
import { useState } from "react";
import "@/styles/contact.css";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.9780867857566!2d-0.19688492497356382!3d5.560283794412008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMzMnMzcuMCJOIDDCsDExJzQ4LjEiVw!5e0!3m2!1sen!2sgh!4v1730000000000!5m2!1sen!2sgh";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError(null);

    try {
      const res = await fetch(`${API}/api/enquiries`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim() || null,
          subject: form.subject.trim() || null,
          message: form.message.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.message ?? `Failed (${res.status})`);
      }

      setStatus("sent");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Could not send message");
    }
  };

  return (
    <>
      {/* ── Hero ── */}
      <section className="contact-hero">
        <div className="container">
          <nav className="hero-chip" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="dot">·</span>
            <span>Contact</span>
          </nav>
          <p className="hero-eyebrow">Get in touch</p>
          <h1 className="hero-title">
            Let&apos;s build <span>something</span> together.
          </h1>
          <p className="hero-lead">
            Have a question, need a quote, or want to discuss a project? Send us
            a message — our team responds within 24 hours.
          </p>
        </div>
      </section>

      {/* ── Body ── */}
      <section className="contact-body">
        <div className="container">
          <div className="contact-layout">

            {/* Form panel */}
            <div className="contact-form-panel">
              <div>
                <h2>Send us a message</h2>
                <p>
                  Fill in the form below and our team will get back to you shortly.
                </p>
              </div>

              <form className="contact-form" onSubmit={onSubmit}>
                <div className="form-field">
                  <label htmlFor="contact-name">
                    Your name <span className="required">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    minLength={2}
                    maxLength={120}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Kwame Mensah"
                    disabled={status === "sending"}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="contact-email">
                    Email <span className="required">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="kwame@example.com"
                    disabled={status === "sending"}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="contact-phone">Phone (optional)</label>
                  <input
                    id="contact-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+233 ..."
                    disabled={status === "sending"}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="contact-subject">Subject (optional)</label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Project enquiry, support, partnership…"
                    disabled={status === "sending"}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="contact-message">
                    Message <span className="required">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us a bit about what you need…"
                    disabled={status === "sending"}
                  />
                </div>

                {status === "sent" && (
                  <p className="contact-feedback contact-feedback-success">
                    Thanks — your message has been sent. We&apos;ll be in touch shortly.
                  </p>
                )}
                {status === "error" && error && (
                  <p className="contact-feedback contact-feedback-error">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="contact-submit"
                  disabled={status === "sending"}
                >
                  {status === "sending" ? "Sending…" : "Send message"}
                  {status !== "sending" && (
                    <span className="material-symbols-outlined">arrow_forward</span>
                  )}
                </button>
              </form>
            </div>

            {/* Sidebar */}
            <aside className="contact-sidebar">
              <div className="contact-info-card">
                <p className="contact-info-kicker">Reach us</p>
                <h3>Contact details</h3>
                <div className="contact-info-list">
                  <div className="contact-info-item">
                    <div className="contact-info-item-icon">
                      <span className="material-symbols-outlined">mail</span>
                    </div>
                    <div className="contact-info-item-body">
                      <span className="contact-info-item-label">Email</span>
                      <a
                        href="mailto:info@ted-nomex.com"
                        className="contact-info-item-value"
                      >
                        info@ted-nomex.com
                      </a>
                    </div>
                  </div>

                  <div className="contact-info-item">
                    <div className="contact-info-item-icon">
                      <span className="material-symbols-outlined">call</span>
                    </div>
                    <div className="contact-info-item-body">
                      <span className="contact-info-item-label">Phone</span>
                      <a
                        href="tel:0595808051"
                        className="contact-info-item-value"
                      >
                        0595 808 051
                      </a>
                    </div>
                  </div>

                  <div className="contact-info-item">
                    <div className="contact-info-item-icon">
                      <span className="material-symbols-outlined">location_on</span>
                    </div>
                    <div className="contact-info-item-body">
                      <span className="contact-info-item-label">Address</span>
                      <span className="contact-info-item-value">
                        GJ-275-7823, Accra, Ghana
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="contact-map-card">
                <iframe
                  src={MAP_EMBED_URL}
                  className="contact-map"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ted-Nomex location on Google Maps"
                />
                <div className="contact-map-foot">
                  <p>Accra, Ghana</p>
                  <a
                    href="https://maps.google.com/?q=5.5603,-0.1969"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get directions
                    <span className="material-symbols-outlined">open_in_new</span>
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}