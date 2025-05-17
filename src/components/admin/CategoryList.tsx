"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
import { getCategories, deleteCategory } from "@/lib/services/product.service";

interface Category {
  id: number;
  name: string;
  slug: string;
  created_at: string;
}

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        setError("Не вдалося завантажити категорії");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Ви впевнені, що хочете видалити цю категорію?")) {
      return;
    }

    try {
      const success = await deleteCategory(id);
      if (success) {
        setCategories(categories.filter(category => category.id !== id));
      } else {
        setError("Не вдалося видалити категорію");
      }
    } catch (err) {
      setError("Виникла помилка при видаленні категорії");
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Завантаження категорій...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="mb-4">Категорії не знайдено</p>
        <Link href="/admin/categories/new">
          <Button>Додати першу категорію</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Назва</TableHead>
            <TableHead>Ідентифікатор</TableHead>
            <TableHead>Створено</TableHead>
            <TableHead className="text-right">Дії</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell>{category.slug}</TableCell>
              <TableCell>
                {new Date(category.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push(`/admin/categories/${category.id}`)}
                  >
                    Редагувати
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDelete(category.id)}
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