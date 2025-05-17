"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getProducts, deleteProduct } from "@/lib/services/product.service";
import { Product } from "@/types/product.types";

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts({ limit: 100 }); // Load up to 100 products
        setProducts(data);
      } catch (err) {
        setError("Не вдалося завантажити товари");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Ви впевнені, що хочете видалити цей товар?")) {
      return;
    }

    try {
      const success = await deleteProduct(id);
      if (success) {
        setProducts(products.filter(product => product.id !== id));
      } else {
        setError("Не вдалося видалити товар");
      }
    } catch (err) {
      setError("Виникла помилка при видаленні товару");
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Завантаження товарів...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="mb-4">Товари не знайдено</p>
        <Link href="/admin/products/new">
          <Button>Додати перший товар</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Зображення</TableHead>
            <TableHead>Назва</TableHead>
            <TableHead>Ціна</TableHead>
            <TableHead>Знижка</TableHead>
            <TableHead>Рейтинг</TableHead>
            <TableHead className="text-right">Дії</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="relative h-12 w-12 overflow-hidden rounded-md">
                  <Image 
                    src={product.srcUrl} 
                    alt={product.title}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </TableCell>
              <TableCell className="font-medium">{product.title}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>
                {product.discount.percentage > 0 ? `${product.discount.percentage}%` : "-"}
              </TableCell>
              <TableCell>{product.rating.toFixed(1)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push(`/admin/products/${product.id}`)}
                  >
                    Редагувати
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                  >
                    Видалити
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 