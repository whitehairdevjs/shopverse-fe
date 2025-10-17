import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { AuthProvider } from "@/utils/authContext";
import { LanguageProvider } from "@/components/common/LanguageProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShopVerse - 최고의 온라인 쇼핑몰",
  description: "ShopVerse는 최고의 쇼핑 경험을 제공하는 온라인 마켓플레이스입니다. 다양한 상품을 편리하게 구매하세요.",
  keywords: "쇼핑, 온라인쇼핑, 이커머스, 마켓플레이스, ShopVerse",
  authors: [{ name: "ShopVerse Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
