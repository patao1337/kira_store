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
import { supabase } from "@/lib/supabase";

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
  const [uploading, setUploading] = useState(false);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  
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

  const uploadImage = async (file: File, folder: string = "main"): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}-${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return null;
      }

      const { data } = supabase.storage.from('products').getPublicUrl(fileName);
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

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

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMainImageFile(e.target.files[0]);
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setGalleryFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      let updatedFormData = { ...formData };

      // Upload main image if a new file is selected
      if (mainImageFile) {
        const mainImageUrl = await uploadImage(mainImageFile, "main");
        if (mainImageUrl) {
          updatedFormData.src_url = mainImageUrl;
        } else {
          throw new Error("Не вдалося завантажити головне зображення");
        }
      }

      // Upload gallery images if new files are selected
      if (galleryFiles.length > 0) {
        const galleryUrls = [];
        for (const file of galleryFiles) {
          const url = await uploadImage(file, "gallery");
          if (url) {
            galleryUrls.push(url);
          }
        }
        
        if (galleryUrls.length > 0) {
          // If editing, append to existing gallery, otherwise replace
          if (isEditing) {
            updatedFormData.gallery = [...(formData.gallery || []), ...galleryUrls];
          } else {
            updatedFormData.gallery = galleryUrls;
          }
        }
      }

      if (isEditing) {
        await updateProduct(productId, updatedFormData);
        setSuccess("Товар успішно оновлено!");
      } else {
        await createProduct(updatedFormData);
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
        setMainImageFile(null);
        setGalleryFiles([]);
      }
    } catch (err) {
      console.error("Error saving product:", err);
      setError(err instanceof Error ? err.message : "Не вдалося зберегти товар");
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    const newGallery = [...(formData.gallery || [])];
    newGallery.splice(index, 1);
    setFormData({
      ...formData,
      gallery: newGallery
    });
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
          
          <div className="space-y-4">
            {/* Main Image Upload */}
            <div>
              <label htmlFor="main_image" className="block text-sm font-medium text-gray-700 mb-1">
                Головне зображення*
              </label>
              <input
                type="file"
                id="main_image"
                accept="image/*"
                onChange={handleMainImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <div className="text-xs text-gray-500 mt-1">
                Завантажте зображення (JPG, PNG, WebP)
              </div>
              
              {/* Current main image preview */}
              {(formData.src_url || mainImageFile) && (
                <div className="mt-2 relative h-40 w-full overflow-hidden rounded-md">
                  <Image 
                    src={mainImageFile ? URL.createObjectURL(mainImageFile) : formData.src_url} 
                    alt="Перегляд товару"
                    fill
                    style={{ objectFit: "contain" }}
                    className="border border-gray-200 rounded-md"
                  />
                </div>
              )}
            </div>
            
            {/* Gallery Images Upload */}
            <div>
              <label htmlFor="gallery_images" className="block text-sm font-medium text-gray-700 mb-1">
                Зображення галереї
              </label>
              <input
                type="file"
                id="gallery_images"
                accept="image/*"
                multiple
                onChange={handleGalleryChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <div className="text-xs text-gray-500 mt-1">
                Виберіть кілька зображень для галереї
              </div>
              
              {/* Current gallery images */}
              {formData.gallery && formData.gallery.length > 0 && (
                <div className="mt-2">
                  <div className="text-sm font-medium text-gray-700 mb-2">Поточні зображення галереї:</div>
                  <div className="grid grid-cols-2 gap-2">
                    {formData.gallery.map((url, index) => (
                      <div key={index} className="relative">
                        <div className="relative h-20 w-full overflow-hidden rounded-md">
                          <Image 
                            src={url} 
                            alt={`Галерея ${index + 1}`}
                            fill
                            style={{ objectFit: "cover" }}
                            className="border border-gray-200 rounded-md"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(index)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Preview new gallery images */}
              {galleryFiles.length > 0 && (
                <div className="mt-2">
                  <div className="text-sm font-medium text-gray-700 mb-2">Нові зображення для завантаження:</div>
                  <div className="grid grid-cols-2 gap-2">
                    {galleryFiles.map((file, index) => (
                      <div key={index} className="relative h-20 w-full overflow-hidden rounded-md">
                        <Image 
                          src={URL.createObjectURL(file)} 
                          alt={`Нове ${index + 1}`}
                          fill
                          style={{ objectFit: "cover" }}
                          className="border border-gray-200 rounded-md"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex gap-4 mt-8">
          <button
            type="submit"
            disabled={submitting || uploading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? "Завантаження зображень..." : submitting ? "Збереження..." : isEditing ? "Оновити товар" : "Створити товар"}
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