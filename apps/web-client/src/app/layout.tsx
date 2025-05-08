import '../styles/globals.css';
import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

// Font configuration
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

// Metadata for SEO
export const metadata: Metadata = {
  title: {
    default: "Bailey's Kitchen | Premium Pet Food Delivery",
    template: "%s | Bailey's Kitchen",
  },
  description: 'Premium healthy food for pets, delivered to your doorstep',
  keywords: ['pet food', 'healthy pet food', 'dog food', 'cat food', 'pet meals', 'food delivery', 'pet nutrition'],
  authors: [{ name: "Bailey's Kitchen Team" }],
  creator: "Bailey's Kitchen",
  publisher: "Bailey's Kitchen",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

