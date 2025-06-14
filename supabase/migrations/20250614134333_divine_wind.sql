/*
  # Create chat history table

  1. New Tables
    - `chat_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles.id)
      - `message` (text) - user message or AI response
      - `is_user` (boolean) - true for user messages, false for AI responses
      - `response_data` (jsonb, nullable) - structured data from AI responses
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `chat_history` table
    - Add policy for users to manage their own chat history

  3. Indexes
    - Add index on user_id and created_at for efficient pagination
*/

CREATE TABLE IF NOT EXISTS chat_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  message text NOT NULL,
  is_user boolean NOT NULL DEFAULT true,
  response_data jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own chat history"
  ON chat_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat history"
  ON chat_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own chat history"
  ON chat_history
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS chat_history_user_id_created_at_idx ON chat_history(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS chat_history_is_user_idx ON chat_history(is_user);