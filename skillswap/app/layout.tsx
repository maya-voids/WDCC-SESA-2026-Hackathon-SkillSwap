import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "../frontend/styles/marketplace.css";

// Baseline: the original Geist Sans + Geist Mono for the whole app
// (nav bar, share form, labels, buttons).
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Ferron for the landing + marketplace display headings.
const ferronDisplay = localFont({
  variable: "--font-ferron",
  src: "./fonts/Ferron-Regular.otf",
  weight: "400",
});

// Real Zyzol, used on the service descriptions and the category filter.
const zyzol = localFont({
  variable: "--font-zyzol",
  src: [
    { path: "./fonts/Zyzol.otf", weight: "400" },
    { path: "./fonts/Zyzol-Bold.otf", weight: "700" },
  ],
});

// Rondira Medium, used on the service card titles.
const rondira = localFont({
  variable: "--font-rondira",
  src: "./fonts/Rondira-Medium.otf",
  weight: "500",
});

export const metadata: Metadata = {
  title: "SkillSwap",
  description:
    "Discover workshops, share practical skills, and learn from people across Auckland.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${ferronDisplay.variable} ${zyzol.variable} ${rondira.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
