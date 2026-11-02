export const colors = {
  primary: '#0EA5E9',
  primaryDark: '#0369A1',
  primaryLight: '#E0F2FE',
  accent: '#F59E0B',
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  border: '#E2E8F0',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  white: '#FFFFFF',
};

export const spacing = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48,
};

export const radius = {
  sm: 8, md: 12, lg: 16, xl: 24, full: 9999,
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '700' as const, color: colors.textPrimary },
  h2: { fontSize: 22, fontWeight: '700' as const, color: colors.textPrimary },
  h3: { fontSize: 18, fontWeight: '600' as const, color: colors.textPrimary },
  body: { fontSize: 15, fontWeight: '400' as const, color: colors.textPrimary },
  bodySm: { fontSize: 13, fontWeight: '400' as const, color: colors.textSecondary },
  caption: { fontSize: 11, fontWeight: '500' as const, color: colors.textMuted },
};