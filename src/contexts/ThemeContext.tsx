import React, { createContext, useContext, useEffect } from 'react';
import { usePersistentState } from '../hooks/usePersistentState';

type Theme = 'light' | 'dark';

interface ThemeValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeValue | null>(null);

export function ThemeProvider({ children }: {children: React.ReactNode;}) {
  const [theme, setTheme] = usePersistentState<Theme>('hoz.theme', 'light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => setTheme((t) => t === 'light' ? 'dark' : 'light');

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}