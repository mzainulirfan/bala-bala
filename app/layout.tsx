import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Antrean Gorengan Viral",
  description: "Sistem antrean dan self-order gorengan viral"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
