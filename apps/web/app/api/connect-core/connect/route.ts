import { NextResponse, type NextRequest } from "next/server";

import { rateLimit } from "../../../../lib/connect-core-rate-limit";
import { startConnectCoreConnection } from "../../../../lib/connect-core-service";

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, "connect");
  if (limited) return limited;

  const body = (await request.json().catch(() => null)) as { integrationId?: string } | null;

  if (!body?.integrationId) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "integrationId is required." } },
      { status: 422 }
    );
  }

  const callbackUrl = new URL("/api/connect-core/callback", request.url).toString();
  const started = await startConnectCoreConnection(body.integrationId, callbackUrl);

  if (!started) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Integration was not found." } },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: started });
}
