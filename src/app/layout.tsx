'use client'

/* eslint-disable perfectionist/sort-imports */
import 'src/global.css';

// ----------------------------------------------------------------------

import ThemeProvider from 'src/theme';
import { primaryFont } from 'src/theme/typography';
import { LocalizationProvider } from 'src/locales';

import ProgressBar from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { SettingsDrawer, SettingsProvider } from 'src/components/settings';
import { AuthProvider } from 'src/contexts/AuthContext';
import ProtectedRoute from 'src/components/protected-route';
import { usePathname } from 'next/navigation';
import React from 'react';

// ----------------------------------------------------------------------

// export const metadata = {
//   title: 'Zone UI Kit',
//   description:
//     'The ZONE is built on top of MUI, a powerful library that provides flexible, customizable, and easy-to-use components.',
//   keywords: 'react,material,kit,application,dashboard,admin,template',
//   themeColor: '#000000',
//   manifest: '/manifest.json',
//   viewport: { width: 'device-width', initialScale: 1, maximumScale: 1 },
//   icons: [
//     { rel: 'icon', url: '/favicon/favicon.ico' },
//     { rel: 'icon', type: 'image/png', sizes: '16x16', url: '/favicon/favicon-16x16.png' },
//     { rel: 'icon', type: 'image/png', sizes: '32x32', url: '/favicon/favicon-32x32.png' },
//     { rel: 'apple-touch-icon', sizes: '180x180', url: '/favicon/apple-touch-icon.png' },
//   ],
// };

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  const pathname = usePathname();

  const getLayout = (pathname: string) => {
    switch (true) {
      case pathname.startsWith('/auth/'):
        return React.Fragment;
      default:
        return ProtectedRoute;
    }
  };

  const SelectedLayout = getLayout(pathname);

  return (
    <html lang="en" className={primaryFont.className}>
      <body>
        <LocalizationProvider>
          <SettingsProvider
            defaultSettings={{
              themeMode: 'dark', // 'light' | 'dark'
              themeDirection: 'ltr', //  'rtl' | 'ltr'
              themeColorPresets: 'preset04', // 'default' | 'preset01' | 'preset02' | 'preset03' | 'preset04' | 'preset05'
            }}
          >
            <AuthProvider>
              <ThemeProvider>
                <MotionLazy>
                  <ProgressBar />
                  {/* <SettingsDrawer /> */}
                  <SelectedLayout>
                    {children}
                  </SelectedLayout>
                </MotionLazy>
              </ThemeProvider>
            </AuthProvider>
          </SettingsProvider>
        </LocalizationProvider>
      </body>
    </html>
  );
}
