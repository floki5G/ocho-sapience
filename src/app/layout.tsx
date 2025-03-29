import type { Metadata } from "next";
import "./globals.css";



export const metadata: Metadata = {
  title: "OCHO Sapience",
  description: "OCHO Sapience is a web application that provides real-time stock market data and portfolio management tools. It allows users to track their investments, analyze market trends, and make informed decisions based on up-to-date information.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="px-2"
      >
        {children}
      </body>
    </html>
  );
}
