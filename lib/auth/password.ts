// BTM Finance — Password utilities

import bcrypt from 'bcrypt'

const BCRYPT_COST = 12

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const DIGITS = '0123456789'
const SPECIAL = '!@#$%^&*'
const ALL = UPPER + LOWER + DIGITS + SPECIAL

export function generateTempPassword(): string {
  // Guarantee at least one character from each required class
  const pick = (charset: string): string =>
    charset[Math.floor(Math.random() * charset.length)]

  const chars: string[] = [
    pick(UPPER),
    pick(DIGITS),
    pick(SPECIAL),
    ...Array.from({ length: 9 }, () => pick(ALL)),
  ]

  // Fisher-Yates shuffle
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[chars[i], chars[j]] = [chars[j], chars[i]]
  }

  return chars.join('')
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_COST)
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function validatePasswordStrength(password: string): string | null {
  if (password.length < 8) {
    return 'Password must be at least 8 characters'
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter'
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number'
  }
  if (!/[!@#$%^&*()\-_=+\[\]{};':",.<>/?\\|`~]/.test(password)) {
    return 'Password must contain at least one special character'
  }
  return null
}

// Stub: logs temp password to console — replace with real SMTP when available
export async function sendTempPasswordEmail(
  email: string,
  tempPassword: string
): Promise<void> {
  // TODO: integrate with real email service (SendGrid / SES / Nodemailer)
  console.log(
    `[Email Stub] Temp password for ${email} — password: [REDACTED from logs]`
  )
  // Intentionally not logging the actual password value
  void tempPassword
}
