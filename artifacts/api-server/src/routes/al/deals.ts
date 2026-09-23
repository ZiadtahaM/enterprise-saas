import { Router } from "express";
import { randomUUID } from "crypto";
import { eq, and } from "drizzle-orm";
import { db } from "../../lib/db";
import { alDealsTable, alLeadsTable, alPropertiesTable } from "@workspace/db/schema";
import { requireAuth } from "../../middleware/auth";
import { CreateAlDealBody, UpdateAlDealStageBody } from "@workspace/api-zod";

const router = Router();

router.get("/al/deals", requireAuth, async (req, res) => {
  const rows = await db
    .select({ d: alDealsTable, l: alLeadsTable, p: alPropertiesTable })
    .from(alDealsTable)
    .leftJoin(alLeadsTable, eq(alDealsTable.leadId, alLeadsTable.id))
    .leftJoin(alPropertiesTable, eq(alDealsTable.propertyId, alPropertiesTable.id))
    .where(eq(alDealsTable.ownerUserId, req.user!.userId));
  res.json(rows.map(({ d, l, p }) => mapDeal(d, l?.name ?? "", p?.title ?? "")));
});

router.post("/al/deals", requireAuth, async (req, res) => {
  const parsed = CreateAlDealBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }
  const { commissionRate, dealValue, ...rest } = parsed.data;
  const commissionAmount = commissionRate ? (parseFloat(String(dealValue)) * commissionRate).toFixed(2) : undefined;
  const id = randomUUID();
  const [deal] = await db
    .insert(alDealsTable)
    .values({ id, ownerUserId: req.user!.userId, dealValue: String(dealValue), commissionRate: commissionRate ? String(commissionRate) : undefined, commissionAmount, ...rest })
    .returning();
  const [lead] = deal.leadId ? await db.select().from(alLeadsTable).where(eq(alLeadsTable.id, deal.leadId)).limit(1) : [undefined];
  const [prop] = deal.propertyId ? await db.select().from(alPropertiesTable).where(eq(alPropertiesTable.id, deal.propertyId)).limit(1) : [undefined];
  res.status(201).json(mapDeal(deal, lead?.name ?? "", prop?.title ?? ""));
});

router.get("/al/deals/:id", requireAuth, async (req, res) => {
  const [row] = await db
    .select({ d: alDealsTable, l: alLeadsTable, p: alPropertiesTable })
    .from(alDealsTable)
    .leftJoin(alLeadsTable, eq(alDealsTable.leadId, alLeadsTable.id))
    .leftJoin(alPropertiesTable, eq(alDealsTable.propertyId, alPropertiesTable.id))
    .where(and(eq(alDealsTable.id, req.params.id), eq(alDealsTable.ownerUserId, req.user!.userId)));
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(mapDeal(row.d, row.l?.name ?? "", row.p?.title ?? ""));
});

router.put("/al/deals/:id", requireAuth, async (req, res) => {
  const parsed = CreateAlDealBody.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }
  const { commissionRate, dealValue, ...rest } = parsed.data;
  const updates: Record<string, unknown> = { ...rest, updatedAt: new Date() };
  if (dealValue !== undefined) updates.dealValue = String(dealValue);
  if (commissionRate !== undefined) {
    updates.commissionRate = String(commissionRate);
    if (dealValue !== undefined) updates.commissionAmount = (parseFloat(String(dealValue)) * commissionRate).toFixed(2);
  }
  const [deal] = await db
    .update(alDealsTable)
    .set(updates)
    .where(and(eq(alDealsTable.id, req.params.id), eq(alDealsTable.ownerUserId, req.user!.userId)))
    .returning();
  if (!deal) { res.status(404).json({ error: "Not found" }); return; }
  const [lead] = deal.leadId ? await db.select().from(alLeadsTable).where(eq(alLeadsTable.id, deal.leadId)).limit(1) : [undefined];
  const [prop] = deal.propertyId ? await db.select().from(alPropertiesTable).where(eq(alPropertiesTable.id, deal.propertyId)).limit(1) : [undefined];
  res.json(mapDeal(deal, lead?.name ?? "", prop?.title ?? ""));
});

router.delete("/al/deals/:id", requireAuth, async (req, res) => {
  const [deleted] = await db
    .delete(alDealsTable)
    .where(and(eq(alDealsTable.id, req.params.id), eq(alDealsTable.ownerUserId, req.user!.userId)))
    .returning();
  if (!deleted) { res.status(404).json({ error: "Not found" }); return; }
  res.status(204).send();
});

router.patch("/al/deals/:id/stage", requireAuth, async (req, res) => {
  const parsed = UpdateAlDealStageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }
  const closedAt = ["closed_won", "closed_lost"].includes(parsed.data.stage) ? new Date() : undefined;
  const [deal] = await db
    .update(alDealsTable)
    .set({ stage: parsed.data.stage, updatedAt: new Date(), ...(closedAt ? { closedAt } : {}) })
    .where(and(eq(alDealsTable.id, req.params.id), eq(alDealsTable.ownerUserId, req.user!.userId)))
    .returning();
  if (!deal) { res.status(404).json({ error: "Not found" }); return; }
  res.json(mapDeal(deal, "", ""));
});

function mapDeal(d: typeof alDealsTable.$inferSelect, leadName: string, propertyTitle: string) {
  return {
    id: d.id,
    leadId: d.leadId ?? undefined,
    leadName,
    propertyId: d.propertyId ?? undefined,
    propertyTitle,
    title: d.title,
    stage: d.stage,
    dealValue: parseFloat(d.dealValue),
    currency: d.currency,
    commissionRate: d.commissionRate ? parseFloat(d.commissionRate) : undefined,
    commissionAmount: d.commissionAmount ? parseFloat(d.commissionAmount) : undefined,
    expectedCloseDate: d.expectedCloseDate ?? undefined,
    closedAt: d.closedAt ?? undefined,
    notes: d.notes ?? undefined,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
  };
}

export default router;
