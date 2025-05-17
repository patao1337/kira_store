"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { createCategory } from "@/lib/services/product.service";

interface CategoryFormProps {
  categoryId?: number;
}

export default function CategoryForm({ categoryId }: CategoryFormProps) {
  const router = useRouter();
  const isEditing = !!categoryId;
  
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    slug: ""
  });

  useEffect(() => {
    const fetchCategory = async () => {
      if (categoryId) {
        try {
          const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('id', categoryId)
            .single();
          
          if (error) {
            throw error;
          }
          
          if (data) {
            setFormData({
              name: data.name,
              slug: data.slug
            });
          } else {
            setError("Категорію не знайдено");
          }
        } catch (err) {
          console.error("Error fetching category:", err);
          setError("Не вдалося завантажити дані категорії");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCategory();
  }, [categoryId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Auto-generate slug when name changes
    if (name === "name") {
      setFormData({
        ...formData,
        name: value,
        slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      if (isEditing) {
        const { error } = await supabase
          .from('categories')
          .update({
            name: formData.name,
            slug: formData.slug
          })
          .eq('id', categoryId);
        
        if (error) {
          throw error;
        }
        
        setSuccess("Категорію успішно оновлено!");
      } else {
        await createCategory(formData.name, formData.slug);
        setSuccess("Категорію успішно створено!");
        // Reset form after successful creation
        setFormData({
          name: "",
          slug: ""
        });
      }
    } catch (err) {
      console.error("Error saving category:", err);
      setError("Не вдалося зберегти категорію");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Завантаження даних категорії...</div>;
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? "Редагувати категорію" : "Додати нову категорію"}
      </h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-500 rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-4 bg-green-50 text-green-500 rounded-md">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Назва категорії*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
              Ідентифікатор*
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              pattern="[a-z0-9-]+"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="text-xs text-gray-500 mt-1">
              URL-дружня версія назви категорії (тільки літери, цифри та дефіси)
            </div>
          </div>
        </div>
        
        <div className="flex gap-4 mt-8">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Збереження..." : isEditing ? "Оновити категорію" : "Створити категорію"}
          </button>
          
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Скасувати
          </button>
        </div>
      </form>
    </div>
  );
} 