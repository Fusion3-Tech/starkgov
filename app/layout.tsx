import type { Metadata } from "next";
import "./globals.scss";
import { Manrope, Space_Grotesk } from "next/font/google";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/next";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Starkgov",
  description:
    "StarkGov is a governance hub for Starknet: explore proposals, delegate votes, and track participation in the Starknet ecosystem.",
  openGraph: {
    title: "StarkGov",
    description:
      "StarkGov is a governance hub for Starknet: explore proposals, delegate votes, and track participation in the Starknet ecosystem.",
    siteName: "StarkGov",
    images: [
      {
        url: "/logoStarkGov.png",
        width: 512,
        height: 512,
        alt: "StarkGov logo",
      },
    ],
  },
  icons: {
    icon: [
      { url: "/favicon.svg" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${spaceGrotesk.variable}`}>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
