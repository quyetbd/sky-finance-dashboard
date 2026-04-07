import { Card, Row, Col, Statistic } from 'antd'
import { FileTextOutlined, AlertOutlined, AreaChartOutlined } from '@ant-design/icons'

export default function DashboardHome() {
  return (
    <div>
      <h1 style={{ marginBottom: '24px' }}>Welcome to BTM Finance Dashboard</h1>

      <Row gutter={16}>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable>
            <Statistic
              title="Profit Report"
              value={7}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1d4ed8' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable>
            <Statistic
              title="Disputes"
              value={3}
              prefix={<AlertOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable>
            <Statistic
              title="Reports"
              value={12}
              prefix={<AreaChartOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable>
            <Statistic
              title="Periods"
              value={24}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: '24px' }}>
        <h3>Recent Activity</h3>
        <p>No recent activity</p>
      </Card>
    </div>
  )
}
