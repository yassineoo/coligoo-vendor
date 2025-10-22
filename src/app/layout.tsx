import type { Metadata } from "next";
import ReduxProvider from "@/../providers/ReduxProvider";
import { Roboto } from "next/font/google";
import "./globals.css";
import ToastContainer from "@/components/ToastContainer";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ColiGoo",
  description: "ColiGoo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <ReduxProvider>{children}</ReduxProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
