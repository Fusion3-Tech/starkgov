import type { Metadata } from "next";
import "./globals.scss";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Starkgov",
  description: "StarkGov governance platform",
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
      </body>
    </html>
  );
}
