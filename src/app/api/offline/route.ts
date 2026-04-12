import { NextResponse } from 'next/server';

// This route is used to test offline functionality
// It will fail when offline, triggering the offline page

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'You are online',
  });
}
