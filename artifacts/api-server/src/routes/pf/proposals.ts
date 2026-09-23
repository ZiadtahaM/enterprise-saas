import { Router } from "express";
import { randomUUID } from "crypto";
import { eq, and } from "drizzle-orm";
import { db } from "../../lib/db";
import { pfProposalsTable, pfClientsTable } from "@workspace/db/schema";
import { requireAuth } from "../../middleware/auth";
import { CreatePfProposalBody, UpdatePfProposalStatusBody } from "@workspace/api-zod";

const router = Router();

router.get("/pf/proposals", requireAuth, async (req, res) => {
  const rows = await db
    .select({ p: pfProposalsTable, c: pfClientsTable })
    .from(pfProposalsTable)
    .leftJoin(pfClientsTable, eq(pfProposalsTable.clientId, pfClientsTable.id))
    .where(eq(pfProposalsTable.ownerUserId, req.user!.userId));
  res.json(rows.map(({ p, c }) => mapProposal(p, c?.companyName ?? "")));
});

router.post("/pf/proposals", requireAuth, async (req, res) => {
  const parsed = CreatePfProposalBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }
  const { lineItems, ...rest } = parsed.data;
  const totalAmount = lineItems
    .reduce((sum: number, li: { quantity: number; unitPrice: number }) => sum + li.quantity * li.unitPrice, 0)
    .toFixed(2);
  const lineItemsWithId = lineItems.map((li: { description: string; quantity: number; unitPrice: number }) => ({
    id: randomUUID(),
    ...li,
    total: li.quantity * li.unitPrice,
  }));
  const id = randomUUID();
  const [proposal] = await db
    .insert(pfProposalsTable)
    .values({ id, ownerUserId: req.user!.userId, ...rest, totalAmount, lineItems: lineItemsWithId })
    .returning();
  const [client] = await db.select().from(pfClientsTable).where(eq(pfClientsTable.id, proposal.clientId)).limit(1);
  res.status(201).json(mapProposal(proposal, client?.companyName ?? ""));
});

router.get("/pf/proposals/:id", requireAuth, async (req, res) => {
  const [row] = await db
    .select({ p: pfProposalsTable, c: pfClientsTable })
    .from(pfProposalsTable)
    .leftJoin(pfClientsTable, eq(pfProposalsTable.clientId, pfClientsTable.id))
    .where(and(eq(pfProposalsTable.id, req.params.id), eq(pfProposalsTable.ownerUserId, req.user!.userId)));
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  const { p, c } = row;
  res.json({
    ...mapProposal(p, c?.companyName ?? ""),
    lineItems: p.lineItems,
    client: c ? { id: c.id, companyName: c.companyName, contactName: c.contactName, email: c.email } : undefined,
  });
});

router.put("/pf/proposals/:id", requireAuth, async (req, res) => {
  const parsed = CreatePfProposalBody.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }
  const { lineItems, ...rest } = parsed.data;
  const updates: Record<string, unknown> = { ...rest, updatedAt: new Date() };
  if (lineItems) {
    const lineItemsWithId = lineItems.map((li: { description: string; quantity: number; unitPrice: number }) => ({
      id: randomUUID(),
      ...li,
      total: li.quantity * li.unitPrice,
    }));
    updates.lineItems = lineItemsWithId;
    updates.totalAmount = lineItems
      .reduce((sum: number, li: { quantity: number; unitPrice: number }) => sum + li.quantity * li.unitPrice, 0)
      .toFixed(2);
  }
  const [proposal] = await db
    .update(pfProposalsTable)
    .set(updates)
    .where(and(eq(pfProposalsTable.id, req.params.id), eq(pfProposalsTable.ownerUserId, req.user!.userId)))
    .returning();
  if (!proposal) { res.status(404).json({ error: "Not found" }); return; }
  const [client] = await db.select().from(pfClientsTable).where(eq(pfClientsTable.id, proposal.clientId)).limit(1);
  res.json(mapProposal(proposal, client?.companyName ?? ""));
});

router.delete("/pf/proposals/:id", requireAuth, async (req, res) => {
  const [deleted] = await db
    .delete(pfProposalsTable)
    .where(and(eq(pfProposalsTable.id, req.params.id), eq(pfProposalsTable.ownerUserId, req.user!.userId)))
    .returning();
  if (!deleted) { res.status(404).json({ error: "Not found" }); return; }
  res.status(204).send();
});

router.patch("/pf/proposals/:id/status", requireAuth, async (req, res) => {
  const parsed = UpdatePfProposalStatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }
  const [proposal] = await db
    .update(pfProposalsTable)
    .set({ status: parsed.data.status, updatedAt: new Date() })
    .where(and(eq(pfProposalsTable.id, req.params.id), eq(pfProposalsTable.ownerUserId, req.user!.userId)))
    .returning();
  if (!proposal) { res.status(404).json({ error: "Not found" }); return; }
  const [client] = await db.select().from(pfClientsTable).where(eq(pfClientsTable.id, proposal.clientId)).limit(1);
  res.json(mapProposal(proposal, client?.companyName ?? ""));
});

function mapProposal(p: typeof pfProposalsTable.$inferSelect, clientName: string) {
  return {
    id: p.id,
    clientId: p.clientId,
    clientName,
    title: p.title,
    status: p.status,
    totalAmount: parseFloat(p.totalAmount ?? "0"),
    currency: p.currency,
    validUntil: p.validUntil ?? undefined,
    notes: p.notes ?? undefined,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

export default router;
