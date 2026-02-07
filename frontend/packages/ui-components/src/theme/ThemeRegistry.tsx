'use client';

import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import type { EmotionCache } from '@emotion/cache';
import createEmotionCache from './emotionCache';
import createTheme from './createTheme';

const clientSideEmotionCache = createEmotionCache();

interface ThemeRegistryProps {
  children: React.ReactNode;
  emotionCache?: EmotionCache;
}

export default function ThemeRegistry({
  children,
  emotionCache = clientSideEmotionCache,
}: ThemeRegistryProps) {
  const theme = createTheme();

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
