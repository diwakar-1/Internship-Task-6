import type { Metadata } from "next";
import { Syne, Space_Mono, Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { isDummyClerkKey } from "@/lib/clerk/utils";
import "./globals.css";

const syne = Syne({
  weight: ["700", "800"],
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Update You - Official AI News Platform",
  description: "Balanced news coverage, political framing transparency, and sentiment analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDummy = isDummyClerkKey();

  return (
    <html lang="en" className={`${syne.variable} ${spaceMono.variable} ${inter.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#EBEAE5] text-[#111111] selection:bg-[#111111] selection:text-white">
        {!isDummy ? (
          <ClerkProvider>{children}</ClerkProvider>
        ) : (
          <>{children}</>
        )}
      </body>
    </html>
  );
}
