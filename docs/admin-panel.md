# Admin Panel Documentation

This document provides an overview of the admin panel implementation in the ki•ra e-commerce platform.

## Overview

The admin panel provides a secure interface for administrators to manage products and categories. It includes:

- Product management (CRUD operations)
- Category management (CRUD operations)
- Image upload functionality for products
- Authentication and authorization controls

## Access Control

The admin panel is protected by authentication and authorization checks:

1. Users must be logged in to access the admin panel
2. Users must have admin privileges, determined by the `is_admin` field in the profiles table

To make a user an admin, run the following SQL function:
```sql
SELECT promote_to_admin('user-uuid-here');
```

## Database Schema

The admin panel requires several database tables and security policies, all of which are included in the main `schema.sql` file. Key components include:

1. The `is_admin` field in the `profiles` table
2. Row-Level Security (RLS) policies that allow admins to perform CRUD operations
3. Storage buckets and policies for image uploads
4. Utility functions to promote/demote admin users

## Storage Setup

The admin panel uses Supabase Storage for image uploads. To set up storage for product images, run the following SQL in the Supabase SQL Editor:

```sql
-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true);

-- Create storage policy for product images - publicly accessible
CREATE POLICY "Product images are publicly accessible" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'products');

-- Allow admins to upload product images
CREATE POLICY "Admins can upload product images" 
  ON storage.objects FOR INSERT 
  WITH CHECK (
    bucket_id = 'products' AND 
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
    )
  );

-- Allow admins to update product images
CREATE POLICY "Admins can update product images" 
  ON storage.objects FOR UPDATE 
  USING (
    bucket_id = 'products' AND 
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
    )
  );

-- Allow admins to delete product images
CREATE POLICY "Admins can delete product images" 
  ON storage.objects FOR DELETE 
  USING (
    bucket_id = 'products' AND 
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
    )
  );
```

## Features

### Product Management

Administrators can:

- View a list of all products with key information
- Create new products with comprehensive details
- Edit existing products
- Delete products
- Upload and manage product images

Product data includes:
- Title
- Description
- Price
- Discount information
- Main product image (uploaded via file input)
- Gallery images (multiple uploads supported)
- Category
- Inventory status

### Image Upload System

The admin panel includes a comprehensive image upload system:

**Main Image Upload:**
- Single file upload for the primary product image
- Real-time preview of selected image
- Automatic upload to Supabase Storage during form submission
- Images stored in the `products/main/` folder

**Gallery Images Upload:**
- Multiple file selection for product gallery
- Preview grid showing all selected images
- Ability to remove existing gallery images
- New images are appended to existing gallery when editing
- Images stored in the `products/gallery/` folder

**Image Management Features:**
- Support for JPG, PNG, and WebP formats
- Automatic file naming with timestamps to prevent conflicts
- Public URL generation for uploaded images
- Visual feedback during upload process
- Error handling for failed uploads

### Category Management

Administrators can:

- View a list of all categories
- Create new categories with name and slug
- Edit existing categories
- Delete categories

## Implementation Details

The admin panel is built using:

- Next.js App Router for routing
- Client Components with React hooks for state management
- Supabase for data storage, authentication, and file storage
- ShadCN UI components for the interface

## Routes

- `/admin` - Main admin dashboard with tabs for products and categories
- `/admin/products/new` - Form to create a new product
- `/admin/products/[id]` - Form to edit an existing product
- `/admin/categories/new` - Form to create a new category
- `/admin/categories/[id]` - Form to edit an existing category

## Components

Key components include:

- `ProductList.tsx` - Displays all products in a table with action buttons
- `CategoryList.tsx` - Displays all categories in a table with action buttons
- `ProductForm.tsx` - Form for creating and editing products with image upload functionality
- `CategoryForm.tsx` - Form for creating and editing categories

## Services

The admin functionality is powered by these service functions:

- `createProduct()` - Creates a new product
- `updateProduct()` - Updates an existing product
- `deleteProduct()` - Deletes a product
- `getFullProductById()` - Gets complete product details for editing
- `createCategory()` - Creates a new category
- `deleteCategory()` - Deletes a category

## Technical Details

### Image Upload Process

1. **File Selection**: Users select images using HTML file input elements
2. **Preview**: Selected images are immediately previewed using `URL.createObjectURL()`
3. **Upload**: On form submission, files are uploaded to Supabase Storage
4. **Naming**: Files are renamed with timestamp and random component to avoid conflicts
5. **URL Generation**: Public URLs are generated and stored in the database
6. **Database Update**: Product records are updated with new image URLs

### Error Handling

The system includes comprehensive error handling for:
- File upload failures
- Network connectivity issues
- Invalid file formats
- Storage permission errors
- Database update failures

## Future Enhancements

Planned enhancements for the admin panel:

1. Image compression and optimization
2. Bulk image operations
3. Image cropping and editing tools
4. Order management
5. User management
6. Sales dashboards and analytics
7. Inventory management
8. Color and size variant management
9. Advanced image metadata management
10. Image CDN integration for better performance 