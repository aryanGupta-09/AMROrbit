import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Vivli Dashboard | TavLab",
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
