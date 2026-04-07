# GL Partition Migration

Sau khi chạy `prisma migrate dev --name init`, cần chạy thêm SQL sau để setup GL partitioning.
Prisma không hỗ trợ native PARTITION BY — phải dùng raw SQL.

## Bước 1: Chuyển gl_entries thành partitioned table

```sql
-- Backup dữ liệu nếu có
CREATE TABLE gl_entries_backup AS SELECT * FROM gl_entries;

-- Drop và recreate với PARTITION BY
DROP TABLE gl_entries;

CREATE TABLE gl_entries (
  id              VARCHAR NOT NULL,
  comcode         VARCHAR NOT NULL,
  data_source     VARCHAR NOT NULL,
  journal_type    VARCHAR NOT NULL,
  doc_num         VARCHAR NOT NULL,
  reference_txn_id VARCHAR,
  bank_account_num VARCHAR,
  account_code    INTEGER NOT NULL,
  partner         VARCHAR,
  period          VARCHAR NOT NULL,
  ref_num         VARCHAR,
  trans_date      TIMESTAMP NOT NULL,
  doc_date        TIMESTAMP NOT NULL,
  input_curr      VARCHAR NOT NULL,
  fnc_curr        VARCHAR NOT NULL DEFAULT 'USD',
  input_dr        DECIMAL(18,4) NOT NULL DEFAULT 0,
  input_cr        DECIMAL(18,4) NOT NULL DEFAULT 0,
  x_rate          DECIMAL(18,6) NOT NULL DEFAULT 1,
  rate_type       VARCHAR NOT NULL DEFAULT 'Mul',
  accounted_dr    DECIMAL(18,4) NOT NULL DEFAULT 0,
  accounted_cr    DECIMAL(18,4) NOT NULL DEFAULT 0,
  description     VARCHAR,
  balance_impact  VARCHAR,
  is_reversal     BOOLEAN NOT NULL DEFAULT FALSE,
  reversed_id     VARCHAR,
  partner_tax_id  VARCHAR,
  segment         VARCHAR,
  created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
  created_by      VARCHAR NOT NULL
) PARTITION BY RANGE (period);

-- Indexes
CREATE INDEX ON gl_entries (comcode, period);
CREATE INDEX ON gl_entries (account_code, period);
CREATE INDEX ON gl_entries (doc_num);
CREATE INDEX ON gl_entries (reference_txn_id);
```

## Bước 2: Tạo partition cho từng tháng

```sql
-- Script tạo partition (chạy mỗi đầu tháng hoặc dùng cron)
-- Ví dụ: tháng 202601
CREATE TABLE gl_entries_202601 PARTITION OF gl_entries
  FOR VALUES FROM ('202601') TO ('202602');

CREATE TABLE gl_entries_202602 PARTITION OF gl_entries
  FOR VALUES FROM ('202602') TO ('202603');
-- ...
```

## Lưu ý

- Tạo partition **trước** khi INSERT dữ liệu cho tháng đó.
- Nếu không có partition phù hợp, PostgreSQL sẽ throw lỗi.
- Nên tạo 2-3 partition trước (tháng hiện tại + tháng tới).
