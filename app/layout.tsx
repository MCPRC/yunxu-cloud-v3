import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "安信云 · 国内高防与 DDoS 防护",
  description: "安信云专注国内高防与 DDoS 防护。了解网站、游戏和在线服务的防护选型思路，比较部署地域与服务器配置。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
