import './globals.css';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata = {
  title: {
    default: 'Algorithm with Mami — Algoritma Soruları & Çözümleri',
    template: '%s | Algorithm with Mami',
  },
  description: 'LeetCode, HackerRank ve CodeWars algoritma soruları ve çözümleri. Teknik mülakat hazırlığı için kapsamlı kaynak.',
  keywords: ['algoritma', 'leetcode', 'hackerrank', 'codewars', 'javascript', 'python', 'c++', 'sql', 'mülakat hazırlığı'],
  authors: [{ name: 'Mami', url: 'https://www.instagram.com/buildwithmami/' }],
  openGraph: {
    title: 'Algorithm with Mami',
    description: 'Algoritma soruları ve çözümleri',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased min-h-screen flex flex-col bg-neo-bg text-neo-black`}>
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

