import { type Metadata } from "next";

import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Vibe Coding Template",
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
