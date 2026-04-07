import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Providers } from '@/app/components/Providers'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'BTM Finance System',
  description: 'Back-office financial management for Bettamax eCommerce SaaS platform',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AntdRegistry>
          <Providers session={session}>
            {children}
          </Providers>
        </AntdRegistry>
      </body>
    </html>
  )
}
