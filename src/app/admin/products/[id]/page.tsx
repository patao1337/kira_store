"use client";

import { useParams } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";

export default function EditProductPage() {
  const params = useParams();
  const productId = parseInt(params.id as string, 10);

  return <ProductForm productId={productId} />;
} 