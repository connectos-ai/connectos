import { NextResponse } from "next/server";
import { getGmailSetupReadiness } from "../../../../../../lib/gmail-local";

export function GET(): NextResponse {
  return NextResponse.json(getGmailSetupReadiness());
}
