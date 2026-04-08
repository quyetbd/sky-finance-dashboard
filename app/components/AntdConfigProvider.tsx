'use client';

import { App, ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import enUS from 'antd/locale/en_US';
import { useLocale } from '@/lib/i18n/LocaleContext';

const antdLocales = { vi: viVN, en: enUS };

export function AntdConfigProvider({ children }: { children: React.ReactNode }) {
  const { locale } = useLocale();

  return (
    <ConfigProvider
      locale={antdLocales[locale]}
      theme={{
        cssVar: { key: 'btm' },
        hashed: false,
        token: {
          colorPrimary: '#1d4ed8',
          borderRadius: 6,
          fontFamily: 'var(--font-geist-sans), sans-serif',
        },
      }}
    >
      <App>
        {children}
      </App>
    </ConfigProvider>
  );
}
