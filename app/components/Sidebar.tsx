'use client';

import React from 'react';
import { Layout, Menu, Button, Dropdown, Avatar, Space, Breadcrumb, type MenuProps } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  UserOutlined,
  LineChartOutlined,
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import { menuItems, menuKeyToPath } from '@/lib/menu';

const { Sider, Header } = Layout;

// ─── Sidebar ─────────────────────────────────────────────────────────────────

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

export function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const getCurrentKey = () => {
    for (const [key, path] of Object.entries(menuKeyToPath)) {
      if (pathname === path || pathname.startsWith(path + '/')) return key;
    }
    return 'profit-report';
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={240}
      collapsedWidth={60}
      style={{
        background: '#fff',
        boxShadow: '2px 0 8px rgba(0,0,0,0.06)',
        overflow: 'auto',
        height: '100vh',
        position: 'sticky',
        top: 0,
        left: 0,
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? 0 : '0 20px',
          borderBottom: '1px solid #f0f0f0',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          transition: 'padding 0.2s',
        }}
      >
        {collapsed ? (
          <LineChartOutlined style={{ fontSize: 20, color: '#1d4ed8' }} />
        ) : (
          <span style={{ fontSize: 16, fontWeight: 700, color: '#1d4ed8' }}>Finance Dashboard</span>
        )}
      </div>

      {/* Menu — openKeys controlled prevents mount animation */}
      <Menu
        mode="inline"
        selectedKeys={[getCurrentKey()]}
        defaultOpenKeys={collapsed ? [] : ['reports-group']}
        items={menuItems}
        onClick={({ key }) => {
          const path = menuKeyToPath[key as string];
          if (path) router.push(path);
        }}
        inlineIndent={16}
        style={{
          border: 'none',
          background: '#fff',
          fontSize: 13,
          paddingTop: 8,
        }}
      />
      <div className="absolute bottom-0 w-full border-t border-gray-200 p-2 flex justify-end">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            width: 60,
          }}
        />
      </div>
    </Sider>
  );
}

export function TopHeader() {
  const pathname = usePathname();

  const getBreadcrumb = () => {
    const parts: { title: string }[] = [{ title: 'Trang chủ' }];
    if (pathname.includes('/reports/profit'))
      parts.push({ title: 'Báo cáo quản trị' }, { title: 'Profit Report' });
    else if (pathname.includes('/reports/final'))
      parts.push({ title: 'Báo cáo quản trị' }, { title: 'Final Report' });
    else if (pathname.includes('/reports/dispute'))
      parts.push({ title: 'Báo cáo quản trị' }, { title: 'Dispute Management' });
    else if (pathname.includes('/reports/by-market'))
      parts.push({ title: 'Báo cáo quản trị' }, { title: 'By Market Report' });
    else if (pathname.includes('/reports/reserve'))
      parts.push({ title: 'Báo cáo quản trị' }, { title: 'Reserve Hold' });
    else if (pathname.includes('/reports/seller'))
      parts.push({ title: 'Báo cáo quản trị' }, { title: 'Seller Cost' });
    else if (pathname.includes('/reports/supplier'))
      parts.push({ title: 'Báo cáo quản trị' }, { title: 'Supplier Cost' });
    else if (pathname.includes('/data-entry'))
      parts.push({ title: 'Ghi sổ & báo cáo tài chính' }, { title: 'Chuẩn bị số liệu' });
    else if (pathname.includes('/accounting'))
      parts.push({ title: 'Ghi sổ & báo cáo tài chính' }, { title: 'Báo cáo tài chính' });
    else if (pathname.includes('/config')) parts.push({ title: 'Thiết lập chung' });
    return parts;
  };

  const userMenu: MenuProps['items'] = [
    { key: 'profile', label: 'Profile', icon: <UserOutlined /> },
    { type: 'divider' },
    { key: 'logout', label: 'Logout', icon: <LogoutOutlined />, danger: true },
  ];

  return (
    <Header
      style={{
        background: '#fff',
        padding: '0 16px 0 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        borderBottom: '1px solid #f0f0f0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <Space size={4}>
        <Breadcrumb items={getBreadcrumb()} style={{ fontSize: 13 }} />
      </Space>

      <Space size={8}>
        <span style={{ fontSize: 13, color: '#595959' }}>User</span>
        <Dropdown menu={{ items: userMenu }} placement="bottomRight" trigger={['click']}>
          <Avatar
            size={32}
            style={{ backgroundColor: '#1d4ed8', cursor: 'pointer' }}
            icon={<UserOutlined />}
          />
        </Dropdown>
      </Space>
    </Header>
  );
}
