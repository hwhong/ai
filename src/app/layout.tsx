import "./globals.css";
import { Inter } from "next/font/google";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI",
  description: "AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
