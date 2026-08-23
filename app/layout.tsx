import type { Metadata } from 'next';
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RoyalGreenCanvas from '../components/RoyalGreenCanvas';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'MKB DIGITAL | Luxury Web Architecture & Custom Software Engineering',
  description:
    'Bespoke web development agency building high-performance 3D web applications, luxury e-commerce, and enterprise full-stack solutions.',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth ${outfit.variable} ${jakarta.variable}`}>
      <body className="bg-[#060b08] text-slate-100 antialiased relative min-h-screen flex flex-col">
        <RoyalGreenCanvas />
        <Navbar />
        <main className="flex-grow relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
