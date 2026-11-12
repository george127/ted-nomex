import {
  getAdminNews,
  getAdminProperties,
  getAdminProducts,
  getAdminServices,
  getAdminQuotes,
  getAdminOrders,
  getAdminUsers,
} from "@/lib/admin";
import "@/styles/admin.css";

export const metadata = { title: "Admin — Overview" };

async function safe<T>(fn: () => Promise<T[]>): Promise<T[]> {
  try { return await fn(); } catch { return []; }
}

export default async function AdminOverviewPage() {
  const [news, properties, products, services, quotes, orders, users] =
    await Promise.all([
      safe(getAdminNews),
      safe(getAdminProperties),
      safe(getAdminProducts),
      safe(getAdminServices),
      safe(getAdminQuotes),
      safe(getAdminOrders),
      safe(getAdminUsers),
    ]);

  const stats = [
    { label: "News", href: "/admin/news", value: news.length, icon: "newspaper" },
    { label: "Properties", href: "/admin/estate", value: properties.length, icon: "home_work" },
    { label: "Products", href: "/admin/products", value: products.length, icon: "inventory_2" },
    { label: "Services", href: "/admin/services", value: services.length, icon: "handyman" },
    { label: "Quotes", href: "/admin/quotes", value: quotes.length, icon: "request_quote" },
    { label: "Orders", href: "/admin/orders", value: orders.length, icon: "shopping_bag" },
    { label: "Users", href: "/admin/users", value: users.length, icon: "group" },
  ];

  return (
    <div className="admin-overview">
      <header className="admin-page-head">
        <div>
          <h1>Overview</h1>
          <p>Content, orders and users across the site.</p>
        </div>
      </header>

      <div className="admin-grid">
        {stats.map((s) => (
          <a key={s.label} href={s.href} className="admin-stat">
            <span className="material-symbols-outlined">{s.icon}</span>
            <p className="label">{s.label}</p>
            <p className="value">{s.value}</p>
          </a>
        ))}
      </div>
    </div>
  );
}