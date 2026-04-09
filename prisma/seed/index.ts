import { PrismaClient } from '@prisma/client'
import { seedCoA } from './coa'
import { seedCompanies } from './companies'
import { seedJournalTypeRules } from './journal-types'
import { seedFCUser } from './users'
import { seedFiscalPeriods } from './fiscal-periods'
import { seedGlEntries } from './gl-entries'
import { seedManualGlEntries } from './manual-gl-entries'

const prisma = new PrismaClient()

async function main() {
  console.log('=== BTM Finance — Database Seed ===')
  await seedCompanies()
  await seedCoA()
  await seedJournalTypeRules()
  await seedFCUser()
  // TODO: seedPeriods() — seed FiscalPeriod để có data để test
  await seedFiscalPeriods()
  await seedGlEntries()
  await seedManualGlEntries()
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
