import { create } from 'zustand';
import { themeRepository } from '../../data/di/container';

interface ThemeState {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => {
  const initialTheme = themeRepository.getTheme();
  document.documentElement.dataset.theme = initialTheme;

  return {
    theme: initialTheme,
    toggleTheme: () =>
      set((state) => {
        const newTheme = state.theme === 'dark' ? 'light' : 'dark';
        themeRepository.setTheme(newTheme);
        document.documentElement.dataset.theme = newTheme;
        return { theme: newTheme };
      }),
  };
});
