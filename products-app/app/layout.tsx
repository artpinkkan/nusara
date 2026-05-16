import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nusara Technology — Weighing Software Products",
  description:
    "Nusara WS-Pharma: pharmaceutical weighing software modules for dispensing and check-weighing. GxP / EU Annex 11 ready.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full antialiased" style={{ fontFamily: "'KalbeSystem', system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
