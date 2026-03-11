import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { Outfit } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { PageLayout } from '@/components/layout/page-layout';
import { ToastContainer } from '@/components/shared/toast-container';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'MotionMesh — AI Dance Video Marketplace',
  description:
    'Upload your photo and get a professional AI-generated dance video in minutes. Buy moves from top choreographers on MotionMesh.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${outfit.variable} antialiased bg-[#050508] text-white min-h-screen font-outfit`}>
        <Providers>
          <PageLayout>{children}</PageLayout>
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}

