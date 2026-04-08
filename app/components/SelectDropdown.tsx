import { cn } from '@/lib/utils';
import { CheckOutlined, DownOutlined } from '@ant-design/icons';
import { Button, Dropdown } from 'antd';
import React, { useState } from 'react';

type SelectDropdownProps = {
  title: string;
  menuItems: {
    key: string;
    label: string;
    icon?: React.ReactNode;
  }[];
  value?: string;
  onChange?: (value: string) => void;
};

const SelectDropdown = ({ title, menuItems, value, onChange }: SelectDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [internalSelected, setInternalSelected] = useState<string>('');

  const selected = value !== undefined ? value : internalSelected;

  const handleMenuClick = (item: { key: string; label: string }) => {
    const newVal = selected === item.key ? '' : item.key;
    if (value === undefined) setInternalSelected(newVal);
    onChange?.(newVal);
  };

  const menu = (menuItems || []).map((item) => ({
    key: item.key,
    className: selected === item.key ? 'bg-controlItemBgActive' : '',
    onClick: () => handleMenuClick(item),
    label: (
      <div className={`w-full flex items-center gap-2 justify-between ${selected === item.key ? 'text-colorPrimary' : 'text-colorText'}`}>
        {item.label} {selected === item.key && <CheckOutlined />}
      </div>
    ),
  }));

  return (
    <Dropdown open={open} onOpenChange={setOpen} trigger={["click"]} menu={{ items: menu }} placement='bottomRight'>
      <Button
        className={cn([
          '[&_.ant-btn-icon]:!h-full [&_.ant-btn-icon]:!pt-1 border border-colorBorderSecondary text-fontSizeBase',
          open
            ? 'border-colorPrimaryBorder text-colorPrimaryHover !shadow-[0_0_0_2px_rgba(87,76,250,0.10)]'
            : '',
        ])}
      >
        <span className="text-fontSizeBase">
          {selected && selected !== 'all'
            ? (menuItems.find(m => m.key === selected)?.label || title)
            : title}
        </span>
        <div className={cn('ml-1 transition-transform', open ? 'rotate-180' : '')}>
          <DownOutlined />
        </div>
      </Button>
    </Dropdown>
  );
};

export default SelectDropdown;
