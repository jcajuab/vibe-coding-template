import { type Metadata } from "next";

import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Vibe Coding Template",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
