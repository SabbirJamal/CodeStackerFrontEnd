import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visit Oman",
  description: "Discover and plan your journey through Oman",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <body>{children}</body>
    </html>
  );
}