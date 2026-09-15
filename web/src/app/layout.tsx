import type { Metadata } from "next";
import { Sora, Source_Sans_3, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopNav from "@/components/TopNav";

const sora = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "I-GATE — GATE DA Prep",
  description: "GATE Data Science & AI 2027 practice tests",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png", sizes: "192x192" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${sourceSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-ink">
        <TopNav />
        <div className="flex-1 flex flex-col">{children}</div>
        <footer className="text-center text-[11px] text-ink-3 py-4 border-t border-border-soft">
          Unofficial personal study project — not affiliated with or endorsed by the GATE organizing committee or IIT Madras.
        </footer>
      </body>
    </html>
  );
}
