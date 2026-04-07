'use client';

import { Card } from 'antd';
import { useT } from '@/lib/i18n/LocaleContext';

export default function FiscalPeriodsPage() {
  const t = useT();
  return (
    <div>
      <h1 style={{ marginBottom: '24px' }}>{t('config.fiscalPeriods')}</h1>
      <Card><p>{t('common.configPlaceholder')}</p></Card>
    </div>
  );
}
