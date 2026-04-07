import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Danh sách Comcode cốt lõi — cần confirm từ business
// Hiện tại seed 4 comcode chính, bổ sung sau khi confirm
const COMPANY_DATA = [
  {
    id: 'ZeniroxPay',
    name: 'Zenibox PayPal Partner — ZeniroxPay',
    taxId: 'CA-ZENIBOX-01',
    currency: 'USD',
    country: 'Canada',
    status: 'Active',
  },
  {
    id: 'Ontario',
    name: 'Ontario Operations',
    taxId: 'CA-ONTARIO-01',
    currency: 'CAD',
    country: 'Canada',
    status: 'Active',
  },
  {
    id: 'Vicbea',
    name: 'Vicbea Operations',
    taxId: 'VN-VICBEA-01',
    currency: 'VND',
    country: 'VN',
    status: 'Active',
  },
  {
    id: 'MessiPay',
    name: 'MessiPay Partner',
    taxId: 'CA-MESSIPAY-01',
    currency: 'USD',
    country: 'Canada',
    status: 'Active',
  },
]

export async function seedCompanies() {
  console.log('Seeding Companies...')

  for (const company of COMPANY_DATA) {
    await prisma.company.upsert({
      where: { id: company.id },
      update: company,
      create: company,
    })
  }

  console.log(`✓ ${COMPANY_DATA.length} companies seeded`)
}

export default prisma
