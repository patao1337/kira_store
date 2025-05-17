-- Create a table for user profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  username TEXT,
  avatar_url TEXT,
  phone TEXT,
  address TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Set up row level security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create security policies
-- Only authenticated users can view their own profile
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Only authenticated users can update their own profile
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Create a function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, created_at)
  VALUES (new.id, new.email, now());
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call the function when a new user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Set up storage for profile avatars
INSERT INTO storage.buckets (id, name, public) VALUES ('profiles', 'profiles', true);

-- Create storage policy for avatars
CREATE POLICY "Avatar images are publicly accessible." 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'profiles');

-- Allow users to upload avatar files to their own folder
CREATE POLICY "Users can upload their own avatar." 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'profiles' AND (storage.foldername(name))[1] = 'avatars');

-- Allow users to update their own avatar
CREATE POLICY "Users can update their own avatar." 
  ON storage.objects FOR UPDATE 
  USING (bucket_id = 'profiles' AND auth.uid()::text = (storage.foldername(name))[2]);

-- Allow users to delete their own avatar
CREATE POLICY "Users can delete their own avatar." 
  ON storage.objects FOR DELETE 
  USING (bucket_id = 'profiles' AND auth.uid()::text = (storage.foldername(name))[2]);

-- Products Table
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

-- Categories Table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Allow public read access on products" 
ON products FOR SELECT USING (true);

CREATE POLICY "Allow public read access on categories" 
ON categories FOR SELECT USING (true);

-- Admin RLS policies for products management

-- Admin can insert products
CREATE POLICY "Admins can insert products" ON products 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
  )
);

-- Admin can update products
CREATE POLICY "Admins can update products" ON products 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
  )
);

-- Admin can delete products
CREATE POLICY "Admins can delete products" ON products 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
  )
);

-- Admin RLS policies for categories management

-- Admin can insert categories
CREATE POLICY "Admins can insert categories" ON categories 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
  )
);

-- Admin can update categories
CREATE POLICY "Admins can update categories" ON categories 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
  )
);

-- Admin can delete categories
CREATE POLICY "Admins can delete categories" ON categories 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
  )
);

-- Insert some sample categories
INSERT INTO categories (name, slug) VALUES
('T-Shirts', 't-shirts'),
('Jeans', 'jeans'),
('Shorts', 'shorts'),
('Shirts', 'shirts'),
('Polos', 'polos');

-- Insert sample products
INSERT INTO products (title, description, price, discount_percentage, rating, src_url, gallery, category) VALUES
('Футболка з декоративними деталями', 'Стильна футболка з унікальними декоративними елементами', 120, 0, 4.5, '/images/pic1.png', ARRAY['/images/pic1.png', '/images/pic10.png', '/images/pic11.png'], 'T-Shirts'),
('Джинси скінні', 'Класичні скінні джинси, що підкреслюють фігуру', 260, 20, 3.5, '/images/pic2.png', ARRAY['/images/pic2.png'], 'Jeans'),
('Сорочка в клітинку', 'Стильна сорочка в клітинку, ідеальна для повсякденного вжитку', 180, 0, 4.5, '/images/pic3.png', ARRAY['/images/pic3.png'], 'Shirts'),
('Футболка в смужку', 'Стильна футболка в смужку з якісного матеріалу', 160, 30, 4.5, '/images/pic4.png', ARRAY['/images/pic4.png', '/images/pic10.png', '/images/pic11.png'], 'T-Shirts'),
('Сорочка з вертикальними смужками', 'Елегантна сорочка з вертикальними смужками', 232, 20, 5.0, '/images/pic5.png', ARRAY['/images/pic5.png', '/images/pic10.png', '/images/pic11.png'], 'Shirts'),
('Футболка з графічним принтом', 'Стильна футболка з модним графічним принтом', 145, 0, 4.0, '/images/pic6.png', ARRAY['/images/pic6.png', '/images/pic10.png', '/images/pic11.png'], 'T-Shirts'),
('Вільні шорти-бермуди', 'Комфортні шорти-бермуди для літнього сезону', 80, 0, 3.0, '/images/pic7.png', ARRAY['/images/pic7.png'], 'Shorts'),
('Потерті джинси скінні', 'Модні потерті джинси скінні з якісного деніму', 210, 0, 4.5, '/images/pic8.png', ARRAY['/images/pic8.png'], 'Jeans'),
('Поло з контрастною окантовкою', 'Елегантне поло з контрастними деталями', 242, 20, 4.0, '/images/pic12.png', ARRAY['/images/pic12.png', '/images/pic10.png', '/images/pic11.png'], 'Polos'),
('Футболка з градієнтним принтом', 'Яскрава футболка з стильним градієнтним принтом', 145, 0, 3.5, '/images/pic13.png', ARRAY['/images/pic13.png', '/images/pic10.png', '/images/pic11.png'], 'T-Shirts'),
('Поло з декоративними деталями', 'Стильне поло з декоративними елементами', 180, 0, 4.5, '/images/pic14.png', ARRAY['/images/pic14.png'], 'Polos'),
('Футболка в чорну смужку', 'Класична футболка в смужку чорного кольору', 150, 30, 5.0, '/images/pic15.png', ARRAY['/images/pic15.png'], 'T-Shirts');

-- Create update_updated_at function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Orders Table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    shipping_address JSONB NOT NULL,
    billing_address JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Items Table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    product_id INTEGER REFERENCES products(id) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price_at_purchase DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security for orders and order_items
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Policies for Orders Table
-- Users can view their own orders
CREATE POLICY "Users can view their own orders"
ON orders FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own orders
CREATE POLICY "Users can create their own orders"
ON orders FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins can view all orders
CREATE POLICY "Admins can view all orders" 
ON orders FOR SELECT 
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
  )
);

-- Admins can update any order
CREATE POLICY "Admins can update any order" 
ON orders FOR UPDATE 
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
  )
);

-- Users can update their own orders (e.g., for cancellation if status is 'pending')
CREATE POLICY "Users can update their own pending orders"
ON orders FOR UPDATE
USING (auth.uid() = user_id AND status = 'pending')
WITH CHECK (auth.uid() = user_id);

-- Policies for Order Items Table
-- Users can view order items belonging to their orders
CREATE POLICY "Users can view their own order items"
ON order_items FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM orders
    WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
  )
);

-- Admins can view all order items
CREATE POLICY "Admins can view all order items" 
ON order_items FOR SELECT 
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
  )
);

-- Users can create order items for their own orders
CREATE POLICY "Users can create order items for their own orders"
ON order_items FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM orders
    WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
  )
);

-- Trigger to update 'updated_at' timestamp for orders
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Admin utility functions

-- Create function to promote a user to admin
CREATE OR REPLACE FUNCTION promote_to_admin(user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles
  SET is_admin = TRUE
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to demote a user from admin
CREATE OR REPLACE FUNCTION demote_from_admin(user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles
  SET is_admin = FALSE
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql; 