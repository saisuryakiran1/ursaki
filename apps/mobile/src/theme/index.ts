/** UrSaKi mobile theme — design tokens for React Native screens. */

export const colors = {
  bg_primary: '#0A0A0F',
  bg_surface: '#12121A',
  accent_primary: '#7B6FFF',
  accent_pulse: '#FF6B9D',
  accent_calm: '#4ECDC4',
  text_primary: '#F0EEF6',
  text_muted: '#7A7890',
  danger: '#FF4757',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  huge: 64,
} as const;

export const radius = {
  sm: 8,
  md: 16,
  lg: 24,
  pill: 999,
} as const;

export const theme = { colors, spacing, radius } as const;

export type Theme = typeof theme;
