import localFont from 'next/font/local';

export const ppMori = localFont({
  src: [
    {
      path: '../../public/fonts/PPMori/PPMori-ExtraLight.otf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../../public/fonts/PPMori/PPMori-ExtraLightItalic.otf',
      weight: '200',
      style: 'italic',
    },
    {
      path: '../../public/fonts/PPMori/PPMori-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/PPMori/PPMori-RegularItalic.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/fonts/PPMori/PPMori-SemiBold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/PPMori/PPMori-SemiBoldItalic.otf',
      weight: '600',
      style: 'italic',
    },
  ],
  variable: '--font-pp-mori',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});

export const aeonik = localFont({
  src: [
    {
      path: '../../public/fonts/Aeonik/Aeonik-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Aeonik/Aeonik-LightItalic.otf',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../../public/fonts/Aeonik/Aeonik-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Aeonik/Aeonik-RegularItalic.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/fonts/Aeonik/Aeonik-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Aeonik/Aeonik-MediumItalic.otf',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../../public/fonts/Aeonik/Aeonik-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Aeonik/Aeonik-BoldItalic.otf',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../../public/fonts/Aeonik/Aeonik-Black.otf',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Aeonik/Aeonik-BlackItalic.otf',
      weight: '900',
      style: 'italic',
    },
  ],
  variable: '--font-aeonik',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});

export const jetBrainsMono = localFont({
  src: [
    {
      path: '../../public/fonts/JetBrainsMono/JetBrainsMono-Thin.ttf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../../public/fonts/JetBrainsMono/JetBrainsMono-ExtraLight.ttf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../../public/fonts/JetBrainsMono/JetBrainsMono-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/JetBrainsMono/JetBrainsMono-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/JetBrainsMono/JetBrainsMono-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/JetBrainsMono/JetBrainsMono-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/JetBrainsMono/JetBrainsMono-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/JetBrainsMono/JetBrainsMono-ExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  fallback: ['Consolas', 'Monaco', 'Courier New', 'monospace'],
});
