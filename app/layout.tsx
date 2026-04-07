import type { Metadata } from 'next';
import './globals.css';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/index';
import { Providers } from '@/app/components/Providers';
import { themeConfig } from '@/lib/utils/colors';
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
    <html lang="vi">
      <body className={inter.className}>
        <AntdRegistry>
          <ConfigProvider
            locale={viVN}
            theme={{
              token: {
                ...themeConfig.token,
                fontFamily: 'inherit',
              },
            }}
          >
            <Providers session={session}>{children}</Providers>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
