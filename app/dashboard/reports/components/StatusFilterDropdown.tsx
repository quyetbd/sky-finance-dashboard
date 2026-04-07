import CheckboxDropdown from '@/app/components/CheckboxDropdown';
import React from 'react';
import { STATUS_OPTIONS } from '../profit/data';

const StatusFilterDropdown = () => {
  const [status, setStatus] = React.useState<string[]>([]);

  const handleChangeStatus = (value: string[] | undefined) => {
    setStatus(value ? value : []);
  };

  return (
    <CheckboxDropdown
      label="Status"
      options={STATUS_OPTIONS}
      selected={status}
      onChange={(value) => {
        handleChangeStatus(value.length ? value : undefined);
      }}
    />
  );
};

export default StatusFilterDropdown;
