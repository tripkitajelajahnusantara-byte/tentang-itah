import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    template: '%s | Tentang Itah',
    default: 'Tentang Itah - Edukasi & Budaya Kalimantan Tengah',
  },
  description: 'Portal informasi dan media pembelajaran interaktif budaya Kalimantan Tengah. Pelajari bahasa daerah, seni pertunjukan, cerita rakyat, tradisi Tiwah, dan jelajah kabupaten/kota.',
  keywords: ['Kalimantan Tengah', 'Budaya Dayak', 'Bahasa Dayak', 'Tiwah', 'Palangka Raya', 'Cerita Rakyat', 'Tentang Itah'],
  authors: [{ name: 'Tentang Itah Developer' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col justify-between selection:bg-primary/30 selection:text-primary-hover" suppressHydrationWarning>
        <Navbar />
        <main className="flex-grow pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
