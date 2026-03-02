import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ToastContainer } from '@/components/shared/toast-container';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'MotionMesh — AI Dance Video Marketplace',
  description:
    'Upload your photo and get a professional AI-generated dance video in minutes. Buy moves from top choreographers on MotionMesh.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} antialiased bg-[#050508] text-white min-h-screen`}>
        <Providers>
          <Navbar />
          <main className="pt-16">{children}</main>
          <Footer />
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}

