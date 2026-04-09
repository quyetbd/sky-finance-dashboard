'use client';

import { Button } from 'antd';
import { useLocale, type Locale } from '@/lib/i18n/LocaleContext';

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  const toggle = () => setLocale(locale === 'en' ? 'vi' : 'en');

  return (
    <Button
      size="small"
      onClick={toggle}
      style={{
        fontWeight: 600,
        fontSize: 12,
        minWidth: 40,
        padding: '0 8px',
        borderColor: '#d9d9d9',
      }}
    >
      {locale === 'en' ? 'VI' : 'EN'}
    </Button>
  );
}
