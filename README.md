# ki•ra

A modern e-commerce clothing platform built with Next.js for diploma project.

## Overview

ki•ra is a fully responsive e-commerce clothing store that offers a seamless shopping experience. The application features a clean, intuitive interface designed for easy navigation and product discovery.

## Features

- Responsive design that works on mobile, tablet, and desktop
- Product browsing with filtering options
- Product catalog with Supabase integration
- Client and server-side filtering and sorting
- Shopping cart functionality with Redux state management
- User authentication and account management
- Profile picture upload
- Smooth animations and transitions
- User-friendly interface with modern UI components

## Technology Stack

- **Next.js** (v15.3.1) - React framework with SSR capabilities
- **React** (v19.1.0) - Frontend library
- **TypeScript** (v5) - Type-safe JavaScript
- **Redux Toolkit** (v2.2.7) - State management
- **Tailwind CSS** (v4.1.5) - Utility-first CSS framework
- **Framer Motion** (v12.9.5) - Animation library
- **ShadCN UI** - Component library based on Radix UI
- **React Icons** (v5.3.0) - Icon library
- **Supabase** - Backend services (Auth, Database, Storage)

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/kira_clothes.git
   cd kira_clothes
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   
   Create a `.env.local` file with your Supabase credentials:
   
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase:**
   
   Run the SQL schema in `supabase/schema.sql` in the Supabase SQL Editor to set up tables and security policies.

5. **Run the development server:**

   ```bash
   npm run dev
   ```

6. **Open in your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
ki•ra/
│
├── public/                # Static assets
├── supabase/              # Supabase configuration and schema
├── docs/                  # Documentation files
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── login/         # Login page
│   │   ├── register/      # Registration page
│   │   ├── account/       # User account page
│   │   └── shop/          # Shop page with product listings
│   ├── components/        # Reusable components
│   │   ├── auth/          # Authentication components
│   │   ├── shop-page/     # Shop page components
│   │   └── ui/            # UI components (including ShadCN UI)
│   └── lib/
│       ├── features/      # Redux features (cart, etc.)
│       ├── hooks/         # Custom React hooks
│       ├── services/      # Service functions for API/DB calls
│       ├── store.ts       # Redux store configuration
│       ├── supabase.ts    # Supabase client
│       ├── utils.ts       # Utility functions
│   ├── styles/            # Tailwind CSS styles
│   ├── types/             # TypeScript type definitions
│
├── components.json        # ShadCN UI configuration
├── next.config.mjs        # Next.js configuration
├── package.json           # Node.js dependencies and scripts
├── postcss.config.mjs     # Post CSS configuration
└── README.md              # Project documentation
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
```

## Authentication System

The authentication system is built using Supabase and includes:

- Email and password authentication
- User profile management
- Protected routes
- Avatar upload and storage

For detailed information about the authentication system, see [docs/auth-system.md](docs/auth-system.md).

## Product Catalog System

The product catalog system is built with Supabase and includes:

- Database tables for products and categories
- Server-side data fetching and pagination
- URL-based filtering
- Client and server-side filter options
- Multiple sorting methods

For detailed information about the product catalog system, see [docs/product-catalog.md](docs/product-catalog.md).

## Order Management System

The order management system allows users to place orders and view their order history. It includes:

- Database tables for orders and order items
- Secure handling of order data with RLS
- Functionality to create orders from the cart
- Display of order history in user accounts

For detailed information about the order management system, see [docs/order-management.md](docs/order-management.md).

## Admin Panel

The application includes an admin panel for product management with the following features:

- Product CRUD operations
- Category management
- User role-based access control
- Interactive dashboards

For detailed information about the admin panel, see [docs/admin-panel.md](docs/admin-panel.md).

## Future Enhancements

- Social login integration (Google, GitHub)
- Wishlist functionality
- Product reviews and ratings
- Payment processing integration
- Product variants (sizes, colors)
- Enhanced admin analytics

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
