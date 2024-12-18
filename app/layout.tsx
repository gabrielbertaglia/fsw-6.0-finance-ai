import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import { Toaster } from "./_components/ui/sonner";
import "./globals.css";

const mulish = Mulish({
  subsets: ["latin-ext"],
});

export const metadata: Metadata = {
  title: "Finance AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${mulish.className} dark antialiased`}
        suppressHydrationWarning
      >
        <ClerkProvider
          appearance={{
            baseTheme: dark,
          }}
        >
          <TooltipProvider>
            <div className="flex h-full flex-col overflow-hidden">
              {children}
            </div>
            <Toaster />
          </TooltipProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
