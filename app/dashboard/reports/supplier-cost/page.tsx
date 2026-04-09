'use client';

import { Card } from 'antd';
import { useT } from '@/lib/i18n/LocaleContext';

export default function SupplierCostPage() {
  const t = useT();
  return (
    <div>
      <h1 style={{ marginBottom: '24px' }}>{t('supplierCostReport.title')}</h1>
      <Card><p>{t('common.reportPlaceholder')}</p></Card>
    </div>
  );
}
