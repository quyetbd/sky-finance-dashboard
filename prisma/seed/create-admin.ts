// Script tạo Admin user đầu tiên
// Chạy: npx ts-node prisma/seed/create-admin.ts

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'bquyet09@gmail.com' },
    update: {},
    create: {
      email:           'bquyet09@gmail.com',
      name:            'BTM Admin',
      role:            'Admin',
      allowedComcodes: ['ZeniroxPay', 'Ontario', 'Vicbea', 'MessiPay'],
      firebaseUid:     'MZZ11EviOScVWB7WekkLWc1txiI3', // ← thay bằng UID thực từ Firebase
      active:          true,
    },
  })

  console.log('✅ User created:', user.email, '|', user.role)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
