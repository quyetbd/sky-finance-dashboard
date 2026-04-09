'use client'

import { Typography } from 'antd'

export type ActionItem = {
  label: string
  onClick: () => void
  danger?: boolean
  muted?: boolean
}

export default function ActionLinks({
  primary,
  secondary,
}: {
  primary: ActionItem
  secondary: ActionItem
}) {
  return (
    <span style={{ whiteSpace: 'nowrap' }}>
      <Typography.Link onClick={primary.onClick}>{primary.label}</Typography.Link>
      {' / '}
      <Typography.Link
        type={secondary.danger ? 'danger' : undefined}
        onClick={secondary.onClick}
        style={secondary.muted ? { color: '#999' } : undefined}
      >
        {secondary.label}
      </Typography.Link>
    </span>
  )
}
