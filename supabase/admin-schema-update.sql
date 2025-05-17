-- THIS FILE IS DEPRECATED
-- The contents of this file have been integrated into the main schema.sql file.
-- Please use schema.sql for a complete database setup including admin functionality.
--
-- The schema.sql file now includes:
-- 1. is_admin field in the profiles table
-- 2. Admin RLS policies for products and categories
-- 3. Utility functions for promoting/demoting admins

-- Add is_admin field to profiles table
ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;

-- Create admin RLS policies for products

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

-- Create admin RLS policies for categories

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