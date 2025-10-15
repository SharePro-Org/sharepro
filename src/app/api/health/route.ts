import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'sharepro-frontend',
      version: process.env.npm_package_version || '0.1.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
    },
    { status: 200 }
  )
}

export async function HEAD() {
  return new NextResponse(null, { status: 200 })
}