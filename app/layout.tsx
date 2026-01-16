import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { SidebarContextProvider } from "@/src/context/sidebar.context";
import IndexLayout from "@/src/indexLayout/indexLayout";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MESTRE.IA",
  description: "MESTRE.IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.className} antialiased`}
      >
        <SidebarContextProvider>
          <IndexLayout>
            {children}
          </IndexLayout>
        </SidebarContextProvider>
      </body>
    </html>
  );
}
