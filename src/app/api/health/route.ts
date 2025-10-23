import { NextResponse } from 'next/server';

/**
 * Health Check API Route
 * 
 * Used by:
 * - Docker healthcheck
 * - Load balancers
 * - Monitoring systems
 * - CI/CD pipelines
 * 
 * Returns 200 OK if application is healthy
 */
export async function GET() {
  try {
    // Basic health check
    const healthcheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
    };

    return NextResponse.json(healthcheck, { status: 200 });
  } catch (error) {
    // If there's an error, return 503 Service Unavailable
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}

/**
 * HEAD request support for lightweight health checks
 */
export async function HEAD() {
  return new Response(null, { status: 200 });
}

