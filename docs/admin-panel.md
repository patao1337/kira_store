# Admin Panel Documentation

This document provides an overview of the admin panel implementation in the ki•ra e-commerce platform.

## Overview

The admin panel provides a secure interface for administrators to manage products and categories. It includes:

- Product management (CRUD operations)
- Category management (CRUD operations)
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
3. Utility functions to promote/demote admin users

## Features

### Product Management

Administrators can:

- View a list of all products with key information
- Create new products with comprehensive details
- Edit existing products
- Delete products

Product data includes:
- Title
- Description
- Price
- Discount information
- Images (main image and gallery)
- Category
- Inventory status

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
- Supabase for data storage and authentication
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
- `ProductForm.tsx` - Form for creating and editing products
- `CategoryForm.tsx` - Form for creating and editing categories

## Services

The admin functionality is powered by these service functions:

- `createProduct()` - Creates a new product
- `updateProduct()` - Updates an existing product
- `deleteProduct()` - Deletes a product
- `getFullProductById()` - Gets complete product details for editing
- `createCategory()` - Creates a new category
- `deleteCategory()` - Deletes a category

## Future Enhancements

Planned enhancements for the admin panel:

1. Proper role-based access control with multiple roles
2. Bulk operations for products
3. Image upload functionality
4. Order management
5. User management
6. Sales dashboards and analytics
7. Inventory management
8. Color and size variant management 