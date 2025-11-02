/*
  # E-commerce Platform Database Schema

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `image_url` (text)
      - `created_at` (timestamp)
    
    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (decimal)
      - `category_id` (uuid, foreign key)
      - `image_url` (text)
      - `stock_quantity` (integer)
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `product_images`
      - `id` (uuid, primary key)
      - `product_id` (uuid, foreign key)
      - `image_url` (text)
      - `alt_text` (text)
      - `sort_order` (integer)
    
    - `cart_items`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `product_id` (uuid, foreign key)
      - `quantity` (integer)
      - `created_at` (timestamp)
    
    - `orders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `total_amount` (decimal)
      - `status` (text)
      - `shipping_address` (jsonb)
      - `created_at` (timestamp)
    
    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key)
      - `product_id` (uuid, foreign key)
      - `quantity` (integer)
      - `price` (decimal)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for public read access to products and categories
*/

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text DEFAULT '',
  image_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  price decimal(10,2) NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  image_url text DEFAULT '',
  stock_quantity integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Product images table
CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  alt_text text DEFAULT '',
  sort_order integer DEFAULT 0
);

-- Cart items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount decimal(10,2) NOT NULL,
  status text DEFAULT 'pending',
  shipping_address jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL,
  price decimal(10,2) NOT NULL
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Policies for categories (public read)
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  TO public
  USING (true);

-- Policies for products (public read)
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  TO public
  USING (is_active = true);

-- Policies for product images (public read)
CREATE POLICY "Product images are viewable by everyone"
  ON product_images FOR SELECT
  TO public
  USING (true);

-- Policies for cart items (user-specific)
CREATE POLICY "Users can view own cart items"
  ON cart_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart items"
  ON cart_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart items"
  ON cart_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart items"
  ON cart_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for orders (user-specific)
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies for order items (user-specific through orders)
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Insert sample data
INSERT INTO categories (name, description, image_url) VALUES
  ('Electronics', 'Latest electronic devices and gadgets', 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg'),
  ('Clothing', 'Fashionable clothing for all occasions', 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg'),
  ('Home & Garden', 'Everything for your home and garden', 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg'),
  ('Sports & Fitness', 'Equipment for sports and fitness activities', 'https://images.pexels.com/photos/416717/pexels-photo-416717.jpeg');

INSERT INTO products (name, description, price, category_id, image_url, stock_quantity) VALUES
  ('Premium Wireless Headphones', 'High-quality wireless headphones with noise cancellation', 299.99, (SELECT id FROM categories WHERE name = 'Electronics'), 'https://images.pexels.com/photos/3587478/pexels-photo-3587478.jpeg', 50),
  ('Smart Watch Pro', 'Advanced smartwatch with fitness tracking', 399.99, (SELECT id FROM categories WHERE name = 'Electronics'), 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg', 30),
  ('Designer Jacket', 'Stylish and comfortable designer jacket', 149.99, (SELECT id FROM categories WHERE name = 'Clothing'), 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg', 25),
  ('Running Shoes', 'Lightweight running shoes for optimal performance', 129.99, (SELECT id FROM categories WHERE name = 'Sports & Fitness'), 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg', 40),
  ('Ergonomic Office Chair', 'Comfortable office chair with lumbar support', 249.99, (SELECT id FROM categories WHERE name = 'Home & Garden'), 'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg', 15),
  ('Fitness Tracker', 'Advanced fitness tracker with heart rate monitor', 79.99, (SELECT id FROM categories WHERE name = 'Sports & Fitness'), 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg', 60);