import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Emilio Berndt | Creative Developer",
  description:
    "Personal portfolio focused on minimal interfaces, strong interaction design, and modern frontend systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
