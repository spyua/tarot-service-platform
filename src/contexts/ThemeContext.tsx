import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme } from '../types';
import { storageService } from '../services/StorageService';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
  isDarkMode: false,
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Initialize theme from user preferences
  const [theme, setThemeState] = useState<Theme>(() => {
    const preferences = storageService.getUserPreferences();
    return preferences.theme;
  });

  // Determine if dark mode should be active
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Update theme and apply to document
  useEffect(() => {
    const applyTheme = () => {
      let shouldUseDark = false;

      if (theme === 'dark') {
        shouldUseDark = true;
      } else if (theme === 'auto') {
        // Check system preference
        shouldUseDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }

      setIsDarkMode(shouldUseDark);

      // Apply theme to document
      if (shouldUseDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    applyTheme();

    // Listen for system theme changes when in auto mode
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme();
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // Set theme and save to storage
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    
    // Update user preferences
    const preferences = storageService.getUserPreferences();
    const updatedPreferences = { ...preferences, theme: newTheme };
    storageService.saveUserPreferences(updatedPreferences);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);