import { NextResponse, type NextRequest } from "next/server";

import { rateLimit } from "../../../../../../lib/connect-core-rate-limit";
import { reconnectConnectCoreConnection } from "../../../../../../lib/connect-core-service";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ connectionId: string }> }
) {
  const limited = rateLimit(request, "reconnect");
  if (limited) return limited;

  const { connectionId } = await context.params;
  const connection = await reconnectConnectCoreConnection(
    connectionId,
    new URL("/api/connect-core/callback", request.url).toString()
  );

  return NextResponse.json({ data: connection });
}
