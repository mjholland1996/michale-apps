import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MealPlanProvider } from "@/context/MealPlanContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Michale Apps",
    template: "%s | Michale Apps",
  },
  description: "A collection of personal web apps",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <MealPlanProvider>
          {children}
        </MealPlanProvider>
      </body>
    </html>
  );
}
