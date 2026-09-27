import type { Metadata, Viewport } from "next";
import "./globals.css";
import siteConfig from "@/config/site.json";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: `${siteConfig.name} | ${siteConfig.role}`,
  description: siteConfig.summary,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${siteConfig.name} | ${siteConfig.role}`,
    description: siteConfig.summary,
    url: siteConfig.url,
    siteName: `${siteConfig.name}'s Portfolio`,
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, 
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased ">
        {children}
      </body>
    </html>
  );
}
