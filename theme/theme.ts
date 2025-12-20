'use client';

import { createTheme, ThemeOptions, alpha } from '@mui/material/styles';

const getDesignTokens = (mode: 'light' | 'dark'): ThemeOptions => ({
  palette: {
    mode,
    primary: {
      main: '#FFC700', // Sun yellow
      light: '#FFCF40',
      dark: '#D6A300',
      contrastText: '#1a1a1a',
    },
    secondary: {
      main: '#8B5CF6', // Purple accent
      light: '#A78BFA',
      dark: '#7C3AED',
      contrastText: '#ffffff',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    warning: {
      main: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    info: {
      main: '#8B5CF6',
      light: '#A78BFA',
      dark: '#7C3AED',
    },
    background: {
      default: mode === 'light' ? '#f8f8f8' : '#0f0f0f',
      paper: mode === 'light' ? '#ffffff' : '#1a1a1a',
    },
    text: {
      primary: mode === 'light' ? '#0f0a08' : '#faf8f6',
      secondary: mode === 'light' ? '#6b5b4f' : '#a69080',
    },
    divider: mode === 'light' ? '#e8e8e8' : '#2a2a2a',
  },
  typography: {
    fontFamily: 'var(--font-inter), "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: 'var(--font-outfit), "Outfit", sans-serif',
      fontSize: '2.5rem',
      fontWeight: 800,
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: 'var(--font-outfit), "Outfit", sans-serif',
      fontSize: '2rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
      lineHeight: 1.3,
    },
    h3: {
      fontFamily: 'var(--font-outfit), "Outfit", sans-serif',
      fontSize: '1.5rem',
      fontWeight: 700,
      lineHeight: 1.4,
    },
    h4: {
      fontFamily: 'var(--font-outfit), "Outfit", sans-serif',
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontFamily: 'var(--font-outfit), "Outfit", sans-serif',
      fontSize: '1.125rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h6: {
      fontFamily: 'var(--font-outfit), "Outfit", sans-serif',
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.5,
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0 2px 4px rgba(0,0,0,0.02)',
    '0 4px 8px rgba(0,0,0,0.04)',
    '0 8px 16px rgba(0,0,0,0.08)',
    '0 12px 24px rgba(0,0,0,0.12)',
    '0 16px 32px rgba(0,0,0,0.16)',
    '0 20px 40px rgba(0,0,0,0.20)',
    '0 25px 50px rgba(0,0,0,0.25)',
    '0 25px 50px rgba(0,0,0,0.25)',
    '0 25px 50px rgba(0,0,0,0.25)',
    '0 25px 50px rgba(0,0,0,0.25)',
    '0 25px 50px rgba(0,0,0,0.25)',
    '0 25px 50px rgba(0,0,0,0.25)',
    '0 25px 50px rgba(0,0,0,0.25)',
    '0 25px 50px rgba(0,0,0,0.25)',
    '0 25px 50px rgba(0,0,0,0.25)',
    '0 25px 50px rgba(0,0,0,0.25)',
    '0 25px 50px rgba(0,0,0,0.25)',
    '0 25px 50px rgba(0,0,0,0.25)',
    '0 25px 50px rgba(0,0,0,0.25)',
    '0 25px 50px rgba(0,0,0,0.25)',
    '0 25px 50px rgba(0,0,0,0.25)',
    '0 25px 50px rgba(0,0,0,0.25)',
    '0 25px 50px rgba(0,0,0,0.25)',
    '0 25px 50px rgba(0,0,0,0.25)',
  ] as any,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: mode === 'light' ? '#f8f8f8' : '#0f0f0f',
          scrollbarColor: '#ffc700 transparent',
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            width: 5,
            height: 5,
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 10,
            backgroundColor: 'rgba(255, 199, 0, 0.3)',
            '&:hover': {
              backgroundColor: 'rgba(255, 199, 0, 0.5)',
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 20px',
          fontWeight: 700,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          textTransform: 'none',
        },
        contained: ({ theme }: { theme: any }) => ({
          backgroundColor: '#FFC700',
          color: '#1a1a1a',
          boxShadow: '0 4px 12px rgba(255, 199, 0, 0.2)',
          '&:hover': {
            backgroundColor: '#FFE066',
            boxShadow: '0 8px 20px rgba(255, 199, 0, 0.3)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        }),
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }: { theme: any }) => ({
          borderRadius: 24,
          backdropFilter: 'blur(12px)',
          backgroundColor: theme.palette.mode === 'light'
            ? 'rgba(255, 255, 255, 0.8)'
            : 'rgba(26, 26, 26, 0.7)',
          border: `2px solid ${theme.palette.mode === 'light'
            ? '#e8e8e8'
            : '#2a2a2a'}`,
          boxShadow: theme.palette.mode === 'light'
            ? '0 8px 32px rgba(0, 0, 0, 0.08)'
            : '0 8px 32px rgba(0, 0, 0, 0.4)',
        }),
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme }: { theme: any }) => ({
          backgroundColor: theme.palette.mode === 'light'
            ? 'rgba(255, 255, 255, 0.8)'
            : 'rgba(26, 26, 26, 0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: `2px solid ${theme.palette.mode === 'light'
            ? '#e8e8e8'
            : '#2a2a2a'}`,
          boxShadow: 'none',
          color: theme.palette.text.primary,
        }),
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: ({ theme }: { theme: any }) => ({
          backgroundColor: theme.palette.mode === 'light'
            ? '#ffffff'
            : '#1a1a1a',
          borderRight: `2px solid ${theme.palette.mode === 'light'
            ? '#e8e8e8'
            : '#2a2a2a'}`,
          boxShadow: 'none',
        }),
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          margin: '2px 12px',
          padding: '10px 16px',
          fontWeight: 600,
          transition: 'all 0.2s ease',
          '&.Mui-selected': {
            backgroundColor: '#FFC700',
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(255, 199, 0, 0.3)',
            '& .MuiListItemIcon-root': {
              color: '#ffffff',
            },
            '&:hover': {
              backgroundColor: '#FFC700',
              opacity: 0.9,
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              right: 12,
              width: 4,
              height: 20,
              backgroundColor: '#ffffff',
              borderRadius: 2,
            },
          },
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
            transform: 'translateX(4px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 14px rgba(0, 0, 0, 0.15)',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 6,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 8,
          fontSize: '0.75rem',
        },
      },
    },
  },
});

export const lightTheme = createTheme(getDesignTokens('light'));
export const darkTheme = createTheme(getDesignTokens('dark'));

export default lightTheme;
