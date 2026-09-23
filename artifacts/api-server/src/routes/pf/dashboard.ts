import { Router } from "express";
import { eq, count, sql } from "drizzle-orm";
import { db } from "../../lib/db";
import { pfClientsTable, pfProposalsTable, pfDepositsTable } from "@workspace/db/schema";
import { requireAuth } from "../../middleware/auth";

const router = Router();

router.get("/pf/dashboard", requireAuth, async (req, res) => {
  const userId = req.user!.userId;

  const [clientCount] = await db.select({ count: count() }).from(pfClientsTable).where(eq(pfClientsTable.ownerUserId, userId));
  const [proposalCount] = await db.select({ count: count() }).from(pfProposalsTable).where(eq(pfProposalsTable.ownerUserId, userId));

  const proposals = await db.select().from(pfProposalsTable).where(eq(pfProposalsTable.ownerUserId, userId));
  const proposalsByStatus: Record<string, number> = {};
  for (const p of proposals) {
    proposalsByStatus[p.status] = (proposalsByStatus[p.status] ?? 0) + 1;
  }

  const deposits = await db.select().from(pfDepositsTable).where(eq(pfDepositsTable.ownerUserId, userId));
  let totalRevenuePending = 0;
  let totalRevenueCollected = 0;
  let overdueDeposits = 0;
  const today = new Date().toISOString().slice(0, 10);
  for (const d of deposits) {
    const amt = parseFloat(d.amount);
    if (d.status === "paid") totalRevenueCollected += amt;
    else if (d.status === "pending") {
      totalRevenuePending += amt;
      if (d.dueDate < today) overdueDeposits++;
    }
  }

  const recentProposals = proposals
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  res.json({
    totalClients: clientCount.count,
    totalProposals: proposalCount.count,
    proposalsByStatus,
    totalRevenuePending,
    totalRevenueCollected,
    recentProposals: recentProposals.map(p => ({
      id: p.id, clientId: p.clientId, clientName: "", title: p.title,
      status: p.status, totalAmount: parseFloat(p.totalAmount ?? "0"),
      currency: p.currency, createdAt: p.createdAt, updatedAt: p.updatedAt,
    })),
    overdueDeposits,
  });
});

export default router;
