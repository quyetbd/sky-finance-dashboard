// BTM Finance — NextAuth configuration

import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { verifyPassword } from './password'
import { AccountLockedError } from './guards'
import { BTMUser, Role } from './types'
import prisma from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        let user
        try {
          user = await prisma.user.findUnique({
            where: { email: credentials.email },
          })
        } catch (err) {
          console.error('[Auth] DB error during login lookup:', err)
          throw new Error('Authentication failed')
        }

        // Do not reveal whether the account exists or is inactive
        if (!user || !user.isActive) {
          throw new Error('Invalid credentials')
        }

        // Check account lock
        if (user.lockedUntil && user.lockedUntil > new Date()) {
          throw new AccountLockedError(user.lockedUntil)
        }

        const isValid = await verifyPassword(credentials.password, user.passwordHash)

        if (!isValid) {
          const newCount = user.failedLoginCount + 1
          const update: {
            failedLoginCount: number
            lockedUntil?: Date | null
          } = { failedLoginCount: newCount }

          if (newCount >= 5) {
            update.lockedUntil = new Date(Date.now() + 15 * 60 * 1000)
            update.failedLoginCount = 0
          }

          try {
            await prisma.user.update({ where: { id: user.id }, data: update })
          } catch (err) {
            console.error('[Auth] Failed to update failed login count:', err)
          }

          const remaining = newCount >= 5 ? 0 : 5 - newCount
          throw new Error(`Invalid credentials. ${remaining} attempt(s) remaining before lockout`)
        }

        // Correct password — reset counters
        try {
          await prisma.user.update({
            where: { id: user.id },
            data: { failedLoginCount: 0, lockedUntil: null },
          })
        } catch (err) {
          console.error('[Auth] Failed to reset failed login count:', err)
        }

        const btmUser: BTMUser = {
          id: user.id,
          email: user.email,
          role: user.role as Role,
          allowedComcodes: user.allowedComcodes,
          mustChangePassword: user.mustChangePassword,
        }

        return btmUser
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60, // 8 hours
  },

  jwt: {
    maxAge: 8 * 60 * 60,
  },

  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax' as const,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },

  callbacks: {
    async jwt({ token, user, trigger }) {
      // Initial sign-in: populate token from user object returned by authorize()
      if (user) {
        const u = user as BTMUser
        token.id = u.id
        token.email = u.email
        token.role = u.role
        token.allowedComcodes = u.allowedComcodes
        token.mustChangePassword = u.mustChangePassword
        return token
      }

      // Session update triggered by client calling useSession().update()
      // Re-fetch mustChangePassword from DB so middleware gets the fresh value
      if (trigger === 'update' && token.id) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { mustChangePassword: true, isActive: true, role: true, allowedComcodes: true },
          })
          if (dbUser) {
            token.mustChangePassword = dbUser.mustChangePassword
            token.allowedComcodes = dbUser.allowedComcodes
          }
        } catch (err) {
          console.error('[Auth] JWT update trigger DB error:', err)
        }
      }

      return token
    },

    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        email: token.email as string,
        role: token.role as Role,
        allowedComcodes: token.allowedComcodes as string[],
        mustChangePassword: token.mustChangePassword as boolean,
      }
      return session
    },
  },

  pages: {
    signIn: '/login',
  },
}
