import { Router } from "express";
import { eq, count } from "drizzle-orm";
import { db } from "../../lib/db";
import { alPropertiesTable, alLeadsTable, alDealsTable, alRemindersTable } from "@workspace/db/schema";
import { requireAuth } from "../../middleware/auth";

const router = Router();

router.get("/al/dashboard", requireAuth, async (req, res) => {
  const userId = req.user!.userId;

  const [propCount] = await db.select({ count: count() }).from(alPropertiesTable).where(eq(alPropertiesTable.ownerUserId, userId));
  const [leadCount] = await db.select({ count: count() }).from(alLeadsTable).where(eq(alLeadsTable.ownerUserId, userId));
  const [dealCount] = await db.select({ count: count() }).from(alDealsTable).where(eq(alDealsTable.ownerUserId, userId));

  const deals = await db.select().from(alDealsTable).where(eq(alDealsTable.ownerUserId, userId));
  const dealsByStage: Record<string, number> = {};
  let totalPipelineValue = 0;
  let totalCommissionPotential = 0;
  for (const d of deals) {
    dealsByStage[d.stage] = (dealsByStage[d.stage] ?? 0) + 1;
    if (!["closed_won", "closed_lost"].includes(d.stage)) {
      totalPipelineValue += parseFloat(d.dealValue);
      if (d.commissionAmount) totalCommissionPotential += parseFloat(d.commissionAmount);
    }
  }

  const reminders = await db.select().from(alRemindersTable).where(eq(alRemindersTable.ownerUserId, userId));
  const upcomingReminders = reminders
    .filter(r => !r.done && r.dueAt >= new Date())
    .sort((a, b) => a.dueAt.getTime() - b.dueAt.getTime())
    .slice(0, 5)
    .map(r => ({ id: r.id, title: r.title, dueAt: r.dueAt, done: r.done, createdAt: r.createdAt }));

  const leads = await db.select().from(alLeadsTable).where(eq(alLeadsTable.ownerUserId, userId));
  const recentLeads = leads
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5)
    .map(l => ({ id: l.id, name: l.name, status: l.status, createdAt: l.createdAt, updatedAt: l.updatedAt }));

  res.json({
    totalProperties: propCount.count,
    totalLeads: leadCount.count,
    totalDeals: dealCount.count,
    dealsByStage,
    totalPipelineValue,
    totalCommissionPotential,
    upcomingReminders,
    recentLeads,
  });
});

export default router;
