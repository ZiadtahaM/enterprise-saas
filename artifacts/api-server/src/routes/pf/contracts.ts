import { Router } from "express";
import { randomUUID } from "crypto";
import { eq, and } from "drizzle-orm";
import { db } from "../../lib/db";
import { pfContractsTable, pfClientsTable } from "@workspace/db/schema";
import { requireAuth } from "../../middleware/auth";
import { CreatePfContractBody, UpdatePfContractStatusBody } from "@workspace/api-zod";

const router = Router();

router.get("/pf/contracts", requireAuth, async (req, res) => {
  const rows = await db
    .select({ c: pfContractsTable, cl: pfClientsTable })
    .from(pfContractsTable)
    .leftJoin(pfClientsTable, eq(pfContractsTable.clientId, pfClientsTable.id))
    .where(eq(pfContractsTable.ownerUserId, req.user!.userId));
  res.json(rows.map(({ c, cl }) => mapContract(c, cl?.companyName ?? "")));
});

router.post("/pf/contracts", requireAuth, async (req, res) => {
  const parsed = CreatePfContractBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }
  const id = randomUUID();
  const [contract] = await db
    .insert(pfContractsTable)
    .values({ id, ownerUserId: req.user!.userId, ...parsed.data })
    .returning();
  const [client] = await db.select().from(pfClientsTable).where(eq(pfClientsTable.id, contract.clientId)).limit(1);
  res.status(201).json(mapContract(contract, client?.companyName ?? ""));
});

router.get("/pf/contracts/:id", requireAuth, async (req, res) => {
  const [row] = await db
    .select({ c: pfContractsTable, cl: pfClientsTable })
    .from(pfContractsTable)
    .leftJoin(pfClientsTable, eq(pfContractsTable.clientId, pfClientsTable.id))
    .where(and(eq(pfContractsTable.id, req.params.id), eq(pfContractsTable.ownerUserId, req.user!.userId)));
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(mapContract(row.c, row.cl?.companyName ?? ""));
});

router.put("/pf/contracts/:id", requireAuth, async (req, res) => {
  const parsed = CreatePfContractBody.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }
  const [contract] = await db
    .update(pfContractsTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(and(eq(pfContractsTable.id, req.params.id), eq(pfContractsTable.ownerUserId, req.user!.userId)))
    .returning();
  if (!contract) { res.status(404).json({ error: "Not found" }); return; }
  const [client] = await db.select().from(pfClientsTable).where(eq(pfClientsTable.id, contract.clientId)).limit(1);
  res.json(mapContract(contract, client?.companyName ?? ""));
});

router.delete("/pf/contracts/:id", requireAuth, async (req, res) => {
  const [deleted] = await db
    .delete(pfContractsTable)
    .where(and(eq(pfContractsTable.id, req.params.id), eq(pfContractsTable.ownerUserId, req.user!.userId)))
    .returning();
  if (!deleted) { res.status(404).json({ error: "Not found" }); return; }
  res.status(204).send();
});

router.patch("/pf/contracts/:id/status", requireAuth, async (req, res) => {
  const parsed = UpdatePfContractStatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }
  const signedAt = parsed.data.status === "signed" ? new Date() : undefined;
  const [contract] = await db
    .update(pfContractsTable)
    .set({ status: parsed.data.status, updatedAt: new Date(), ...(signedAt ? { signedAt } : {}) })
    .where(and(eq(pfContractsTable.id, req.params.id), eq(pfContractsTable.ownerUserId, req.user!.userId)))
    .returning();
  if (!contract) { res.status(404).json({ error: "Not found" }); return; }
  const [client] = await db.select().from(pfClientsTable).where(eq(pfClientsTable.id, contract.clientId)).limit(1);
  res.json(mapContract(contract, client?.companyName ?? ""));
});

function mapContract(c: typeof pfContractsTable.$inferSelect, clientName: string) {
  return {
    id: c.id,
    proposalId: c.proposalId ?? undefined,
    clientId: c.clientId,
    clientName,
    title: c.title,
    status: c.status,
    content: c.content,
    signedAt: c.signedAt ?? undefined,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  };
}

export default router;
