import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { redis } from "@/lib/redis";

export async function GET() {
  const startTime = Date.now();
  
  try {
    const r = redis();
    const [db, kv] = await Promise.allSettled([
      prisma.$queryRaw`SELECT 1`,
      r ? r.ping() : Promise.resolve('redis-not-configured')
    ]);
    
    const responseTime = Date.now() - startTime;
    
    return NextResponse.json({
      ok: true,
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      services: {
        database: db.status === "fulfilled",
        redis: r ? kv.status === "fulfilled" : "not-configured",
      },
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || "1.0.0",
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json({
      ok: false,
      timestamp: new Date().toISOString(),
      error: "Health check failed",
    }, { status: 500 });
  }
}
