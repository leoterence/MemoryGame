import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "MemoryGames",
  description: "jeux qui vous peremt de travailler votre memoire",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >
        {children}
      </body>
    </html>
  );
}
