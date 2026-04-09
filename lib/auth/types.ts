// BTM Finance — Auth Types

export type Role = "FC" | "Accountant" | "Director" | "Viewer"

export interface BTMUser {
  id: string
  email: string
  role: Role
  allowedComcodes: string[]
  mustChangePassword: boolean
}

export interface BTMSession {
  user: BTMUser
  expires: string
}

// Extend NextAuth built-in types
declare module "next-auth" {
  interface Session extends BTMSession {}
  interface User extends BTMUser {}
}

declare module "next-auth/jwt" {
  interface JWT extends BTMUser {}
}
