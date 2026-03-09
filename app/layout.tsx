import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { SidebarContextProvider } from "@/src/context/sidebar.context";
import IndexLayout from "@/src/indexLayout/indexLayout";
import { SocketProvider } from "@/src/context/SocketProvider";
import { getStoredUser } from "@/src/libs/helpers";

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
}: {
  children: React.ReactNode;
}) {

  const user = getStoredUser();

  return (
    <html lang="en">
      <body className={`${roboto.className} antialiased`}>

        <SidebarContextProvider>

          <SocketProvider>

            <IndexLayout>
              {children}
            </IndexLayout>

          </SocketProvider>

        </SidebarContextProvider>

      </body>
    </html>
  );
}
