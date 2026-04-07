'use client';

import { Card, Row, Col, Statistic } from 'antd';
import { FileTextOutlined, AlertOutlined, AreaChartOutlined } from '@ant-design/icons';
import { useT } from '@/lib/i18n/LocaleContext';

export default function DashboardHome() {
  const t = useT();

  return (
    <div>
      <h1 style={{ marginBottom: '24px' }}>{t('dashboard.welcome')}</h1>

      <Row gutter={16}>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable>
            <Statistic
              title={t('dashboard.profitReport')}
              value={7}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1d4ed8' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable>
            <Statistic
              title={t('dashboard.disputes')}
              value={3}
              prefix={<AlertOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable>
            <Statistic
              title={t('dashboard.reports')}
              value={12}
              prefix={<AreaChartOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable>
            <Statistic
              title={t('dashboard.periods')}
              value={24}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: '24px' }}>
        <h3>{t('dashboard.recentActivity')}</h3>
        <p>{t('dashboard.noRecentActivity')}</p>
      </Card>
    </div>
  );
}
