import type { Metadata } from "next";
import "./globals.scss";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/next";

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
        url: "/logoStarkGov.svg",
        width: 512,
        height: 512,
        alt: "StarkGov logo",
      },
    ],
  },
  icons: {
    icon: "/logoStarkGov.svg",
    shortcut: "/logoStarkGov.svg",
    apple: "/logoStarkGov.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
