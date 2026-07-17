import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FIFA Predictor — World Cup Forecast Platform 1930–2026",
  description:
    "Data-driven FIFA World Cup prediction platform. 96 years of football history, Monte Carlo simulations, ELO ratings, machine learning forecasts, and interactive analytics across every tournament from 1930 to 2026.",
  keywords: [
    "FIFA World Cup",
    "World Cup Predictor",
    "Football Analytics",
    "Monte Carlo Simulation",
    "ELO Ratings",
    "Football Forecast",
    "2026 World Cup",
    "Soccer Predictions",
  ],
  authors: [{ name: "FIFA Predictor" }],
  openGraph: {
    title: "FIFA Predictor — World Cup Forecast Platform 1930–2026",
    description:
      "Predicting World Cup glory using 96 years of football history. Probabilistic forecasts, Monte Carlo simulations, and deep team analytics.",
    siteName: "FIFA Predictor",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FIFA Predictor — World Cup Forecast Platform 1930–2026",
    description:
      "Predicting World Cup glory using 96 years of football history.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
