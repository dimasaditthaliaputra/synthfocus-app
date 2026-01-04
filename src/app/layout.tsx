import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SYNTHFOCUS | Pixel Art Daily Scheduler",
  description: "A retro 8-bit daily scheduler with AI-powered planning. Manage your work, college, and coding tasks.",
  keywords: ["scheduler", "productivity", "pixel art", "retro", "AI planner"],
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
