import { NextResponse, type NextRequest } from "next/server";

import { getConnectCoreSkills } from "../../../../lib/connect-core-service";

export async function GET(request: NextRequest) {
 const skill = request.nextUrl.searchParams.get("skill");
 const skills = await getConnectCoreSkills();
 return NextResponse.json({
  data: skill ? skills.filter((item) => item.id === skill) : skills
 });
}
