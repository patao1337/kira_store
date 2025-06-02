import ProductListSec from "@/components/common/ProductListSec";
import BreadcrumbProduct from "@/components/product-page/BreadcrumbProduct";
import Header from "@/components/product-page/Header";
import Tabs from "@/components/product-page/Tabs";
import { Product } from "@/types/product.types";
import { notFound } from "next/navigation";
import { getProductById, getProducts } from "@/lib/services/product.service";
import { relatedProductData } from "@/app/page"; // Keep static data for related products for now

// Type for the resolved params
type PageParams = { slug: string[] };

// Make the component async and adjust props type
export default async function ProductPage({
  params,
}: {
  // Params are now a Promise
  params: Promise<PageParams>;
}) {
  // Await the params before accessing them
  const resolvedParams = await params;
  const productId = Number(resolvedParams.slug[0]);

  // Fetch the product from Supabase
  const productData = await getProductById(productId);

  if (!productData?.title) {
    notFound();
  }

  return (
    <main>
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
        <BreadcrumbProduct title={productData?.title ?? "product"} />
        <section className="mb-11">
          <Header data={productData} />
        </section>
        <Tabs />
      </div>
      <div className="mb-[50px] sm:mb-20">
        <ProductListSec title="Вам Сподобається:" data={relatedProductData} />
      </div>
    </main>
  );
}
