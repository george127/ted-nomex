import Link from "next/link";
import "@/styles/legal.css";

export const metadata = {
  title: "Terms of Use",
  description:
    "The terms governing your use of the Ted-Nomex Construction Company website, products, and services.",
};

const SECTIONS = [
  {
    id: "acceptance",
    n: "01",
    title: "Acceptance of terms",
    body: [
      "By accessing or using the Ted-Nomex Construction Company website (the \"Site\") or any product or service we offer through it, you agree to be bound by these Terms of Use. If you do not agree, please do not use the Site.",
      "We may update these terms from time to time. The version in effect is the one displayed on this page at the time you access the Site. Continued use after changes are posted constitutes acceptance of the revised terms.",
    ],
  },
  {
    id: "use",
    n: "02",
    title: "Permitted use",
    body: ["You may use the Site for lawful purposes only. You agree not to:"],
    bullets: [
      "Use the Site in any way that breaches applicable local, national, or international law or regulation.",
      "Attempt to gain unauthorised access to the Site, its servers, or any connected database.",
      "Introduce viruses, trojans, worms, or other malicious material.",
      "Reproduce, duplicate, copy, or resell any part of the Site in contravention of our intellectual-property rights.",
      "Interfere with the proper working of the Site or attempt to circumvent any access control.",
    ],
  },
  {
    id: "accounts",
    n: "03",
    title: "Accounts and registration",
    body: [
      "Some features of the Site (for example, placing orders for products or tracking projects) require you to create an account. When you register:",
    ],
    bullets: [
      "You must provide accurate, current, and complete information.",
      "You are responsible for maintaining the confidentiality of your credentials.",
      "You are responsible for all activity that occurs under your account.",
      "You must notify us immediately if you suspect any unauthorised use.",
    ],
    after: [
      "We reserve the right to suspend or terminate accounts that violate these terms or that we reasonably believe are being used fraudulently.",
    ],
  },
  {
    id: "orders",
    n: "04",
    title: "Orders, pricing, and payment",
    body: [
      "All product listings, prices, and availability on the Site are for information only and may change without notice. An order is only accepted once we confirm it and receive payment in full.",
      "Prices are displayed in Ghanaian Cedi (GH₵) unless otherwise indicated. Where applicable, taxes are shown at checkout. Payment is processed through our third-party payment provider (currently Stripe) and is subject to their terms.",
    ],
  },
  {
    id: "delivery",
    n: "05",
    title: "Delivery and risk",
    body: [
      "Delivery windows are estimates and not guarantees. Risk in the goods passes to you upon delivery. Please inspect goods on arrival and notify us within 48 hours of any damage or discrepancy.",
    ],
  },
  {
    id: "ip",
    n: "06",
    title: "Intellectual property",
    body: [
      "All content on the Site — including text, images, project photographs, the Ted-Nomex name and logo, and the site's design and layout — is owned by or licensed to Ted-Nomex Construction Company and is protected by Ghanaian and international copyright and trademark laws.",
      "You may view, download, and print pages from the Site for your own personal, non-commercial use, provided you keep all copyright and proprietary notices intact.",
    ],
  },
  {
    id: "liability",
    n: "07",
    title: "Limitation of liability",
    body: [
      "The Site is provided on an \"as is\" and \"as available\" basis. To the fullest extent permitted by law, Ted-Nomex Construction Company excludes all representations, warranties, and conditions relating to the Site and its use.",
      "We will not be liable for any direct, indirect, incidental, or consequential loss arising out of your use of, or inability to use, the Site — including, without limitation, loss of profits, loss of data, or business interruption.",
    ],
  },
  {
    id: "law",
    n: "08",
    title: "Governing law",
    body: [
      "These terms are governed by and construed in accordance with the laws of the Republic of Ghana. Any dispute arising out of or in connection with these terms is subject to the exclusive jurisdiction of the courts of Ghana.",
    ],
  },
  {
    id: "contact",
    n: "09",
    title: "Contacting us",
    body: ["If you have any questions about these Terms of Use, please contact us:"],
    after: [
      "Ted-Nomex Construction Company · Accra, Ghana · info@tednomex.com",
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="legal-page">
      <section className="legal-hero">
        <div className="container">
          <nav className="legal-chip" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="dot">·</span>
            <span className="current">Terms of Use</span>
          </nav>
          <p className="legal-eyebrow">Legal</p>
          <h1 className="legal-title">
            Terms of <span>Use</span>.
          </h1>
          <p className="legal-lead">
            The rules that govern your use of our website, products, and
            services. Plain language, no surprises.
          </p>
          <p className="legal-updated">Last updated: 12 November 2026</p>
        </div>
      </section>

      <section className="legal-body">
        <div className="container">
          <div className="legal-layout">
            <aside className="legal-toc" aria-label="On this page">
              <p className="legal-toc-title">On this page</p>
              <ol className="legal-toc-list">
                {SECTIONS.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`}>
                      <span className="legal-toc-num">{s.n}</span>
                      <span className="legal-toc-label">{s.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
              <div className="legal-toc-help">
                <p>Questions about these terms?</p>
                <Link href="/contact" className="legal-toc-cta">
                  Contact us
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
              </div>
            </aside>

            <article className="legal-doc">
              {SECTIONS.map((s) => (
                <section key={s.id} id={s.id} className="legal-section">
                  <header className="legal-section-head">
                    <span className="legal-section-num">{s.n}</span>
                    <h2>{s.title}</h2>
                  </header>
                  {s.body?.map((p, i) => (
                    <p key={`b-${i}`} className="legal-p">{p}</p>
                  ))}
                  {s.bullets && (
                    <ul className="legal-bullets">
                      {s.bullets.map((b, i) => (
                        <li key={`l-${i}`}>
                          <span className="material-symbols-outlined">check</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {s.after?.map((p, i) => (
                    <p key={`a-${i}`} className="legal-p">{p}</p>
                  ))}
                </section>
              ))}
              <footer className="legal-signoff">
                <p>
                  Questions? Email{" "}
                  <a href="mailto:info@tednomex.com">info@tednomex.com</a> or{" "}
                  <Link href="/contact">send us a message</Link>.
                </p>
              </footer>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}