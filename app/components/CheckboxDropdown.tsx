'use client';

import { useState } from 'react';
import { Button, Checkbox, Divider, Dropdown, type DropdownProps } from 'antd';
import { cn } from '@/lib/utils';
import { DownOutlined } from '@ant-design/icons';
import { useT } from '@/lib/i18n/LocaleContext';

type Option<T> = {
  label: string;
  value: T;
};

type CheckboxDropdownProps<T extends string | number> = {
  label?: string;
  dropdownTitle?: string;
  options: Option<T>[];
  selected?: T[];
  onChange: (newValues: T[]) => void;
  className?: string;
} & Omit<DropdownProps, 'open' | 'onOpenChange' | 'popupRender' | 'children'>;

export default function CheckboxDropdown<T extends string | number>({
  label,
  dropdownTitle,
  options,
  selected = [],
  onChange,
  className,
  ...dropdownProps
}: CheckboxDropdownProps<T>) {
  const t = useT();
  const [open, setOpen] = useState(false);

  const handleChange = (option: T, checked: boolean) => {
    onChange(checked ? [...selected, option] : selected.filter((item) => item !== option));
  };

  const handleClear = () => onChange([]);
  const isEmpty = selected.length === 0;

  return (
    <Dropdown
      {...dropdownProps}
      open={open}
      onOpenChange={setOpen}
      trigger={['click']}
      popupRender={() => (
        <div className="p-1 bg-white rounded-lg shadow-secondary flex flex-col">
          {dropdownTitle && (
            <div className="px-3 text-fontSizeSM font-fontWeightNormal text-colorTextDescription">
              {dropdownTitle}
            </div>
          )}

          <div className="max-h-[300px] overflow-y-auto flex flex-col gap-1">
            {options.map((option) => (
              <Checkbox
                key={String(option.value)}
                checked={selected.includes(option.value)}
                className="!px-3 !py-1.5 hover:bg-[#0000000A] rounded-sm"
                onChange={(e) => handleChange(option.value, e.target.checked)}
              >
                <p className="mt-0.5">{option.label}</p>
              </Checkbox>
            ))}
          </div>

          <Divider style={{ margin: '5px 0' }} />
          <div
            className={`!px-3 !py-1 rounded-sm ${
              isEmpty
                ? 'text-colorTextDisabled cursor-not-allowed'
                : 'cursor-pointer hover:bg-[#0000000A]'
            }`}
            onClick={() => { if (!isEmpty) handleClear(); }}
          >
            {t('common.clearSelection')}
          </div>
        </div>
      )}
    >
      <Button
        onClick={() => setOpen(!open)}
        className={cn([
          '[&_.ant-btn-icon]:!h-full [&_.ant-btn-icon]:!pt-1 border border-colorBorderSecondary text-fontSizeBase',
          className,
          open
            ? 'border-colorPrimaryBorder text-colorPrimaryHover !shadow-[0_0_0_2px_rgba(87,76,250,0.10)]'
            : '',
        ])}
        icon={
          <DownOutlined
            className={cn(['transition-all ui-duration-200', open ? 'scale-y-[-1]' : ''])}
          />
        }
        iconPlacement="end"
      >
        <span className="text-fontSizeBase">{label ?? t('common.selectOptions')}</span>
      </Button>
    </Dropdown>
  );
}
