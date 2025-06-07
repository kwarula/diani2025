import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

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

const SAVED_ITEMS_KEY = '@discover_diani_saved_items';

export function useSavedItems() {
  const [savedItems, setSavedItems] = useState<InfoCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Memoize the loadSavedItems function to prevent infinite re-renders
  const loadSavedItems = useCallback(async () => {
    try {
      let savedData: string | null = null;
      
      if (Platform.OS === 'web') {
        savedData = localStorage.getItem(SAVED_ITEMS_KEY);
      } else {
        savedData = await AsyncStorage.getItem(SAVED_ITEMS_KEY);
      }

      if (savedData) {
        const parsedItems: InfoCardData[] = JSON.parse(savedData);
        setSavedItems(parsedItems);
      }
    } catch (error) {
      console.warn('Failed to load saved items:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load saved items from storage on hook initialization
  useEffect(() => {
    loadSavedItems();
  }, [loadSavedItems]);

  // Memoize the saveSavedItems function
  const saveSavedItems = useCallback(async (items: InfoCardData[]) => {
    try {
      const dataToSave = JSON.stringify(items);
      
      if (Platform.OS === 'web') {
        localStorage.setItem(SAVED_ITEMS_KEY, dataToSave);
      } else {
        await AsyncStorage.setItem(SAVED_ITEMS_KEY, dataToSave);
      }
    } catch (error) {
      console.warn('Failed to save items:', error);
    }
  }, []);

  // Memoize the toggleSaveItem function
  const toggleSaveItem = useCallback(async (item: InfoCardData) => {
    setSavedItems(currentItems => {
      const isCurrentlySaved = currentItems.some(savedItem => savedItem.id === item.id);
      
      let updatedItems: InfoCardData[];
      
      if (isCurrentlySaved) {
        // Remove item from saved items
        updatedItems = currentItems.filter(savedItem => savedItem.id !== item.id);
      } else {
        // Add item to saved items
        updatedItems = [...currentItems, item];
      }
      
      // Save to storage asynchronously
      saveSavedItems(updatedItems);
      
      return updatedItems;
    });
  }, [saveSavedItems]);

  // Memoize the isItemSaved function
  const isItemSaved = useCallback((itemId: string): boolean => {
    return savedItems.some(savedItem => savedItem.id === itemId);
  }, [savedItems]);

  // Memoize the clearAllSavedItems function
  const clearAllSavedItems = useCallback(async () => {
    setSavedItems([]);
    await saveSavedItems([]);
  }, [saveSavedItems]);

  return {
    savedItems,
    isLoading,
    toggleSaveItem,
    isItemSaved,
    clearAllSavedItems,
    refreshSavedItems: loadSavedItems,
  };
}