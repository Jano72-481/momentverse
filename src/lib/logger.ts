export function withReqId(headers: Headers) {
  const id = headers.get("x-request-id") || crypto.randomUUID();
  return { id, headers: { "x-request-id": id } };
}

export function logError(ctx: { id: string; route: string }, e: unknown) {
  console.error(JSON.stringify({ 
    level: "error", 
    reqId: ctx.id, 
    route: ctx.route, 
    error: String(e),
    timestamp: new Date().toISOString()
  }));
}

export function logInfo(ctx: { id: string; route: string }, message: string, data?: any) {
  console.log(JSON.stringify({ 
    level: "info", 
    reqId: ctx.id, 
    route: ctx.route, 
    message,
    data,
    timestamp: new Date().toISOString()
  }));
}

export function logWarn(ctx: { id: string; route: string }, message: string, data?: any) {
  console.warn(JSON.stringify({ 
    level: "warn", 
    reqId: ctx.id, 
    route: ctx.route, 
    message,
    data,
    timestamp: new Date().toISOString()
  }));
}

export function logPerformance(ctx: { id: string; route: string }, operation: string, duration: number) {
  if (duration > 1000) {
    logWarn(ctx, `Slow operation detected`, { operation, duration: `${duration}ms` });
  } else {
    logInfo(ctx, `Operation completed`, { operation, duration: `${duration}ms` });
  }
}
