import type { Metadata } from "next";
import "./globals.css";

import { ThemeProvider } from "@/providers/theme-provider";
import ReduxProvider from "@/providers/ReduxProviders";
import AuthProvider from "@/providers/AuthProvider";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Project Hub",
  description: "Modern Project Management Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", inter.variable)}
    >
      <body>
        <ThemeProvider>
          <ReduxProvider>
            <AuthProvider>
              {children}
              <Toaster position="top-right" richColors closeButton />
            </AuthProvider>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
