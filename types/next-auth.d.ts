import type { UserRole } from '@/lib/types'

// Augment NextAuth types để thêm role + allowedComcodes vào session
declare module 'next-auth' {
  interface User {
    id:              string
    role:            UserRole
    allowedComcodes: string[]
  }

  interface Session {
    user: {
      id:              string
      email:           string
      name?:           string | null
      role:            UserRole
      allowedComcodes: string[]
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id:              string
    role:            UserRole
    allowedComcodes: string[]
  }
}
