import { NextResponse } from 'next/server'
import { getAdminFromCookies } from '@/lib/auth'

export async function GET() {
  const payload = await getAdminFromCookies()
  if (!payload) {
    return NextResponse.json({ admin: null }, { status: 401 })
  }
  return NextResponse.json({ admin: payload })
}
