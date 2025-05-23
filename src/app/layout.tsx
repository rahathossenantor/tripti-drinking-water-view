import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "@/lib/Providers/Providers";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tripti Drinking Water",
  description: "Tripti Drinking Water",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Providers>
      <Toaster position="top-center" />
      <html lang="en">
        <body className={`${inter.className}`} cz-shortcut-listen="true">
          {children}
        </body>
      </html>
    </Providers>
  );
};

export default RootLayout;
