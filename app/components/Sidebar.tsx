'use client';

import React from 'react';
import { Layout, Menu, Button, Dropdown, Avatar, Space, Breadcrumb, type MenuProps } from 'antd';
import {
  LogoutOutlined,
  UserOutlined,
  LineChartOutlined,
  DoubleRightOutlined,
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { menuItems, menuKeyToPath } from '@/lib/menu';
import { useAuth } from '@/lib/auth/useAuth';

const { Sider, Header } = Layout;

// ─── Sidebar ─────────────────────────────────────────────────────────────────

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

export function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isFC } = useAuth();

  // Filter out "Quản lý User" for non-FC roles
  const visibleItems = isFC
    ? menuItems
    : menuItems.filter((item) => {
        if (!item || typeof item !== 'object') return true;
        const key = (item as { key?: string }).key;
        return key !== 'user-management';
      });

  const getCurrentKey = () => {
    for (const [key, path] of Object.entries(menuKeyToPath)) {
      if (pathname === path || pathname.startsWith(path + '/')) return key;
    }
    return 'profit-report';
  };

  return (
    <Sider
      className="h-full overflow-hidden [&_.ant-layout-sider-children]:flex [&_.ant-layout-sider-children]:flex-col"
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={240}
      collapsedWidth={60}
      theme="light"
    >
        {/* Logo */}
        <div
          style={{ height: "65px" }}
          className={`flex items-center justify-center border-b border-gray-200 overflow-hidden whitespace-nowrap transition-padding duration-200 ${collapsed ? 'p-0' : 'px-5'}`}
        >
          {collapsed ? (
            <LineChartOutlined style={{ fontSize: 20 }} />
          ) : (
            <span className="text-colorPrimary text-fontSizeHeading3 uppercase font-[700]">
              Sky Finance
            </span>
          )}
        </div>

        {/* Menu */}
        <Menu
          mode="inline"
          selectedKeys={[getCurrentKey()]}
          defaultOpenKeys={collapsed ? [] : ['reports-group']}
          items={visibleItems}
          onClick={({ key }) => {
            const path = menuKeyToPath[key as string];
            if (path) router.push(path);
          }}
          inlineIndent={16}
          className="fade-scrollbar w-full !outline-none !p-sm flex-1 overflow-y-auto !border-none [&_.ant-menu-item-only-child]:!pl-0"
        />
      <div className="w-full p-2 flex justify-end">
        <Button
          type="text"
          icon={<DoubleRightOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{ width: 60 }}
        />
      </div>
    </Sider>
  );
}

export function TopHeader() {
  const pathname = usePathname();
  const { user } = useAuth();

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
    else if (pathname.includes('/users')) parts.push({ title: 'Quản lý User' });
    else if (pathname.includes('/config')) parts.push({ title: 'Thiết lập chung' });
    return parts;
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      void signOut({ callbackUrl: '/login' });
    }
  };

  const userMenu: MenuProps['items'] = [
    {
      key: 'info',
      label: <span style={{ fontSize: 12, color: '#6b7280' }}>{user?.role ?? ''}</span>,
      disabled: true,
    },
    { type: 'divider' },
    { key: 'logout', label: 'Đăng xuất', icon: <LogoutOutlined />, danger: true },
  ];

  return (
    <Header
      style={{
        background: '#fff',
        padding: '16px',
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
        <Breadcrumb items={getBreadcrumb()} />
      </Space>

      <Space size={8}>
        <span style={{ fontSize: 13, color: '#595959' }}>{user?.email ?? ''}</span>
        <Dropdown
          menu={{ items: userMenu, onClick: handleMenuClick }}
          placement="bottomRight"
          trigger={['click']}
        >
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
