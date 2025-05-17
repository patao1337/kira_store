"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  createProduct, 
  updateProduct, 
  getCategories, 
  getFullProductById,
  AdminProductInput,
  ProductDB
} from "@/lib/services/product.service";

interface ProductFormProps {
  productId?: number;
}

export default function ProductForm({ productId }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!productId;
  
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [categories, setCategories] = useState<{id: number, name: string, slug: string}[]>([]);
  
  const [formData, setFormData] = useState<AdminProductInput>({
    title: "",
    description: "",
    price: 0,
    discount_amount: 0,
    discount_percentage: 0,
    src_url: "",
    gallery: [],
    category: "",
    in_stock: true
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    const fetchProduct = async () => {
      if (productId) {
        try {
          const product = await getFullProductById(productId);
          if (product) {
            setFormData({
              title: product.title,
              description: product.description || "",
              price: product.price,
              discount_amount: product.discount_amount || 0,
              discount_percentage: product.discount_percentage || 0,
              src_url: product.src_url,
              gallery: product.gallery || [],
              category: product.category || "",
              in_stock: product.in_stock !== undefined ? product.in_stock : true
            });
          } else {
            setError("Товар не знайдено");
          }
        } catch (err) {
          console.error("Error fetching product:", err);
          setError("Не вдалося завантажити дані товару");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCategories();
    fetchProduct();
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: checkbox.checked
      });
    } else if (type === "number") {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // Split by commas and trim whitespace
    const gallery = value
      .split(",")
      .map(url => url.trim())
      .filter(url => url !== "");
    
    setFormData({
      ...formData,
      gallery
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      if (isEditing) {
        await updateProduct(productId, formData);
        setSuccess("Товар успішно оновлено!");
      } else {
        await createProduct(formData);
        setSuccess("Товар успішно створено!");
        // Reset form after successful creation
        setFormData({
          title: "",
          description: "",
          price: 0,
          discount_amount: 0,
          discount_percentage: 0,
          src_url: "",
          gallery: [],
          category: "",
          in_stock: true
        });
      }
    } catch (err) {
      console.error("Error saving product:", err);
      setError("Не вдалося зберегти товар");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Завантаження даних товару...</div>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? "Редагувати товар" : "Додати новий товар"}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Назва товару*
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Опис
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              ></textarea>
            </div>
            
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Ціна*
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="discount_amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Сума знижки
                </label>
                <input
                  type="number"
                  id="discount_amount"
                  name="discount_amount"
                  value={formData.discount_amount}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="discount_percentage" className="block text-sm font-medium text-gray-700 mb-1">
                  Відсоток знижки
                </label>
                <input
                  type="number"
                  id="discount_percentage"
                  name="discount_percentage"
                  value={formData.discount_percentage}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="src_url" className="block text-sm font-medium text-gray-700 mb-1">
                URL головного зображення*
              </label>
              <input
                type="url"
                id="src_url"
                name="src_url"
                value={formData.src_url}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              {formData.src_url && (
                <div className="mt-2 relative h-40 w-full overflow-hidden rounded-md">
                  <Image 
                    src={formData.src_url} 
                    alt="Перегляд товару"
                    fill
                    style={{ objectFit: "contain" }}
                    className="border border-gray-200 rounded-md"
                  />
                </div>
              )}
            </div>
            
            <div>
              <label htmlFor="gallery" className="block text-sm font-medium text-gray-700 mb-1">
                URL зображень галереї (розділені комами)
              </label>
              <input
                type="text"
                id="gallery"
                name="gallery"
                value={formData.gallery?.join(", ")}
                onChange={handleGalleryChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <div className="text-xs text-gray-500 mt-1">
                Введіть URL зображень, розділені комами
              </div>
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Категорія
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Виберіть категорію</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="in_stock"
                name="in_stock"
                checked={formData.in_stock}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="in_stock" className="ml-2 block text-sm text-gray-700">
                В наявності
              </label>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4 mt-8">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Збереження..." : isEditing ? "Оновити товар" : "Створити товар"}
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