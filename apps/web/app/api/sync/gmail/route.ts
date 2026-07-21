import { NextResponse } from "next/server";
import { syncLocalGmailMessages } from "../../../../lib/gmail-local";

export async function POST(): Promise<NextResponse> {
  try {
    return NextResponse.json(await syncLocalGmailMessages());
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          code: "GMAIL_NOT_CONNECTED",
          message: error instanceof Error ? error.message : "Gmail sync failed."
        }
      },
      { status: 409 }
    );
  }
}
