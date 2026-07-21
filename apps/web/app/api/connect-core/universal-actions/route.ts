import { NextResponse, type NextRequest } from "next/server";

import { getConnectCoreUniversalActions } from "../../../../lib/connect-core-service";

export async function GET(request: NextRequest) {
 const action = request.nextUrl.searchParams.get("action");
 const universalActions = await getConnectCoreUniversalActions();
 return NextResponse.json({
  data: action ? universalActions.filter((universalAction) => universalAction.id === action) : universalActions
 });
}
