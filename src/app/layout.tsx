
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import WhatsAppButton from "./Components/WhatsAppButton";
import { CartProvider } from "./cart/context";
import ChatbotPopup from '@/app/Components/ChatbotPopup'; // Updated import path

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fumigadora",
  description: "Fumigadora Professiona Technical Pest Control - Servicios de fumigación profesional",
  icons: {
    icon: [
      { url: "https://res.cloudinary.com/df6cxn8ga/image/upload/v1742326557/sublogo_brmmjl.png", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
          <Header />
          {children}
          <ChatbotPopup />
          <Footer />

          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}
