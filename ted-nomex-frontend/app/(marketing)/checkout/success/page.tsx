import Link from "next/link";
import "@/styles/checkout.css";

export const metadata = { title: "Order confirmed" };

export default function CheckoutSuccessPage() {
  return (
    <section className="checkout-body">
      <div className="container">
        <div className="checkout-success">
          <div className="checkout-success-icon">
            <span className="material-symbols-outlined">check_circle</span>
          </div>
          <h1>Thank you — order received</h1>
          <p>
            Payment confirmed. We&apos;ve sent a receipt to your email and our team
            is preparing your order for delivery.
          </p>
          <div className="checkout-success-actions">
            <Link href="/product" className="cart-summary-cta">
              Continue shopping
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
            <Link href="/" className="cart-summary-ghost">
              Back home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}