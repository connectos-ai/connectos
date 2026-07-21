import { NextResponse } from "next/server";
import { listConnectorActions } from "@connect-any-inbox/connect-core";

export async function GET() {
  return NextResponse.json({ data: listConnectorActions() });
}
