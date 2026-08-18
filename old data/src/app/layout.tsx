import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title:
    "Achyutam Builder | Residential, Commercial, Industrial & Cultural Construction in Sikar",
  description:
    "Achyutam Builder delivers quality residential homes, commercial complexes, industrial structures, and cultural architecture in Sikar, Rajasthan. Expert construction and modern designs.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0b0b0f] text-[#e6e6f0] antialiased">
        {children}
      </body>
    </html>
  );
}
