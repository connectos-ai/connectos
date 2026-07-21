import { NextResponse, type NextRequest } from "next/server";

type RateLimitAction = "connect" | "callback" | "reconnect" | "disconnect" | "health";

const windows: Record<RateLimitAction, { limit: number; windowMs: number }> = {
  connect: { limit: 20, windowMs: 60_000 },
  callback: { limit: 60, windowMs: 60_000 },
  reconnect: { limit: 20, windowMs: 60_000 },
  disconnect: { limit: 30, windowMs: 60_000 },
  health: { limit: 60, windowMs: 60_000 }
};

const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(request: NextRequest, action: RateLimitAction): NextResponse | null {
  const now = Date.now();
  const config = windows[action];
  const key = `${action}:${clientIp(request)}`;
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + config.windowMs });
    return null;
  }

  current.count += 1;
  if (current.count <= config.limit) {
    return null;
  }

  return NextResponse.json(
    { error: { code: "RATE_LIMITED", message: "Too many requests. Please try again shortly." } },
    { status: 429, headers: { "Retry-After": String(Math.ceil((current.resetAt - now) / 1000)) } }
  );
}

function clientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  );
}
