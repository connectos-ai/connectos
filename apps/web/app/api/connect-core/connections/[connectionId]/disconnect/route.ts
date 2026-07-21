import { NextResponse, type NextRequest } from "next/server";

import { rateLimit } from "../../../../../../lib/connect-core-rate-limit";
import { disconnectConnectCoreConnection } from "../../../../../../lib/connect-core-service";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ connectionId: string }> }
) {
  const limited = rateLimit(request, "disconnect");
  if (limited) return limited;

  const { connectionId } = await context.params;
  const connection = await disconnectConnectCoreConnection(connectionId);

  return NextResponse.json({ data: connection });
}
