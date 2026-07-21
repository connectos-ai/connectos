import { NextResponse } from "next/server";

import { getConnectCoreDashboard } from "../../../../lib/connect-core-service";

export async function GET() {
  const integrations = await getConnectCoreDashboard();
  return NextResponse.json({ data: integrations });
}
