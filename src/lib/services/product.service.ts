import { createClient } from '@supabase/supabase-js';
import { Product } from '@/types/product.types';

// Create a Supabase client for server components
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'price-asc' | 'price-desc' | 'rating-desc' | 'newest';
  limit?: number;
  offset?: number;
}

// Complete database product type that matches the table schema
export interface ProductDB {
  id?: number;
  title: string;
  description?: string;
  price: number;
  discount_amount?: number;
  discount_percentage?: number;
  rating?: number;
  src_url: string;
  gallery?: string[];
  category?: string;
  in_stock?: boolean;
  created_at?: string;
  updated_at?: string;
}

// For admin functionalities
export interface AdminProductInput {
  title: string;
  description?: string;
  price: number;
  discount_amount?: number;
  discount_percentage?: number;
  src_url: string;
  gallery?: string[];
  category?: string;
  in_stock?: boolean;
}

// Convert from Product DB format to frontend format
const mapToFrontendProduct = (item: ProductDB): Product => {
  return {
    id: item.id || 0,
    title: item.title,
    srcUrl: item.src_url,
    gallery: item.gallery || [],
    price: item.price,
    discount: {
      amount: item.discount_amount || 0,
      percentage: item.discount_percentage || 0,
    },
    rating: item.rating || 0,
  };
};

export const getProducts = async (filters?: ProductFilter): Promise<Product[]> => {
  try {
    let query = supabase
      .from('products')
      .select('*');
    
    // Apply filters
    if (filters) {
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      
      if (filters.minPrice) {
        query = query.gte('price', filters.minPrice);
      }
      
      if (filters.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }
      
      // Apply sorting
      if (filters.sort) {
        switch (filters.sort) {
          case 'price-asc':
            query = query.order('price', { ascending: true });
            break;
          case 'price-desc':
            query = query.order('price', { ascending: false });
            break;
          case 'rating-desc':
            query = query.order('rating', { ascending: false });
            break;
          case 'newest':
            query = query.order('created_at', { ascending: false });
            break;
        }
      } else {
        // Default sorting by newest
        query = query.order('created_at', { ascending: false });
      }
      
      // Apply pagination
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }
    
    // Transform the data to match the expected Product type
    return data.map(item => ({
      id: item.id,
      title: item.title,
      srcUrl: item.src_url,
      gallery: item.gallery || [],
      price: item.price,
      discount: {
        amount: item.discount_amount || 0,
        percentage: item.discount_percentage || 0,
      },
      rating: item.rating || 0,
    }));
  } catch (error) {
    console.error('Error in getProducts:', error);
    return [];
  }
};

export const getProductById = async (id: number): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching product by id:', error);
      return null;
    }
    
    if (!data) {
      return null;
    }
    
    // Transform to match Product type
    return {
      id: data.id,
      title: data.title,
      srcUrl: data.src_url,
      gallery: data.gallery || [],
      price: data.price,
      discount: {
        amount: data.discount_amount || 0,
        percentage: data.discount_percentage || 0,
      },
      rating: data.rating || 0,
    };
  } catch (error) {
    console.error('Error in getProductById:', error);
    return null;
  }
};

export const getCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error('Error in getCategories:', error);
    return [];
  }
};

export const getProductsCount = async (filters?: Omit<ProductFilter, 'limit' | 'offset'>) => {
  try {
    let query = supabase
      .from('products')
      .select('id', { count: 'exact' });
    
    // Apply filters
    if (filters) {
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      
      if (filters.minPrice) {
        query = query.gte('price', filters.minPrice);
      }
      
      if (filters.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }
    }
    
    const { count, error } = await query;
    
    if (error) {
      console.error('Error counting products:', error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error('Error in getProductsCount:', error);
    return 0;
  }
};

// ADMIN CRUD OPERATIONS

export const createProduct = async (product: AdminProductInput): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating product:', error);
      return null;
    }
    
    return mapToFrontendProduct(data);
  } catch (error) {
    console.error('Error in createProduct:', error);
    return null;
  }
};

export const updateProduct = async (id: number, product: Partial<AdminProductInput>): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating product:', error);
      return null;
    }
    
    return mapToFrontendProduct(data);
  } catch (error) {
    console.error('Error in updateProduct:', error);
    return null;
  }
};

export const deleteProduct = async (id: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting product:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    return false;
  }
};

export const getFullProductById = async (id: number): Promise<ProductDB | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching full product by id:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getFullProductById:', error);
    return null;
  }
};

// Create a new category
export const createCategory = async (name: string, slug: string): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name, slug }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating category:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in createCategory:', error);
    return null;
  }
};

// Delete a category
export const deleteCategory = async (id: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting category:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteCategory:', error);
    return false;
  }
}; 