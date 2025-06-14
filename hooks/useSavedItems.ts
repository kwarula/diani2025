import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/types/database';

export interface InfoCardData {
  id: string;
  title: string;
  description: string;
  category: string;
  location?: string;
  imageUrl?: string;
  phone?: string;
  website?: string;
  // Additional fields from webhook response
  duration?: string;
  price?: string;
  highlights?: string[];
  availability?: string;
  contact_phone?: string;
  website_url?: string;
  average_rating?: number;
  rating?: number;
  short_description?: string;
  address?: string;
  name?: string;
  image?: string;
}

type SavedItem = Database['public']['Tables']['saved_items']['Row'];

export function useSavedItems() {
  const { user } = useAuth();
  const [savedItems, setSavedItems] = useState<InfoCardData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Convert database saved item to InfoCardData format
  const convertToInfoCardData = (item: SavedItem): InfoCardData => {
    return {
      id: item.item_id,
      title: item.title,
      description: item.description,
      category: item.category,
      location: item.location || undefined,
      imageUrl: item.image_url || undefined,
      phone: item.phone || undefined,
      website: item.website || undefined,
      rating: item.rating ? Number(item.rating) : undefined,
      price: item.price || undefined,
      // Include any additional metadata
      ...(item.metadata as any || {}),
    };
  };

  // Load saved items from Supabase
  const loadSavedItems = useCallback(async () => {
    if (!user) {
      setSavedItems([]);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('saved_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading saved items:', error);
        return;
      }

      const convertedItems = data.map(convertToInfoCardData);
      setSavedItems(convertedItems);
    } catch (error) {
      console.error('Error loading saved items:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Load saved items when user changes or component mounts
  useEffect(() => {
    loadSavedItems();
  }, [loadSavedItems]);

  // Toggle save item (add or remove)
  const toggleSaveItem = useCallback(async (item: InfoCardData) => {
    if (!user) {
      console.warn('User must be logged in to save items');
      return;
    }

    try {
      const isCurrentlySaved = savedItems.some(savedItem => savedItem.id === item.id);

      if (isCurrentlySaved) {
        // Remove item
        const { error } = await supabase
          .from('saved_items')
          .delete()
          .eq('user_id', user.id)
          .eq('item_id', item.id);

        if (error) {
          console.error('Error removing saved item:', error);
          return;
        }

        setSavedItems(current => current.filter(savedItem => savedItem.id !== item.id));
      } else {
        // Add item
        const savedItemData = {
          user_id: user.id,
          item_id: item.id,
          title: item.title,
          description: item.description,
          category: item.category,
          location: item.location || null,
          image_url: item.imageUrl || null,
          phone: item.phone || null,
          website: item.website || null,
          rating: item.rating || null,
          price: item.price || null,
          metadata: {
            duration: item.duration,
            highlights: item.highlights,
            availability: item.availability,
            contact_phone: item.contact_phone,
            website_url: item.website_url,
            average_rating: item.average_rating,
            short_description: item.short_description,
            address: item.address,
            name: item.name,
            image: item.image,
          },
        };

        const { error } = await supabase
          .from('saved_items')
          .insert(savedItemData);

        if (error) {
          console.error('Error saving item:', error);
          return;
        }

        setSavedItems(current => [item, ...current]);
      }
    } catch (error) {
      console.error('Error toggling saved item:', error);
    }
  }, [user, savedItems]);

  // Check if item is saved
  const isItemSaved = useCallback((itemId: string): boolean => {
    return savedItems.some(savedItem => savedItem.id === itemId);
  }, [savedItems]);

  // Clear all saved items
  const clearAllSavedItems = useCallback(async () => {
    if (!user) {
      return;
    }

    try {
      const { error } = await supabase
        .from('saved_items')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error clearing saved items:', error);
        return;
      }

      setSavedItems([]);
    } catch (error) {
      console.error('Error clearing saved items:', error);
    }
  }, [user]);

  return {
    savedItems,
    isLoading,
    toggleSaveItem,
    isItemSaved,
    clearAllSavedItems,
    refreshSavedItems: loadSavedItems,
  };
}