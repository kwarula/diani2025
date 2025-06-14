/*
  # Create saved items table

  1. New Tables
    - `saved_items`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles.id)
      - `item_id` (text) - external item identifier
      - `title` (text)
      - `description` (text)
      - `category` (text)
      - `location` (text, nullable)
      - `image_url` (text, nullable)
      - `phone` (text, nullable)
      - `website` (text, nullable)
      - `rating` (numeric, nullable)
      - `price` (text, nullable)
      - `metadata` (jsonb, nullable) - for additional data
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `saved_items` table
    - Add policy for users to manage their own saved items

  3. Indexes
    - Add index on user_id for faster queries
    - Add unique constraint on user_id + item_id to prevent duplicates
*/

CREATE TABLE IF NOT EXISTS saved_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  item_id text NOT NULL,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'General',
  location text,
  image_url text,
  phone text,
  website text,
  rating numeric(3,2),
  price text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, item_id)
);

-- Enable RLS
ALTER TABLE saved_items ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own saved items"
  ON saved_items
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved items"
  ON saved_items
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own saved items"
  ON saved_items
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved items"
  ON saved_items
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS saved_items_user_id_idx ON saved_items(user_id);
CREATE INDEX IF NOT EXISTS saved_items_category_idx ON saved_items(category);
CREATE INDEX IF NOT EXISTS saved_items_created_at_idx ON saved_items(created_at DESC);

-- Trigger to update updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_saved_items_updated_at'
  ) THEN
    CREATE TRIGGER update_saved_items_updated_at
      BEFORE UPDATE ON saved_items
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;