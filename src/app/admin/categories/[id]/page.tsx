"use client";

import { useParams } from "next/navigation";
import CategoryForm from "@/components/admin/CategoryForm";

export default function EditCategoryPage() {
  const params = useParams();
  const categoryId = parseInt(params.id as string, 10);

  return <CategoryForm categoryId={categoryId} />;
} 