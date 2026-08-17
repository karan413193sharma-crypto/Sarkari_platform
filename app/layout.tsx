import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/store/Provider";
import AuthModal from "@/components/auth/AuthModal";
import AuthListener from "@/components/auth/AuthListener";
import UserMenu from "@/components/layout/UserMenu";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "SarkariPath — Find the government exams you qualify for",
  description:
    "Add your qualification once and see every government exam you're eligible for, with syllabus, dates and official links in one place.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <StoreProvider>
          <AuthListener />
          <UserMenu />
          {children}
          <AuthModal />
        </StoreProvider>
      </body>
    </html>
  );
}