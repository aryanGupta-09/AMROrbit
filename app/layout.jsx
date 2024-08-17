import { Inter } from "next/font/google";
import "./globals.css";
import './polyfills.js';

import Navbar from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AMROrbit | TavLab",
  description: "",
};

export default function RootLayout({ children }) {
  return (

    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <link rel="icon" href="/images/tavlab-favicon.webp" type="image/webp" />
      </head>
      <body className={inter.className}>
        <Navbar />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
