import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { persistOrderFlow } from "@/lib/orderflow";
import { orderFlowIngestSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const user = await authenticateRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const payload = orderFlowIngestSchema.parse(body);

    const account = await prisma.account.findUnique({
      where: { id: payload.accountId },
    });

    if (!account || account.userId !== user.id) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const event = await persistOrderFlow(payload);

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "ORDERFLOW_INGEST",
        resource: event.id,
        metadata: payload.payload,
      },
    });

    return NextResponse.json({ eventId: event.id });
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
