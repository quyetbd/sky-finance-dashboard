'use client';

import { Card } from 'antd';
import { useT } from '@/lib/i18n/LocaleContext';

export default function DataEntryPaypalPage() {
  const t = useT();
  return (
    <div>
      <h1 style={{ marginBottom: '24px' }}>{t('dataEntry.paypal')}</h1>
      <Card><p>{t('common.dataEntryPlaceholder')}</p></Card>
    </div>
  );
}
