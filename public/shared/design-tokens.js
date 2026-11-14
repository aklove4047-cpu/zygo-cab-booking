/**
 * ZYGO MASTER ROADMAP 2.0 - DESIGN SYSTEM & DESIGN TOKENS
 * Brand Principle: "Ek Naam. Sab Kaam."
 * Engineering Principle: "Think 100 Times. Code Once."
 */

export const ZYGO_TOKENS = {
  colors: {
    // Backgrounds
    backgroundPearl: '#EDEDEC',
    backgroundLight: '#F7F7F6',
    surfaceWhite: '#FFFFFF',
    surfaceElevated: '#FFFFFF',

    // Primary Brand Navy Black
    deepNavy: '#040608',
    deepNavyCard: '#0C1017',
    deepNavyElevated: '#141A24',
    navyMuted: '#1E2633',

    // Primary Accents (Gold System)
    goldPrimary: '#FCC82C',
    goldRich: '#EFAF19',
    goldBronze: '#986209',
    goldChampagne: '#E7D9A8',
    goldGlow: 'rgba(252, 200, 44, 0.35)',

    // Borders & Dividers
    borderWarmSilver: '#A7A4A1',
    borderSubtle: 'rgba(167, 164, 161, 0.25)',
    borderDark: 'rgba(255, 255, 255, 0.12)',

    // Functional & States
    emergencyRed: '#E74C3C',
    successGreen: '#2ECC71',
    infoBlue: '#3498DB',
    warningOrange: '#E67E22',

    // Text Tokens
    textPrimaryDark: '#040608',
    textSecondaryDark: '#5A5856',
    textMutedDark: '#8A8784',
    textPrimaryLight: '#FFFFFF',
    textSecondaryLight: '#CBD5E1',
    textMutedLight: '#94A3B8',
  },

  typography: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    sizes: {
      xs: '11px',
      sm: '13px',
      md: '15px',
      lg: '18px',
      xl: '22px',
      xxl: '28px',
      display: '34px',
    },
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      heavy: 800,
      black: 900,
    }
  },

  radius: {
    sm: '8px',
    md: '14px',
    lg: '20px',
    xl: '26px',
    full: '999px',
  },

  shadows: {
    clayLight: '0 10px 25px -5px rgba(0, 0, 0, 0.06), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
    clayCard: '0 14px 30px rgba(4, 6, 8, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
    clayGold: '0 8px 24px rgba(252, 200, 44, 0.35)',
    clayDarkCard: '0 16px 36px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  }
};
