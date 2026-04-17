import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    AUTH_FACEBOOK_ID: process.env.AUTH_FACEBOOK_ID ? '✅ set' : '❌ missing',
    AUTH_FACEBOOK_SECRET: process.env.AUTH_FACEBOOK_SECRET ? '✅ set' : '❌ missing',
    FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID ? '✅ set' : '❌ missing',
    FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET ? '✅ set' : '❌ missing',
    AUTH_SECRET: process.env.AUTH_SECRET ? '✅ set' : '❌ missing',
    AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID ? '✅ set' : '❌ missing',
  });
}
