import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NODE_ENV === "production"
      ? "https://vishalparekh.realtor"
      : "http://localhost:3005"
  ),
  title: "Vishal Parekh | DFW Commercial & Residential Real Estate",
  description: "Strategic Commercial & Residential Real Estate services across the Dallas-Fort Worth metroplex.",
  icons: {
    icon: '/favicon.png',
  },
  openGraph: {
    title: "Vishal Parekh | DFW Commercial & Residential Real Estate",
    description: "Strategic Commercial & Residential Real Estate services across the Dallas-Fort Worth metroplex.",
    url: "https://vishalparekh.realtor",
    siteName: "Vishal Parekh Real Estate",
    images: [
      {
        url: "/ogImg.png",
        width: 1200,
        height: 630,
        alt: "Vishal Parekh Real Estate",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-brand-white text-brand-black font-sans antialiased selection:bg-brand-black selection:text-white`}>
        {children}
        <Toaster position="top-right" toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
        }} />
        <Script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
