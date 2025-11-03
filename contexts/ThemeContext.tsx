import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      setThemeState(savedTheme);
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    const updateTheme = () => {
      let currentTheme: 'light' | 'dark';
      if (theme === 'system') {
        currentTheme = systemPrefersDark.matches ? 'dark' : 'light';
      } else {
        currentTheme = theme;
      }

      root.classList.remove('light', 'dark');
      root.classList.add(currentTheme);
      setResolvedTheme(currentTheme);
    };

    updateTheme(); // Set initial theme

    localStorage.setItem('theme', theme);

    // Listen for system preference changes
    systemPrefersDark.addEventListener('change', updateTheme);
    return () => {
      systemPrefersDark.removeEventListener('change', updateTheme);
    };
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
