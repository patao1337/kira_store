"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ProductList from "@/components/admin/ProductList";
import CategoryList from "@/components/admin/CategoryList";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("products");

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Панель адміністратора</h2>
        <div className="space-x-2">
          {activeTab === "products" && (
            <Link href="/admin/products/new">
              <Button>Додати новий товар</Button>
            </Link>
          )}
          {activeTab === "categories" && (
            <Link href="/admin/categories/new">
              <Button>Додати нову категорію</Button>
            </Link>
          )}
        </div>
      </div>

      <Tabs defaultValue="products" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="products">Товари</TabsTrigger>
          <TabsTrigger value="categories">Категорії</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <ProductList />
        </TabsContent>
        <TabsContent value="categories">
          <CategoryList />
        </TabsContent>
      </Tabs>
    </div>
  );
} 