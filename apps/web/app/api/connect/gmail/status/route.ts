import { NextResponse } from "next/server";
import { getLocalGmailConnectionStatus } from "../../../../../lib/gmail-local";

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(await getLocalGmailConnectionStatus());
}
