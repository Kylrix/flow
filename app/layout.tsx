import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/providers";
import { MainLayout } from "@/components/layout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "WhisperrFlow - Smart Task Navigation",
  description: "The future of task orchestration inside the Whisperr ecosystem.",
  keywords: ["task management", "productivity", "whisperr", "todo", "project management"],
  authors: [{ name: "Whisperr Team" }],
  openGraph: {
    title: "WhisperrFlow - Smart Task Navigation",
    description: "The future of task orchestration inside the Whisperr ecosystem.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${outfit.variable}`}>
      <body className="font-sans antialiased">
        <AppProviders>
          <MainLayout>
            {children}
          </MainLayout>
        </AppProviders>
      </body>
    </html>
  );
}
