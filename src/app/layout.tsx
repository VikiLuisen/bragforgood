import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.bragforgood.com"),
  title: {
    default: "bragforgood — Yeah, but for good.",
    template: "%s | bragforgood",
  },
  description: "The only place where showing off makes the world better. Brag about your good deeds, inspire others, and earn karma.",
  keywords: ["good deeds", "social media", "bragging for good", "community", "volunteering", "kindness", "karma", "bragforgood"],
  openGraph: {
    type: "website",
    siteName: "bragforgood",
    title: "bragforgood — Yeah, but for good.",
    description: "The only place where showing off makes the world better. Brag about your good deeds, inspire others, and earn karma.",
    url: "https://www.bragforgood.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "bragforgood — Yeah, but for good.",
    description: "The only place where showing off makes the world better. Brag about your good deeds, inspire others, and earn karma.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
