import type { Metadata } from "next";
import { Inter, Instrument_Serif, Playfair_Display } from "next/font/google";
import "@/app/globals.css";
import { buildPageMetadata, SITE_DESCRIPTION } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  weight: "400"
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  weight: ["700"]
});

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Honestly | Editorial Vendor Discovery",
    description: SITE_DESCRIPTION
  })
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${instrumentSerif.variable} ${playfairDisplay.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
