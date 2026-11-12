import Link from "next/link";

export const metadata = { title: "Payment cancelled" };

export default function CheckoutCancelledPage() {
  return (
    <section style={{ padding: "100px 0", background: "#f7faf8", minHeight: "60vh" }}>
      <div className="container" style={{ maxWidth: 640, textAlign: "center" }}>
        <span className="material-symbols-outlined" style={{ fontSize: 80, color: "#b03131" }}>cancel</span>
        <h1 style={{ fontSize: 30, fontWeight: 800, color: "#091c13", margin: "12px 0" }}>Payment cancelled</h1>
        <p style={{ color: "#5b6f66", marginBottom: 24 }}>No charge was made. Your cart is still saved.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/cart" style={{ padding: "14px 28px", background: "#1a8a63", color: "#fff", fontWeight: 800, textTransform: "uppercase", fontSize: 12, textDecoration: "none" }}>Back to cart</Link>
          <Link href="/product" style={{ padding: "14px 28px", border: "1px solid #e2e8e3", color: "#5b6f66", fontWeight: 800, textTransform: "uppercase", fontSize: 12, textDecoration: "none" }}>Browse shop</Link>
        </div>
      </div>
    </section>
  );
}