import { PrismaClient } from '@prisma/client'

/**
 * Generate GL Entry IDs — Format: "YYYYMM" + 8 digits = "20260100000001"
 *
 * Dùng PostgreSQL sequence per period để đảm bảo concurrency-safe.
 * Sequence được tạo tự động lần đầu tiên khi period mới xuất hiện.
 *
 * KHÔNG dùng UUID — GL ID phải có thứ tự và traceability theo period.
 */
export async function generateGlIds(
  prisma: PrismaClient,
  period: string,
  count: number
): Promise<string[]> {
  const seqName = `gl_seq_${period}`

  // Tạo sequence nếu chưa tồn tại
  await prisma.$executeRawUnsafe(`
    CREATE SEQUENCE IF NOT EXISTS "${seqName}"
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO CYCLE
  `)

  // Lấy `count` values trong một query (atomic)
  const result = await prisma.$queryRawUnsafe<Array<{ nextval: bigint }>>(
    `SELECT nextval('"${seqName}"') FROM generate_series(1, ${count})`
  )

  return result.map((row) => {
    const seq = String(row.nextval).padStart(8, '0')
    return `${period}${seq}`
  })
}
