import { Router } from "express";
import { randomUUID } from "crypto";
import { eq, and } from "drizzle-orm";
import { db } from "../../lib/db";
import { alLeadsTable } from "@workspace/db/schema";
import { requireAuth } from "../../middleware/auth";
import { CreateAlLeadBody } from "@workspace/api-zod";

const router = Router();

router.get("/al/leads", requireAuth, async (req, res) => {
  const leads = await db.select().from(alLeadsTable).where(eq(alLeadsTable.ownerUserId, req.user!.userId));
  res.json(leads.map(mapLead));
});

router.post("/al/leads", requireAuth, async (req, res) => {
  const parsed = CreateAlLeadBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }
  const id = randomUUID();
  const [lead] = await db
    .insert(alLeadsTable)
    .values({ id, ownerUserId: req.user!.userId, ...parsed.data })
    .returning();
  res.status(201).json(mapLead(lead));
});

router.get("/al/leads/:id", requireAuth, async (req, res) => {
  const [lead] = await db
    .select()
    .from(alLeadsTable)
    .where(and(eq(alLeadsTable.id, req.params.id), eq(alLeadsTable.ownerUserId, req.user!.userId)));
  if (!lead) { res.status(404).json({ error: "Not found" }); return; }
  res.json(mapLead(lead));
});

router.put("/al/leads/:id", requireAuth, async (req, res) => {
  const parsed = CreateAlLeadBody.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }
  const [lead] = await db
    .update(alLeadsTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(and(eq(alLeadsTable.id, req.params.id), eq(alLeadsTable.ownerUserId, req.user!.userId)))
    .returning();
  if (!lead) { res.status(404).json({ error: "Not found" }); return; }
  res.json(mapLead(lead));
});

router.delete("/al/leads/:id", requireAuth, async (req, res) => {
  const [deleted] = await db
    .delete(alLeadsTable)
    .where(and(eq(alLeadsTable.id, req.params.id), eq(alLeadsTable.ownerUserId, req.user!.userId)))
    .returning();
  if (!deleted) { res.status(404).json({ error: "Not found" }); return; }
  res.status(204).send();
});

function mapLead(l: typeof alLeadsTable.$inferSelect) {
  return {
    id: l.id,
    name: l.name,
    email: l.email ?? undefined,
    phone: l.phone ?? undefined,
    source: l.source ?? undefined,
    status: l.status,
    budget: l.budget ? parseFloat(l.budget) : undefined,
    currency: l.currency ?? undefined,
    interestedInType: l.interestedInType ?? undefined,
    preferredCity: l.preferredCity ?? undefined,
    notes: l.notes ?? undefined,
    createdAt: l.createdAt,
    updatedAt: l.updatedAt,
  };
}

export default router;
