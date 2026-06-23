import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import 'flatpickr/dist/flatpickr.css';
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Providers } from '@/components/providers';
import { ToastContainer } from '@/components/toast-container';

const outfit = Outfit({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MotionMesh — AI Dance Video Marketplace',
  description:
    'Upload your photo and get a professional AI-generated dance video in minutes. Buy moves from top choreographers on MotionMesh.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <SidebarProvider>
            <Providers>
              {children}
              <ToastContainer />
            </Providers>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
