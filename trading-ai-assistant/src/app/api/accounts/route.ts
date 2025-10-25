import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { accountCreateSchema } from "@/lib/validation";

export async function GET(req: Request) {
  const user = await authenticateRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accounts = await prisma.account.findMany({
    where: { userId: user.id },
    include: {
      balanceSnapshots: {
        orderBy: { timestamp: "desc" },
        take: 30,
      },
      positions: true,
    },
  });

  return NextResponse.json({ accounts });
}

export async function POST(req: Request) {
  const user = await authenticateRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await req.json();
  const payload = accountCreateSchema.parse(json);

  const account = await prisma.account.create({
    data: {
      userId: user.id,
      broker: payload.broker,
      accountNumber: payload.accountNumber,
      environment: payload.environment,
    },
  });

  return NextResponse.json({ account });
}
