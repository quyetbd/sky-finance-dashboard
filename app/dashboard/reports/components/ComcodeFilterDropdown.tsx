import CheckboxDropdown from '@/app/components/CheckboxDropdown';
import React, { useState } from 'react';
import { COMCODE_OPTIONS } from '../profit/data';

const ComcodeFilterDropdown = () => {
  const [comcode, setComcode] = useState<string[]>([]);

  const handleChangeComcode = (value: string[] | undefined) => {
    setComcode(value ? value : []);
  };

  return (
    <CheckboxDropdown
      label="Comcode"
      options={COMCODE_OPTIONS}
      selected={comcode}
      onChange={(value) => {
        handleChangeComcode(value.length ? value : undefined);
      }}
    />
  );
};

export default ComcodeFilterDropdown;
