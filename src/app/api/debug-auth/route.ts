import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const info: Record<string, any> = {
    AUTH_URL: process.env.AUTH_URL ? 'set' : 'missing',
    AUTH_SECRET: process.env.AUTH_SECRET ? `set (len=${process.env.AUTH_SECRET.length})` : 'missing',
    AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID ? `set (len=${process.env.AUTH_GOOGLE_ID.length}, ends=${JSON.stringify(process.env.AUTH_GOOGLE_ID.slice(-3))})` : 'missing',
    AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET ? `set (len=${process.env.AUTH_GOOGLE_SECRET.length})` : 'missing',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? 'missing',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'set' : 'missing',
    NODE_ENV: process.env.NODE_ENV,
  }

  try {
    const { handlers } = await import('@/auth')
    info.auth_import = 'ok'
    info.handlers = Object.keys(handlers)
  } catch (e: any) {
    info.auth_import = 'FAILED'
    info.auth_error = e.message
    info.auth_stack = e.stack?.split('\n').slice(0, 8).join(' | ')
  }

  return NextResponse.json(info)
}
