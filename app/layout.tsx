import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "云序 YUNXU · 云计算产品与服务",
  description: "云序云服务官网概念样板：弹性云服务器、高频云服务器、裸金属与安全证书，探索部署区域、产品配置与服务支持。",
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
