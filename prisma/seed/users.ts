// BTM Finance — Seed: bootstrap FC user

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export async function seedFCUser() {
  const passwordHash = await bcrypt.hash('Btm@2026!', 12)

  const user = await prisma.user.upsert({
    where: { email: 'fc@bettamax.com' },
    update: {},
    create: {
      email: 'fc@bettamax.com',
      passwordHash,
      role: 'FC',
      allowedComcodes: ['ZeniroxPay', 'Ontario', 'Vicbea', 'MessiPay'],
      mustChangePassword: true,
      isActive: true,
      createdBy: 'system',
    },
  })

  console.log('✅ FC user seeded:', user.email)
}
