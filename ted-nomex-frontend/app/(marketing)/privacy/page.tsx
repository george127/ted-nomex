import Link from "next/link";
import "@/styles/legal.css";

export const metadata = {
  title: "Privacy Policy",
  description:
    "How Ted-Nomex Construction Company collects, uses, and protects your personal information.",
};

const SECTIONS = [
  {
    id: "overview",
    n: "01",
    title: "Overview",
    body: [
      "This Privacy Policy explains how Ted-Nomex Construction Company (\"we\", \"us\", \"our\") collects, uses, shares, and protects information when you visit our website, create an account, place an order, or contact us.",
      "We are committed to handling your personal information responsibly and in accordance with applicable data-protection law, including the Ghana Data Protection Act, 2012 (Act 843).",
    ],
  },
  {
    id: "collect",
    n: "02",
    title: "Information we collect",
    body: [
      "We collect information in three main ways: information you provide, information collected automatically, and information from third parties.",
    ],
    groups: [
      {
        heading: "Information you give us",
        items: [
          "Name, email address, phone number, and delivery address.",
          "Account credentials when you register.",
          "Order details and payment confirmation (payment card data is handled by Stripe — we never see or store your full card number).",
          "Messages you send us through the contact form or by email.",
        ],
      },
      {
        heading: "Information we collect automatically",
        items: [
          "IP address, browser type, operating system, and referring URL.",
          "Pages visited and actions taken on the Site.",
          "Cookies and similar tracking technologies (see section 05).",
        ],
      },
      {
        heading: "Information from third parties",
        items: [
          "Payment status and fraud signals from Stripe.",
          "Basic profile data from Google if you choose to sign in with Google.",
        ],
      },
    ],
  },
  {
    id: "use",
    n: "03",
    title: "How we use your information",
    bullets: [
      "To process and fulfil orders, including delivery and customer support.",
      "To create and manage your account and authenticate your sessions.",
      "To respond to enquiries submitted through the contact form.",
      "To send transactional emails (order confirmations, shipping updates, password resets).",
      "To send optional marketing emails — only if you have opted in, and you can unsubscribe at any time.",
      "To detect and prevent fraud, abuse, and unauthorised access.",
      "To comply with legal obligations and enforce our Terms of Use.",
    ],
  },
  {
    id: "share",
    n: "04",
    title: "Who we share information with",
    body: [
      "We do not sell your personal information. We share it only with service providers who help us operate the Site and fulfil your orders, and only to the extent necessary:",
    ],
    bullets: [
      "Stripe — payment processing.",
      "Our hosting, database, and email providers.",
      "Delivery partners — name, address, and phone, only for the purpose of completing your order.",
      "Professional advisers (lawyers, accountants) where required.",
      "Law enforcement or regulators, when we are legally required to do so.",
    ],
    after: [
      "Each provider is contractually obligated to protect your information and to use it only for the purpose we specify.",
    ],
  },
  {
    id: "cookies",
    n: "05",
    title: "Cookies and tracking",
    body: [
      "We use cookies and similar technologies to keep you signed in, remember your cart between visits, and understand how the Site is used so we can improve it.",
    ],
    bullets: [
      "Essential cookies — required for the Site to function (session, cart, security).",
      "Analytics cookies — help us understand which pages are useful and which are not.",
      "You can block or delete cookies through your browser settings, but doing so may break parts of the Site.",
    ],
  },
  {
    id: "retention",
    n: "06",
    title: "How long we keep your information",
    body: [
      "We keep personal information only as long as needed for the purposes described in this policy, or as required by law.",
    ],
    bullets: [
      "Account information — until you delete your account, then up to 90 days in backups.",
      "Order records — 7 years, as required by Ghanaian tax law.",
      "Contact form messages — 24 months.",
      "Analytics data — 26 months.",
    ],
  },
  {
    id: "rights",
    n: "07",
    title: "Your rights",
    body: ["Subject to applicable law, you have the right to:"],
    bullets: [
      "Access the personal information we hold about you.",
      "Correct inaccurate or incomplete information.",
      "Request deletion of your information (the \"right to be forgotten\").",
      "Object to or restrict certain types of processing.",
      "Request a portable copy of your information in a machine-readable format.",
      "Withdraw consent for marketing at any time.",
      "Lodge a complaint with the Data Protection Commission of Ghana.",
    ],
    after: [
      "To exercise any of these rights, email info@tednomex.com. We will respond within 30 days.",
    ],
  },
  {
    id: "security",
    n: "08",
    title: "How we protect your information",
    body: [
      "We use industry-standard security measures, including encryption in transit (HTTPS), encryption at rest for sensitive fields, hashed passwords, and role-based access controls limiting staff access to the minimum necessary.",
      "No system is perfectly secure. If a breach affects your personal information, we will notify you and the relevant authorities as required by law.",
    ],
  },
  {
    id: "children",
    n: "09",
    title: "Children",
    body: [
      "The Site is not directed at children under 18. We do not knowingly collect information from children. If you believe a child has provided us with personal information, please contact us so we can delete it.",
    ],
  },
  {
    id: "changes",
    n: "10",
    title: "Changes to this policy",
    body: [
      "We may update this Privacy Policy from time to time. Material changes will be highlighted on this page and, where appropriate, notified by email. The date at the top of the page reflects the most recent revision.",
    ],
  },
  {
    id: "contact",
    n: "11",
    title: "Contact us",
    body: [
      "For any question about this Privacy Policy or how we handle your data:",
    ],
    after: [
      "Ted-Nomex Construction Company · Accra, Ghana · info@tednomex.com",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <section className="legal-hero">
        <div className="container">
          <nav className="legal-chip" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="dot">·</span>
            <span className="current">Privacy Policy</span>
          </nav>
          <p className="legal-eyebrow">Legal</p>
          <h1 className="legal-title">
            Privacy <span>Policy</span>.
          </h1>
          <p className="legal-lead">
            What we collect, why we collect it, and the rights you have over
            your information. Written in plain language.
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
                <p>Data question?</p>
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
                  {s.groups?.map((g) => (
                    <div key={g.heading} className="legal-group">
                      <h3 className="legal-group-heading">{g.heading}</h3>
                      <ul className="legal-bullets">
                        {g.items.map((it, i) => (
                          <li key={`g-${i}`}>
                            <span className="material-symbols-outlined">check</span>
                            <span>{it}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
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
                  Questions about your data? Email{" "}
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