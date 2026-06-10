import React, { createContext, useContext, useMemo } from 'react';
import { theme, Theme } from './index';

const ThemeContext = createContext<Theme>(theme);

export function ThemeProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const value = useMemo(() => theme, []);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  return useContext(ThemeContext);
}
