'use client';

import { Card } from 'antd';
import { useT } from '@/lib/i18n/LocaleContext';

export default function IncomeStatementPage() {
  const t = useT();
  return (
    <div>
      <h1 style={{ marginBottom: '24px' }}>{t('accounting.incomeStatement')}</h1>
      <Card><p>{t('common.financialStatementPlaceholder')}</p></Card>
    </div>
  );
}
