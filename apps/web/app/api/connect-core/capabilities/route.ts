import { NextResponse } from "next/server";
import { listConnectorCapabilities } from "@connect-any-inbox/connect-core";

export async function GET() {
  return NextResponse.json({ data: listConnectorCapabilities() });
}
