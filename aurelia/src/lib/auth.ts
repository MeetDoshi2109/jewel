import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'aurelia-secret'
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'aurelia-admin-secret'

export interface CustomerPayload {
  id: string
  email: string
  name: string
}

export interface AdminPayload {
  id: string
  email: string
  name: string
  role: string
}

export function signCustomerToken(payload: CustomerPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyCustomerToken(token: string): CustomerPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as CustomerPayload
  } catch {
    return null
  }
}

export function signAdminToken(payload: AdminPayload): string {
  return jwt.sign(payload, ADMIN_JWT_SECRET, { expiresIn: '1d' })
}

export function verifyAdminToken(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, ADMIN_JWT_SECRET) as AdminPayload
  } catch {
    return null
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function getCustomerFromCookies(): Promise<CustomerPayload | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('customer_token')?.value
    if (!token) return null
    return verifyCustomerToken(token)
  } catch {
    return null
  }
}

export async function getAdminFromCookies(): Promise<AdminPayload | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_token')?.value
    if (!token) return null
    return verifyAdminToken(token)
  } catch {
    return null
  }
}
