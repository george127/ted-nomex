import Link from "next/link";
import { listServicesCached } from "@/modules/cms/services/cached";

const SLUG_ICONS: Record<string, string> = {
  "design-and-build": "architecture",
  "design-build": "architecture",
  "tiling-and-painting": "format_paint",
  "architecture": "apartment",
  "house-renovation": "home_repair_service",
  "interior-renovation": "home_repair_service",
  "household-repairs": "handyman",
  "preconstruction-planning": "engineering",
  "interior-design": "chair",
  "equipment-rental": "construction",
};

function iconForSlug(slug: string): string {
  return SLUG_ICONS[slug] ?? "handyman";
}

export async function ServicesGrid() {
  const all = await listServicesCached();
  const services = all.slice(0, 3);

  if (services.length === 0) {
    return (
      <div className="services-items services-items-empty">
        <div className="services-empty">
          <span className="material-symbols-outlined">handyman</span>
          <p>Our service listings are being prepared. Check back soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="services-items">
      {services.map((service, i) => (
        <div key={service.id} className="service-list">
          <div
            className="content-container"
            style={{
              background: service.coverImage
                ? `url('${service.coverImage}') no-repeat center center / cover`
                : undefined,
            }}
          >
            <div className="content">
              <Link href={`/services/${service.slug}`} className="btn">
                Read more
              </Link>
            </div>
          </div>

          <div className="collection">
            <span className="material-symbols-outlined">
              {iconForSlug(service.slug)}
            </span>
            <br />
            <br />
            <h2>{service.title}</h2>
            <p>{service.excerpt}</p>
            <div className="line-container">
              <span className="one"></span>
              <span className="two"></span>
            </div>
          </div>

          <div className="num">
            <p>{String(i + 1).padStart(2, "0")}</p>
          </div>
        </div>
      ))}
    </div>
  );
}