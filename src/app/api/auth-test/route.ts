import { NextResponse } from 'next/server'

export async function GET() {
  const results: Record<string, unknown> = {}

  // Test 1: Can we import auth?
  try {
    const { handlers, auth } = await import('@/auth')
    results.auth_import = 'ok'
    results.handlers_type = typeof handlers
    results.auth_type = typeof auth
  } catch (e: unknown) {
    results.auth_import = 'FAILED'
    results.auth_error = e instanceof Error ? e.message : String(e)
    results.auth_stack = e instanceof Error ? e.stack?.split('\n').slice(0, 5).join('\n') : ''
  }

  // Test 2: Environment variables
  results.env = {
    AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID ? `set (${process.env.AUTH_GOOGLE_ID.length} chars)` : 'MISSING',
    AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET ? `set (${process.env.AUTH_GOOGLE_SECRET.length} chars)` : 'MISSING',
    AUTH_SECRET: process.env.AUTH_SECRET ? `set (${process.env.AUTH_SECRET.length} chars)` : 'MISSING',
    AUTH_URL: process.env.AUTH_URL || 'MISSING',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'MISSING',
  }

  return NextResponse.json(results, { status: 200 })
}
