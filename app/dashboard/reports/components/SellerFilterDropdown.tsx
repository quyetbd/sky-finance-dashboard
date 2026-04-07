import CheckboxDropdown from '@/app/components/CheckboxDropdown';
import React, { useState } from 'react';
import { SELLER_OPTIONS } from '../profit/data';

const SellerFilterDropdown = () => {
  const [seller, setSeller] = useState<string[]>([]);

  const handleChangeSeller = (value: string[] | undefined) => {
    setSeller(value ? value : []);
  };

  return (
    <CheckboxDropdown
      label="Seller"
      options={SELLER_OPTIONS}
      selected={seller}
      onChange={(value) => {
        handleChangeSeller(value.length ? value : undefined);
      }}
    />
  );
};

export default SellerFilterDropdown;
