import type { Metadata } from "next";
import "./globals.css";
import { SettingsProvider } from '@/contexts/SettingsContext';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: "Prayer Times App",
  description: "Find exact prayer times based on your location with a beautiful 24-hour dial visualization",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sf">
        <SettingsProvider>
          <Suspense fallback={<div className="min-h-screen bg-apple-gray-50 dark:bg-black flex items-center justify-center"><div className="w-5 h-5 border-2 border-apple-blue border-t-transparent rounded-full animate-spin"></div></div>}>
            {children}
          </Suspense>
        </SettingsProvider>
      </body>
    </html>
  );
}