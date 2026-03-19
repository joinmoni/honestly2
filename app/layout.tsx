import type { Metadata } from "next";
import "@/app/globals.css";
import { buildPageMetadata, SITE_DESCRIPTION } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Honestly | Editorial Vendor Discovery",
    description: SITE_DESCRIPTION
  })
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Instrument+Serif:ital@0;1&family=Playfair+Display:wght@700&display=swap"
        />
      </head>
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
}
