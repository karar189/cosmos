import { createTheme as createMuiTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
  }
}

export const createTheme = () => {
  return createMuiTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#B6F0D1',
        contrastText: '#0E0E0E',
      },
      background: {
        default: '#FBFAF3',
        paper: '#FBFAF3',
      },
      text: {
        primary: '#000',
        secondary: 'rgba(14, 14, 14, 0.7)',
      },
    },

    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },

    typography: {
      fontFamily: 'var(--font-aeonik)',
      h1: {
        fontFamily: 'var(--font-pp-mori)',
        fontWeight: 700,
        fontSize: 'clamp(2rem, 8vw, 7rem)',
        lineHeight: 0.95,
        letterSpacing: '-0.02em',
        '@media (min-width:600px)': {
          fontSize: 'clamp(2.5rem, 6.5vw, 5rem)',
        },
        '@media (min-width:900px)': {
          fontSize: 'clamp(3rem, 8vw, 7rem)',
        },
      },
      h2: {
        fontFamily: 'var(--font-pp-mori)',
        fontWeight: 700,
        fontSize: 'clamp(1.75rem, 5vw, 3.5rem)',
        lineHeight: 1.1,
        letterSpacing: '-0.01em',
      },
      h3: {
        fontFamily: 'var(--font-pp-mori)',
        fontWeight: 700,
        fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
        lineHeight: 1.2,
      },
      body1: {
        fontFamily: 'var(--font-aeonik)',
        fontSize: '1.125rem',
        lineHeight: 1.6,
        '@media (max-width:900px)': {
          fontSize: '1rem',
        },
      },
      body2: {
        fontFamily: 'var(--font-aeonik)',
        fontSize: '1rem',
        lineHeight: 1.5,
      },
      button: {
        fontFamily: 'var(--font-aeonik)',
        fontWeight: 700,
        fontSize: '1rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      },
    },

    components: {
      MuiCssBaseline: {
        styleOverrides: {
          ':root': {
            '--color-primary': '#B6F0D1',
            '--color-background': '#FBFAF3',
            '--color-text': '#0E0E0E',
          },
          '*': {
            boxSizing: 'border-box',
            padding: 0,
            margin: 0,
          },
          html: {
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            maxWidth: '100vw',
            overflowX: 'hidden',
            '@media (prefers-color-scheme: dark)': {
              colorScheme: 'light',
            },
            // '@media (min-width: 1920px)': {
            //   fontSize: '18px', // ~12.5% larger on 1080p+ displays
            // },
            '@media (min-width: 2560px)': {
              fontSize: '24px', // ~25% larger on 1440p/4K displays
            },
            '@media (min-width: 3840px)': {
              fontSize: '32px', // ~50% larger on true 4K
            },
          },
          body: {
            margin: 0,
            padding: 0,
            maxWidth: '100vw',
            overflowX: 'hidden',
            color: '#000',
            background: '#FFFDEA',
          },
          '#__next': {
            minHeight: '100vh',
          },
          a: {
            textDecoration: 'none',
            color: 'inherit',
          },
          'a:focus-visible': {
            outline: '2px solid #B6F0D1',
            outlineOffset: '4px',
          },
          'button:focus-visible': {
            outline: '2px solid #B6F0D1',
            outlineOffset: '4px',
          },
        },
      },
      MuiTooltip: {
        defaultProps: {
          disableTouchListener: false,
          enterTouchDelay: 0,
          leaveTouchDelay: 1500,
        },
        styleOverrides: {
          tooltip: {
            backgroundColor: '#FFFFFF',
            borderRadius: '0.375rem',
            padding: '12px',
            border: '1px solid #E4E3E0',
            color: '#000000',
          },
        },
      },
    },
  });
};

export default createTheme;
