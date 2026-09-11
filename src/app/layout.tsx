import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quickmart — Groceries delivered fast",
  description: "Hyper-local quick-commerce grocery delivery, built for the portfolio demo.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans text-ink antialiased bg-paper">{children}</body>
    </html>
  );
}
