import type { Metadata } from 'next'
import './globals.css'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Providers } from '@/app/components/Providers'
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'Sky Finance',
  description: 'Back-office financial management for Bettamax eCommerce SaaS platform',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={inter.className}>
        <AntdRegistry>
          <Providers session={session}>
            {children}
          </Providers>
        </AntdRegistry>
      </body>
    </html>
  );
}
