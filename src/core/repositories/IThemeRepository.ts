export interface IThemeRepository {
  getTheme(): 'dark' | 'light';
  setTheme(theme: 'dark' | 'light'): void;
}
