import { NextResponse } from "next/server";

import { listConnectCoreConnections } from "../../../../lib/connect-core-service";

export async function GET() {
  const connections = await listConnectCoreConnections();
  return NextResponse.json({ data: connections });
}
