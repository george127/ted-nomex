export const instant = false;

import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getProduct, getRelatedProducts } from "@/modules/shop/products/service";
import { ProductDetail } from "@/components/marketing/shop/ProductDetail";
import "@/styles/product.css";

type Props = { params: Promise<{ slug: string }> };

async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return notFound();
  let related: Awaited<ReturnType<typeof getRelatedProducts>> = [];
  try { related = await getRelatedProducts(slug, 3); } catch {}
  return <ProductDetail product={product} related={related} />;
}

export default function ProductSinglePage({ params }: Props) {
  return (
    <Suspense fallback={<div style={{ padding: 80, textAlign: "center" }}>Loading…</div>}>
      <ProductPage params={params} />
    </Suspense>
  );
}