import { Header } from "@/components/layout/Header";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import "@/styles/marketing.css";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <Nav />
      <main>{children}</main>
      <Footer />
    </>
  );
}