import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { isDummyClerkKey } from "@/lib/clerk/utils";
import "./globals.css";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Update Me - Balanced News Coverage",
  description: "Official AI-powered News Platform with framing transparency and sentiment analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDummy = isDummyClerkKey();

  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col font-poppins bg-[#F0F0F0] text-[#0D0D0F]">
        {!isDummy ? (
          <ClerkProvider>{children}</ClerkProvider>
        ) : (
          <>{children}</>
        )}
      </body>
    </html>
  );
}
