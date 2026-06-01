import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AIP Inc — Software & Hardware Solutions",
    template: "%s | AIP Inc",
  },
  description:
    "Professional software development and hardware project guidance. Get a custom quote for your next project — websites, web apps, IoT, and more.",
  keywords: [
    "software development",
    "website development",
    "hardware projects",
    "IoT",
    "custom software",
    "web applications",
    "AIP Inc",
  ],
  openGraph: {
    title: "AIP Inc — Software & Hardware Solutions",
    description:
      "Professional software development and hardware project guidance. Get a custom quote for your next project.",
    type: "website",
    locale: "en_US",
  },
};

import { prisma } from "@/lib/prisma";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let themeColor = "#6c5ce7";
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: "theme_color" } });
    if (setting?.value) themeColor = setting.value;
  } catch {}

  // Basic hex to rgb conversion approximation logic can be skipped by just using hex alpha.
  // E6 = 90%, 4D = 30% alpha roughly.
  const customStyles = {
    "--accent": themeColor,
    "--accent-light": `${themeColor}E6`,
    "--accent-dark": themeColor,
    "--accent-glow": `${themeColor}4D`,
    "--gradient-accent": `linear-gradient(135deg, ${themeColor}, ${themeColor}E6)`,
    "--gradient-hero": `linear-gradient(135deg, ${themeColor}, #00b894)`,
  } as React.CSSProperties;

  return (
    <html lang="en">
      <body style={customStyles}>{children}</body>
    </html>
  );
}
