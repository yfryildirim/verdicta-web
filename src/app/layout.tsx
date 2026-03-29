import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Verdicta - Who's Right?",
  description:
    "Settle your debates with AI. Share your side of the story and let Verdicta decide who's right.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white antialiased">{children}</body>
    </html>
  );
}
