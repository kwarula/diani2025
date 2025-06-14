export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          preferences: Json | null;
          created_at: string;
          updated_at: string;
          // Onboarding fields
          onboarding_completed: boolean;
          user_type: 'local' | 'tourist' | null;
          country_of_origin: string | null;
          duration_of_stay: string | null;
          duration_unit: 'days' | 'weeks' | 'months' | null;
          preferred_language: string;
          location_permission_granted: boolean;
          current_location: Json | null;
          interests: Json;
          accommodation_preferences: Json;
          activity_preferences: Json;
          food_preferences: Json;
          budget_range: string | null;
          travel_style: Json;
          onboarding_completed_at: string | null;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          preferences?: Json | null;
          created_at?: string;
          updated_at?: string;
          onboarding_completed?: boolean;
          user_type?: 'local' | 'tourist' | null;
          country_of_origin?: string | null;
          duration_of_stay?: string | null;
          duration_unit?: 'days' | 'weeks' | 'months' | null;
          preferred_language?: string;
          location_permission_granted?: boolean;
          current_location?: Json | null;
          interests?: Json;
          accommodation_preferences?: Json;
          activity_preferences?: Json;
          food_preferences?: Json;
          budget_range?: string | null;
          travel_style?: Json;
          onboarding_completed_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          preferences?: Json | null;
          created_at?: string;
          updated_at?: string;
          onboarding_completed?: boolean;
          user_type?: 'local' | 'tourist' | null;
          country_of_origin?: string | null;
          duration_of_stay?: string | null;
          duration_unit?: 'days' | 'weeks' | 'months' | null;
          preferred_language?: string;
          location_permission_granted?: boolean;
          current_location?: Json | null;
          interests?: Json;
          accommodation_preferences?: Json;
          activity_preferences?: Json;
          food_preferences?: Json;
          budget_range?: string | null;
          travel_style?: Json;
          onboarding_completed_at?: string | null;
        };
      };
      saved_items: {
        Row: {
          id: string;
          user_id: string;
          item_id: string;
          title: string;
          description: string;
          category: string;
          location: string | null;
          image_url: string | null;
          phone: string | null;
          website: string | null;
          rating: number | null;
          price: string | null;
          metadata: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          item_id: string;
          title: string;
          description: string;
          category: string;
          location?: string | null;
          image_url?: string | null;
          phone?: string | null;
          website?: string | null;
          rating?: number | null;
          price?: string | null;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          item_id?: string;
          title?: string;
          description?: string;
          category?: string;
          location?: string | null;
          image_url?: string | null;
          phone?: string | null;
          website?: string | null;
          rating?: number | null;
          price?: string | null;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      chat_history: {
        Row: {
          id: string;
          user_id: string;
          message: string;
          is_user: boolean;
          response_data: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          message: string;
          is_user: boolean;
          response_data?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          message?: string;
          is_user?: boolean;
          response_data?: Json | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];