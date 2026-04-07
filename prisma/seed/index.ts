import { PrismaClient } from '@prisma/client'
import { seedCoA } from './coa'
import { seedCompanies } from './companies'
import { seedJournalTypeRules } from './journal-types'

const prisma = new PrismaClient()

async function seedAdminUser() {
  const user = await prisma.user.upsert({
    where: { email: 'bquyet09@gmail.com' },
    update: {},
    create: {
      email:           'bquyet09@gmail.com',
      name:            'BTM Admin',
      role:            'Admin',
      allowedComcodes: ['ZeniroxPay', 'Ontario', 'Vicbea', 'MessiPay'],
      firebaseUid:     'MZZ11EviOScVWB7WekkLWc1txiI3',
      active:          true,
    },
  })
  console.log('✅ Admin user:', user.email)
}

async function main() {
  console.log('=== BTM Finance — Database Seed ===')
  await seedCompanies()
  await seedCoA()
  await seedJournalTypeRules()
  await seedAdminUser()
  // TODO: seedPeriods() — seed FiscalPeriod để có data để test
  // TODO: seedExchangeRates() — seed rates cho USD/CAD/VND
  console.log('=== Seed complete ===')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
