import { Metadata } from 'next';
import Script from 'next/script';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import Header from '@/components/Header';

import Footer from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'Learn Sphere',
  description: 'Online Learning Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          id="razorpay-checkout"
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <AuthProvider>
          <Header />
          <Header />
          <main className="min-h-screen bg-gray-900 pt-16">
            {children}
          </main>
          <Footer />
          <Toaster position="bottom-center" />
        </AuthProvider>
      </body>
    </html>
  );
}







