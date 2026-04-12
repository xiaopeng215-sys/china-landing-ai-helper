/**
 * Liveness Probe - Kubernetes 存活探针
 * 仅检查应用是否运行，不检查依赖服务
 */

import { NextResponse } from 'next/server';

/**
 * GET /api/health/live
 * Kubernetes liveness probe endpoint
 */
export async function GET() {
  return NextResponse.json(
    {
      status: 'alive',
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    }
  );
}
