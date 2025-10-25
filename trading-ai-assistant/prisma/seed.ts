import { prisma } from "../src/lib/prisma";
import { hashPassword } from "../src/lib/auth";

async function main() {
  const passwordHash = await hashPassword("ChangeMe123!@#");

  const user = await prisma.user.upsert({
    where: { email: "ops@aegis.ai" },
    create: {
      email: "ops@aegis.ai",
      fullName: "Ops Team",
      passwordHash,
      role: "admin",
    },
    update: {},
  });

  const account = await prisma.account.upsert({
    where: { accountNumber: "SIM-001" },
    create: {
      userId: user.id,
      broker: "NinjaTrader",
      accountNumber: "SIM-001",
      environment: "paper",
    },
    update: {},
  });

  await prisma.balanceSnapshot.createMany({
    data: Array.from({ length: 30 }).map((_, index) => ({
      accountId: account.id,
      balance: 100000 + index * 250,
      equity: 100000 + index * 265,
      timestamp: new Date(Date.now() - (30 - index) * 86400000),
    })),
    skipDuplicates: true,
  });

  await prisma.position.upsert({
    where: { id: "sample-position" },
    create: {
      id: "sample-position",
      accountId: account.id,
      symbol: "ESZ4",
      quantity: 2,
      avgPrice: 5300.25,
      side: "LONG",
      status: "OPEN",
      openedAt: new Date(),
      pnl: 1240.5,
    },
    update: {},
  });

  console.log("Seed completed");
}

main()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    console.error(error);
    prisma.$disconnect();
    process.exit(1);
  });
