import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope, Geist } from "next/font/google";

import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "AI IDE Template · Clone & Deploy",
  description:
    "A Next.js App Router template with a GitHub CLI clone helper, AI SDK streaming chat, and VPS Podman deployment flow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full", "antialiased", mono.variable, "font-sans", geist.variable)}>
      <body className="min-h-full bg-background text-foreground">{children}</body>
    </html>
  );
}
