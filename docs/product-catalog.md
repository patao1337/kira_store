# Product Catalog System

This document provides an overview of the product catalog system implemented in the ki•ra e-commerce platform.

## Database Schema

The product catalog system is built on Supabase and includes the following tables:

### Products Table

```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    discount_percentage INTEGER DEFAULT 0,
    rating DECIMAL(2, 1) DEFAULT 0,
    src_url TEXT NOT NULL,
    gallery TEXT[] DEFAULT '{}'::TEXT[],
    category TEXT,
    in_stock BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Categories Table

```sql
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Data Structure

The product catalog uses the following data structures:

- **Product**: Represents a single product with properties including title, price, discount, images, etc.
- **Category**: Represents a product category with name and slug.

## Components

The product catalog system includes the following key components:

1. **Product Service** (`src/lib/services/product.service.ts`): Provides functions to interact with the Supabase database for product data.
2. **Shop Page** (`src/app/shop/page.tsx`): Server component that displays products with filtering and pagination.
3. **Product Card** (`src/components/common/ProductCard.tsx`): Displays a product with image, title, rating, and price.
4. **Filter System**: A combination of server-side and client-side filtering components:
   - Server-side categories from the database
   - Client-side filtering for price, colors, sizes, and styles

## Features

The product catalog system includes the following features:

1. **Product Browsing**: Users can browse products with pagination.
2. **Filtering**: Users can filter products by:
   - Category (server-side)
   - Price range (client-side)
   - Colors (client-side)
   - Sizes (client-side)
   - Dress styles (client-side)
3. **Sorting**: Products can be sorted by:
   - Newest
   - Price (low to high)
   - Price (high to low)
   - Rating (high to low)
4. **Pagination**: Products are paginated with configurable page size.

## Implementation Details

### Server-Side Data Fetching

Products are fetched server-side using the `getProducts` function from the product service:

```typescript
// Fetch products with pagination and filters
const products = await getProducts({
  category,
  sort,
  limit: PAGE_SIZE,
  offset,
});
```

### URL-Based Filtering

The shop page uses URL parameters to maintain filter state, allowing for:
- Shareable filter URLs
- Preservation of filters on refresh
- Clean browser history

### Filter Types

1. **Server-side filters**: Applied directly in database queries (category, sorting, pagination)
2. **Client-side filters**: Applied in the browser (colors, sizes, styles)

## Adding New Products

New products can be added through the Supabase dashboard or by running SQL INSERT statements.

## Future Enhancements

Planned enhancements for the product catalog system:

1. Advanced search functionality
2. Product recommendations
3. Recently viewed products
4. Wish list integration
5. Stock management
6. Product variants (sizes, colors)
7. Admin panel for product management 