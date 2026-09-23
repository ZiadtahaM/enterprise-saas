import { Router } from "express";
import { randomUUID } from "crypto";
import { eq, and, lt } from "drizzle-orm";
import { db } from "../../lib/db";
import { pfDepositsTable, pfClientsTable } from "@workspace/db/schema";
import { requireAuth } from "../../middleware/auth";
import { CreatePfDepositBody, UpdatePfDepositStatusBody } from "@workspace/api-zod";

const router = Router();

router.get("/pf/deposits", requireAuth, async (req, res) => {
  const rows = await db
    .select({ d: pfDepositsTable, cl: pfClientsTable })
    .from(pfDepositsTable)
    .leftJoin(pfClientsTable, eq(pfDepositsTable.clientId, pfClientsTable.id))
    .where(eq(pfDepositsTable.ownerUserId, req.user!.userId));
  res.json(rows.map(({ d, cl }) => mapDeposit(d, cl?.companyName ?? "")));
});

router.post("/pf/deposits", requireAuth, async (req, res) => {
  const parsed = CreatePfDepositBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }
  const id = randomUUID();
  const [deposit] = await db
    .insert(pfDepositsTable)
    .values({ id, ownerUserId: req.user!.userId, ...parsed.data })
    .returning();
  const [client] = await db.select().from(pfClientsTable).where(eq(pfClientsTable.id, deposit.clientId)).limit(1);
  res.status(201).json(mapDeposit(deposit, client?.companyName ?? ""));
});

router.get("/pf/deposits/:id", requireAuth, async (req, res) => {
  const [row] = await db
    .select({ d: pfDepositsTable, cl: pfClientsTable })
    .from(pfDepositsTable)
    .leftJoin(pfClientsTable, eq(pfDepositsTable.clientId, pfClientsTable.id))
    .where(and(eq(pfDepositsTable.id, req.params.id), eq(pfDepositsTable.ownerUserId, req.user!.userId)));
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(mapDeposit(row.d, row.cl?.companyName ?? ""));
});

router.put("/pf/deposits/:id", requireAuth, async (req, res) => {
  const parsed = CreatePfDepositBody.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }
  const [deposit] = await db
    .update(pfDepositsTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(and(eq(pfDepositsTable.id, req.params.id), eq(pfDepositsTable.ownerUserId, req.user!.userId)))
    .returning();
  if (!deposit) { res.status(404).json({ error: "Not found" }); return; }
  const [client] = await db.select().from(pfClientsTable).where(eq(pfClientsTable.id, deposit.clientId)).limit(1);
  res.json(mapDeposit(deposit, client?.companyName ?? ""));
});

router.delete("/pf/deposits/:id", requireAuth, async (req, res) => {
  const [deleted] = await db
    .delete(pfDepositsTable)
    .where(and(eq(pfDepositsTable.id, req.params.id), eq(pfDepositsTable.ownerUserId, req.user!.userId)))
    .returning();
  if (!deleted) { res.status(404).json({ error: "Not found" }); return; }
  res.status(204).send();
});

router.patch("/pf/deposits/:id/status", requireAuth, async (req, res) => {
  const parsed = UpdatePfDepositStatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }
  const paidAt = parsed.data.status === "paid" ? new Date() : undefined;
  const [deposit] = await db
    .update(pfDepositsTable)
    .set({ status: parsed.data.status, updatedAt: new Date(), ...(paidAt ? { paidAt } : {}) })
    .where(and(eq(pfDepositsTable.id, req.params.id), eq(pfDepositsTable.ownerUserId, req.user!.userId)))
    .returning();
  if (!deposit) { res.status(404).json({ error: "Not found" }); return; }
  const [client] = await db.select().from(pfClientsTable).where(eq(pfClientsTable.id, deposit.clientId)).limit(1);
  res.json(mapDeposit(deposit, client?.companyName ?? ""));
});

function mapDeposit(d: typeof pfDepositsTable.$inferSelect, clientName: string) {
  return {
    id: d.id,
    proposalId: d.proposalId ?? undefined,
    contractId: d.contractId ?? undefined,
    clientId: d.clientId,
    clientName,
    title: d.title,
    amount: parseFloat(d.amount),
    currency: d.currency,
    status: d.status,
    dueDate: d.dueDate,
    paidAt: d.paidAt ?? undefined,
    notes: d.notes ?? undefined,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
  };
}

export default router;
