import type { Metadata } from "next";
import "./globals.scss";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Starkgov",
  description: "StarkGov governance platform",
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
