import React from 'react'
import type { MenuProps } from 'antd'
import {
  FileTextOutlined,
  ContainerOutlined,
  AlertOutlined,
  AreaChartOutlined,
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
  TableOutlined,
} from '@ant-design/icons'

export type MenuItem = Required<MenuProps>['items'][number]

function getMenuItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return { key, icon, children, label, type } as MenuItem
}

export function getMenuItems(t: (key: string) => string): MenuItem[] {
  return [
    // I. Management Reports
    getMenuItem(t('nav.reports'), 'reports-group', <BarChartOutlined />, [
      getMenuItem(t('nav.profitReport'), 'profit-report', <FileTextOutlined />),
      getMenuItem(t('nav.finalReport'), 'final-report', <FileTextOutlined />),
      getMenuItem(t('nav.disputeManagement'), 'dispute-management', <AlertOutlined />),
      getMenuItem(t('nav.byMarketReport'), 'by-market-report', <AreaChartOutlined />),
    ]),

    // II. GL & Financial Reports
    getMenuItem(t('nav.glFinancial'), 'accounting-group', <AccountBookOutlined />, [
      getMenuItem(t('nav.dataPreparation'), 'data-preparation', null, [
        // getMenuItem(t('nav.generalLedger'), 'data-prep-overall', <DashboardOutlined />),
        getMenuItem('BettaMax', 'data-prep-bettamax', <ContainerOutlined />),
        getMenuItem('PingPong', 'data-prep-pingpong', <ContainerOutlined />),
        getMenuItem('Bank', 'data-prep-bank', <ContainerOutlined />),
        getMenuItem('PayPal Case', 'data-prep-paypal', <ContainerOutlined />),
        getMenuItem(t('nav.glEntry'), 'gl-entry', <FormOutlined />),
        getMenuItem(t('nav.actualCosts'), 'actual-costs', <BookOutlined />),
      ]),
      getMenuItem(t('nav.financialStatements'), 'financial-statements', null, [
        getMenuItem(t('nav.glViewer'), 'gl-viewer', <TableOutlined />),
        getMenuItem(t('nav.balanceSheet'), 'balance-sheet', <BookOutlined />),
        getMenuItem(t('nav.incomeStatement'), 'income-statement', <BookOutlined />),
        getMenuItem(t('nav.financialNotes'), 'financial-notes', <BookOutlined />),
        getMenuItem(t('nav.arApReport'), 'ar-ap-report', <BookOutlined />),
      ]),
    ]),

    // III. Settings
    getMenuItem(t('nav.settings'), 'settings-group', <AppstoreOutlined />, [
      getMenuItem(t('nav.support'), 'support', null, [
        getMenuItem(t('nav.exchangeRates'), 'exchange-rates', <DollarOutlined />),
        getMenuItem(t('nav.companies'), 'companies', <ContainerOutlined />),
        getMenuItem(t('nav.chartOfAccounts'), 'chart-of-accounts', <BookOutlined />),
        getMenuItem(t('nav.partners'), 'partners', <TeamOutlined />),
        getMenuItem(t('nav.fiscalPeriods'), 'fiscal-periods', <CalendarOutlined />),
      ]),
      getMenuItem(t('nav.configuration'), 'configuration', null, [
        getMenuItem(t('nav.reportConfig'), 'report-config', <SettingOutlined />),
        getMenuItem(t('nav.journalTypes'), 'journal-types', <SettingOutlined />),
      ]),
    ]),
  ]
}

export const defaultOpenKeys = [
  'reports-group',
  'accounting-group',
  'data-preparation',
  'financial-statements',
  'settings-group',
  'support',
  'configuration',
]

export const menuKeyToPath: Record<string, string> = {
  'profit-report': '/dashboard/reports/profit',
  'final-report': '/dashboard/reports/final',
  'dispute-management': '/dashboard/reports/dispute',
  'by-market-report': '/dashboard/reports/by-market',
  'reserve-hold': '/dashboard/reports/reserve-hold',
  'seller-cost': '/dashboard/reports/seller-cost',
  'supplier-cost': '/dashboard/reports/supplier-cost',
  // 'data-prep-overall':  '/dashboard/data-entry/overall',
  'data-prep-bettamax': '/dashboard/data-entry/bettamax',
  'data-prep-pingpong': '/dashboard/data-entry/pingpong',
  'data-prep-bank': '/dashboard/data-entry/bank',
  'data-prep-paypal': '/dashboard/data-entry/paypal',
  'gl-entry': '/dashboard/data-entry/gl-entry',
  'actual-costs': '/dashboard/data-entry/actual-costs',
  'gl-viewer': '/dashboard/accounting/gl-viewer',
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
}
