import type { Metadata } from "next";
import "./globals.css";
import { SettingsProvider } from '@/contexts/SettingsContext';

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
          {children}
        </SettingsProvider>
      </body>
    </html>
  );
}