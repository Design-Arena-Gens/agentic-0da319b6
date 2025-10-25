import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const user = await authenticateRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const accountId = url.searchParams.get("accountId");

  const signals = await prisma.signal.findMany({
    where: {
      account: {
        userId: user.id,
      },
      ...(accountId ? { accountId } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      orderFlow: true,
      decisions: true,
    },
  });

  return NextResponse.json({ signals });
}
