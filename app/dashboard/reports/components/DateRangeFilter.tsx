'use client';

import { DatePicker } from 'antd';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

type Props = {
  value?: [dayjs.Dayjs | null, dayjs.Dayjs | null];
  onChange?: (start: dayjs.Dayjs | null, end: dayjs.Dayjs | null) => void;
};

export const DEFAULT_DATE_RANGE: [dayjs.Dayjs, dayjs.Dayjs] = [
  dayjs().startOf('month'),
  dayjs(),
];

export default function DateRangeFilter({ value, onChange }: Props) {
  return (
    <RangePicker
      value={value}
      defaultValue={DEFAULT_DATE_RANGE}
      format="DD-MM-YYYY"
      allowClear={false}
      onChange={(dates) => onChange?.(dates?.[0] ?? null, dates?.[1] ?? null)}
    />
  );
}
