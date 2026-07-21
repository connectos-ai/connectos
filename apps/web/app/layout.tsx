import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ConnectOS",
  description: "Neutral infrastructure for AI application integrations",
  icons: {
    icon: "/icon.svg"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
