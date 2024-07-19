import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from '@/context/UserContext/userContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'Grayola',
  description: 'Nuestro equipo de expertos te brinda soluciones creativas para impulsar tu marca o proyecto.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
