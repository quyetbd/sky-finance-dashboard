import CredentialsProvider from 'next-auth/providers/credentials'
import type { NextAuthOptions } from 'next-auth'
import { adminAuth } from '@/lib/firebase-admin'
import { prisma } from '@/lib/prisma'
import type { UserRole } from '@/lib/types'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // Nhận Firebase ID token từ client sau khi signInWithEmailAndPassword
      id: 'firebase',
      name: 'Firebase',
      credentials: {
        idToken: { label: 'Firebase ID Token', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.idToken) return null

        try {
          // 1. Verify token với Firebase Admin
          const decoded = await adminAuth.verifyIdToken(credentials.idToken)

          // 2. Lookup user trong DB — match theo firebaseUid hoặc email
          const user = await prisma.user.findFirst({
            where: {
              OR: [
                { firebaseUid: decoded.uid },
                { email: decoded.email ?? '' },
              ],
              active: true,
            },
          })

          if (!user) return null

          // 3. Sync firebaseUid nếu user được tạo trước khi Firebase setup
          if (!user.firebaseUid && decoded.uid) {
            await prisma.user.update({
              where: { id: user.id },
              data: { firebaseUid: decoded.uid },
            })
          }

          return {
            id:              user.id,
            email:           user.email,
            name:            user.name ?? null,
            role:            user.role as UserRole,
            allowedComcodes: user.allowedComcodes,
          }
        } catch {
          // Token invalid / expired
          return null
        }
      },
    }),
  ],

  session: { strategy: 'jwt' },

  callbacks: {
    async jwt({ token, user }) {
      // Chỉ chạy lần đầu login — gắn thêm fields vào JWT
      if (user) {
        token.id              = user.id
        token.role            = user.role
        token.allowedComcodes = user.allowedComcodes
      }
      return token
    },

    async session({ session, token }) {
      session.user.id              = token.id as string
      session.user.role            = token.role as UserRole
      session.user.allowedComcodes = token.allowedComcodes as string[]
      return session
    },
  },

  pages: {
    signIn: '/login',
    error:  '/login',
  },
}
