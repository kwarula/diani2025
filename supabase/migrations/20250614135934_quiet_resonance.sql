/*
  # Enhanced User Profiles for Comprehensive Onboarding

  1. Schema Updates
    - Add onboarding completion tracking
    - Add user type (local/tourist) classification
    - Add tourist-specific information (country, duration, etc.)
    - Add preferences and interests
    - Add location permissions and data
    - Add language preferences

  2. New Tables
    - Enhanced profiles table with onboarding fields
    - User preferences for detailed customization

  3. Security
    - Maintain existing RLS policies
    - Ensure user data privacy
*/

-- Add new columns to profiles table for onboarding
DO $$
BEGIN
  -- Onboarding completion status
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'onboarding_completed'
  ) THEN
    ALTER TABLE profiles ADD COLUMN onboarding_completed boolean DEFAULT false;
  END IF;

  -- User type: local or tourist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'user_type'
  ) THEN
    ALTER TABLE profiles ADD COLUMN user_type text CHECK (user_type IN ('local', 'tourist'));
  END IF;

  -- Country of origin (for tourists)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'country_of_origin'
  ) THEN
    ALTER TABLE profiles ADD COLUMN country_of_origin text;
  END IF;

  -- Duration of stay (for tourists)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'duration_of_stay'
  ) THEN
    ALTER TABLE profiles ADD COLUMN duration_of_stay text;
  END IF;

  -- Duration unit (days, weeks, months)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'duration_unit'
  ) THEN
    ALTER TABLE profiles ADD COLUMN duration_unit text CHECK (duration_unit IN ('days', 'weeks', 'months'));
  END IF;

  -- Preferred language
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'preferred_language'
  ) THEN
    ALTER TABLE profiles ADD COLUMN preferred_language text DEFAULT 'English';
  END IF;

  -- Location permissions
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'location_permission_granted'
  ) THEN
    ALTER TABLE profiles ADD COLUMN location_permission_granted boolean DEFAULT false;
  END IF;

  -- Current location (if permission granted)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'current_location'
  ) THEN
    ALTER TABLE profiles ADD COLUMN current_location jsonb;
  END IF;

  -- User interests and preferences
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'interests'
  ) THEN
    ALTER TABLE profiles ADD COLUMN interests jsonb DEFAULT '[]';
  END IF;

  -- Accommodation preferences (for tourists)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'accommodation_preferences'
  ) THEN
    ALTER TABLE profiles ADD COLUMN accommodation_preferences jsonb DEFAULT '[]';
  END IF;

  -- Activity preferences
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'activity_preferences'
  ) THEN
    ALTER TABLE profiles ADD COLUMN activity_preferences jsonb DEFAULT '[]';
  END IF;

  -- Food preferences
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'food_preferences'
  ) THEN
    ALTER TABLE profiles ADD COLUMN food_preferences jsonb DEFAULT '[]';
  END IF;

  -- Budget range (for tourists)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'budget_range'
  ) THEN
    ALTER TABLE profiles ADD COLUMN budget_range text;
  END IF;

  -- Travel style (for tourists)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'travel_style'
  ) THEN
    ALTER TABLE profiles ADD COLUMN travel_style jsonb DEFAULT '[]';
  END IF;

  -- Onboarding completion timestamp
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'onboarding_completed_at'
  ) THEN
    ALTER TABLE profiles ADD COLUMN onboarding_completed_at timestamptz;
  END IF;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS profiles_user_type_idx ON profiles(user_type);
CREATE INDEX IF NOT EXISTS profiles_onboarding_completed_idx ON profiles(onboarding_completed);
CREATE INDEX IF NOT EXISTS profiles_country_of_origin_idx ON profiles(country_of_origin);
CREATE INDEX IF NOT EXISTS profiles_preferred_language_idx ON profiles(preferred_language);