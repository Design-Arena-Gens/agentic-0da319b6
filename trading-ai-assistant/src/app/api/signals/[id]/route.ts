import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateRequest } from "@/lib/auth";
import { signalDecisionSchema } from "@/lib/validation";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await authenticateRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const signal = await prisma.signal.findUnique({
    where: { id },
    include: {
      orderFlow: true,
      decisions: true,
      account: true,
    },
  });

  if (!signal || signal.account.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ signal });
}

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await authenticateRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = signalDecisionSchema.parse(body);
    const { id } = await context.params;

    const signal = await prisma.signal.findUnique({
      where: { id },
      include: {
        account: true,
      },
    });

    if (!signal || signal.account.userId !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const decision = await prisma.decision.create({
      data: {
        signalId: id,
        actor: data.actor,
        rationale: data.rationale,
        nextAction: data.nextAction,
        confidence: data.confidence,
      },
    });

    return NextResponse.json({ decision });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
