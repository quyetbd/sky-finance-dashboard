import React from 'react'
import type { MenuProps } from 'antd'
import {
  FileTextOutlined,
  ContainerOutlined,
  AlertOutlined,
  AreaChartOutlined,
  LockOutlined,
  DollarOutlined,
  SettingOutlined,
  DashboardOutlined,
  FormOutlined,
  BookOutlined,
  TeamOutlined,
  CalendarOutlined,
  BarChartOutlined,
  AccountBookOutlined,
  AppstoreOutlined,
  UserOutlined,
} from '@ant-design/icons'

export type MenuItem = Required<MenuProps>['items'][number]

function getMenuItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem
}

export const menuItems: MenuItem[] = [
  // I. Báo cáo quản trị (Management Reports)
  getMenuItem('Báo cáo quản trị', 'reports-group', <BarChartOutlined />, [
    getMenuItem('Profit Report', 'profit-report', <FileTextOutlined />),
    getMenuItem('Final Report', 'final-report', <FileTextOutlined />),
    getMenuItem('Dispute Management', 'dispute-management', <AlertOutlined />),
    getMenuItem('By Market Report', 'by-market-report', <AreaChartOutlined />),
    // getMenuItem('Reserve Hold', 'reserve-hold', <LockOutlined />),
    // getMenuItem('Seller Cost', 'seller-cost', <DollarOutlined />),
    // getMenuItem('Supplier Cost', 'supplier-cost', <DollarOutlined />),
  ]),

  // II. Ghi sổ & báo cáo tài chính (GL & Financial Reports)
  getMenuItem('Ghi sổ & báo cáo tài chính', 'accounting-group', <AccountBookOutlined />, [
    getMenuItem('Chuẩn bị số liệu và ghi sổ', 'data-preparation', null, [
      getMenuItem('Sổ cái', 'data-prep-overall', <DashboardOutlined />),
      getMenuItem('BettaMax', 'data-prep-bettamax', <ContainerOutlined />),
      getMenuItem('PingPong', 'data-prep-pingpong', <ContainerOutlined />),
      getMenuItem('Bank', 'data-prep-bank', <ContainerOutlined />),
      getMenuItem('PayPal Case', 'data-prep-paypal', <ContainerOutlined />),
      getMenuItem('GL Entry', 'gl-entry', <FormOutlined />),
      getMenuItem('Supplier Cost & Seller Cost thực tế', 'actual-costs', <BookOutlined />),
    ]),
    getMenuItem('Báo cáo tài chính', 'financial-statements', null, [
      getMenuItem('Bảng cân đối thứ', 'balance-sheet', <BookOutlined />),
      getMenuItem('Báo cáo tài chính', 'income-statement', <BookOutlined />),
      getMenuItem('Thuyết minh báo cáo tài chính', 'financial-notes', <BookOutlined />),
      getMenuItem('Báo cáo Phải thu, Phải trả', 'ar-ap-report', <BookOutlined />),
    ]),
  ]),

  // III. Quản lý User (FC only — filtered in Sidebar)
  getMenuItem('Quản lý User', 'user-management', <UserOutlined />),

  // IV. Thiết lập chung (Settings)
  getMenuItem('Thiết lập chung', 'settings-group', <AppstoreOutlined />, [
    getMenuItem('Hỗ trợ', 'support', null, [
      getMenuItem('Khai báo tỷ giá', 'exchange-rates', <DollarOutlined />),
      getMenuItem('Quản lý Công ty', 'companies', <ContainerOutlined />),
      getMenuItem('Hệ thống tài khoản', 'chart-of-accounts', <BookOutlined />),
      getMenuItem('Quản lý đối tác', 'partners', <TeamOutlined />),
      getMenuItem('Quản lý Kỳ kế toán', 'fiscal-periods', <CalendarOutlined />),
    ]),
    getMenuItem('Cấu hình', 'configuration', null, [
      getMenuItem('Cấu hình báo cáo', 'report-config', <SettingOutlined />),
      getMenuItem('Loại giao dịch', 'journal-types', <SettingOutlined />),
    ]),
  ]),
]

// Default open keys — all groups expanded on load (no mount animation)
export const defaultOpenKeys = [
  'reports-group',
  'accounting-group',
  'data-preparation',
  'financial-statements',
  'settings-group',
  'support',
  'configuration',
]

// Map key to route path
export const menuKeyToPath: Record<string, string> = {
  'profit-report': '/dashboard/reports/profit',
  'final-report': '/dashboard/reports/final',
  'dispute-management': '/dashboard/reports/dispute',
  'by-market-report': '/dashboard/reports/by-market',
  'reserve-hold': '/dashboard/reports/reserve-hold',
  'seller-cost': '/dashboard/reports/seller-cost',
  'supplier-cost': '/dashboard/reports/supplier-cost',
  'data-prep-overall': '/dashboard/data-entry/overall',
  'data-prep-bettamax': '/dashboard/data-entry/bettamax',
  'data-prep-pingpong': '/dashboard/data-entry/pingpong',
  'data-prep-bank': '/dashboard/data-entry/bank',
  'data-prep-paypal': '/dashboard/data-entry/paypal',
  'gl-entry': '/dashboard/data-entry/gl-entry',
  'actual-costs': '/dashboard/data-entry/actual-costs',
  'balance-sheet': '/dashboard/accounting/balance-sheet',
  'income-statement': '/dashboard/accounting/income-statement',
  'financial-notes': '/dashboard/accounting/financial-notes',
  'ar-ap-report': '/dashboard/accounting/ar-ap',
  'exchange-rates': '/dashboard/config/exchange-rates',
  'companies': '/dashboard/config/companies',
  'chart-of-accounts': '/dashboard/config/chart-of-accounts',
  'partners': '/dashboard/config/partners',
  'fiscal-periods': '/dashboard/config/fiscal-periods',
  'report-config': '/dashboard/config/report-config',
  'journal-types': '/dashboard/config/journal-types',
  'user-management': '/dashboard/users',
}
