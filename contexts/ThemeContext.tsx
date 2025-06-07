import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: ColorPalette;
}

interface ColorPalette {
  // Background colors
  background: string;
  surface: string;
  surfaceSecondary: string;
  surfaceElevated: string;
  
  // Text colors
  text: string;
  textSecondary: string;
  textTertiary: string;
  
  // Primary colors
  primary: string;
  primaryLight: string;
  primaryDark: string;
  
  // Accent colors
  accent: string;
  success: string;
  warning: string;
  error: string;
  
  // Border and divider colors
  border: string;
  divider: string;
  
  // Shadow colors
  shadow: string;
  
  // Input colors
  inputBackground: string;
  inputBorder: string;
  placeholder: string;
  
  // Tab bar colors
  tabBarBackground: string;
  tabBarBorder: string;
  
  // Card colors
  cardBackground: string;
  cardBorder: string;
  
  // Overlay colors
  overlay: string;
  overlayLight: string;
}

const lightColors: ColorPalette = {
  background: '#FAFAFA',
  surface: '#FFFFFF',
  surfaceSecondary: '#F8F9FA',
  surfaceElevated: '#FFFFFF',
  
  text: '#2C3E50',
  textSecondary: '#5D6D7E',
  textTertiary: '#7F8C8D',
  
  primary: '#4A90E2',
  primaryLight: '#E3F2FD',
  primaryDark: '#2171B5',
  
  accent: '#52B788',
  success: '#52B788',
  warning: '#F97316',
  error: '#E74C3C',
  
  border: '#E5E5E5',
  divider: '#E8F4FD',
  
  shadow: '#000000',
  
  inputBackground: '#F2F2F7',
  inputBorder: '#E3E3E8',
  placeholder: '#8E8E93',
  
  tabBarBackground: '#FFFFFF',
  tabBarBorder: '#E5E5E5',
  
  cardBackground: '#FFFFFF',
  cardBorder: '#E8F4FD',
  
  overlay: 'rgba(0, 0, 0, 0.85)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
};

const darkColors: ColorPalette = {
  background: '#121212',
  surface: '#1E1E1E',
  surfaceSecondary: '#2A2A2A',
  surfaceElevated: '#2D2D2D',
  
  text: '#FFFFFF',
  textSecondary: '#B3B3B3',
  textTertiary: '#8A8A8A',
  
  primary: '#5BA3F5',
  primaryLight: '#1A2332',
  primaryDark: '#4A90E2',
  
  accent: '#66C999',
  success: '#66C999',
  warning: '#FF9F40',
  error: '#FF6B6B',
  
  border: '#3A3A3A',
  divider: '#2A2A2A',
  
  shadow: '#000000',
  
  inputBackground: '#2A2A2A',
  inputBorder: '#3A3A3A',
  placeholder: '#8A8A8A',
  
  tabBarBackground: '#1E1E1E',
  tabBarBorder: '#3A3A3A',
  
  cardBackground: '#1E1E1E',
  cardBorder: '#3A3A3A',
  
  overlay: 'rgba(0, 0, 0, 0.9)',
  overlayLight: 'rgba(0, 0, 0, 0.5)',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@discover_diani_theme';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>('light');
  const [isLoading, setIsLoading] = useState(true);

  // Load theme from storage on app start
  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      if (Platform.OS === 'web') {
        // Use localStorage for web
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
          setTheme(savedTheme);
        }
      } else {
        // Use AsyncStorage for mobile
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY) as Theme;
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
          setTheme(savedTheme);
        }
      }
    } catch (error) {
      console.warn('Failed to load theme from storage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTheme = async (newTheme: Theme) => {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      } else {
        await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      }
    } catch (error) {
      console.warn('Failed to save theme to storage:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    saveTheme(newTheme);
  };

  const colors = theme === 'light' ? lightColors : darkColors;

  // Don't render children until theme is loaded
  if (isLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}