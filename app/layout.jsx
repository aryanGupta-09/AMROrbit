import { Inter } from "next/font/google";
import "./globals.css";
import "./polyfills.js";

import Navbar from "@/components/layout/Navbar";
import { ToasterProvider } from "@/helper/ToasterProvider";
import { Suspense } from "react";

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
                <link
                    rel="icon"
                    href="/images/tavlab-favicon.webp"
                    type="image/webp"
                />
            </head>
            <body className={inter.className}>
                <ToasterProvider />
                <Navbar />
                <main>
                    <Suspense>{children}</Suspense>
                </main>
            </body>
        </html>
    );
}
