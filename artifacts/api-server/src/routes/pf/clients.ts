import { Router } from "express";
import { randomUUID } from "crypto";
import { eq, and } from "drizzle-orm";
import { db } from "../../lib/db";
import { pfClientsTable } from "@workspace/db/schema";
import { requireAuth } from "../../middleware/auth";
import { CreatePfClientBody } from "@workspace/api-zod";

const router = Router();

router.get("/pf/clients", requireAuth, async (req, res) => {
  const clients = await db
    .select()
    .from(pfClientsTable)
    .where(eq(pfClientsTable.ownerUserId, req.user!.userId));
  res.json(clients.map(mapClient));
});

router.post("/pf/clients", requireAuth, async (req, res) => {
  const parsed = CreatePfClientBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }
  const id = randomUUID();
  const [client] = await db
    .insert(pfClientsTable)
    .values({ id, ownerUserId: req.user!.userId, ...parsed.data })
    .returning();
  res.status(201).json(mapClient(client));
});

router.get("/pf/clients/:id", requireAuth, async (req, res) => {
  const [client] = await db
    .select()
    .from(pfClientsTable)
    .where(and(eq(pfClientsTable.id, req.params.id), eq(pfClientsTable.ownerUserId, req.user!.userId)));
  if (!client) { res.status(404).json({ error: "Not found" }); return; }
  res.json(mapClient(client));
});

router.put("/pf/clients/:id", requireAuth, async (req, res) => {
  const parsed = CreatePfClientBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }
  const [client] = await db
    .update(pfClientsTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(and(eq(pfClientsTable.id, req.params.id), eq(pfClientsTable.ownerUserId, req.user!.userId)))
    .returning();
  if (!client) { res.status(404).json({ error: "Not found" }); return; }
  res.json(mapClient(client));
});

router.delete("/pf/clients/:id", requireAuth, async (req, res) => {
  const [deleted] = await db
    .delete(pfClientsTable)
    .where(and(eq(pfClientsTable.id, req.params.id), eq(pfClientsTable.ownerUserId, req.user!.userId)))
    .returning();
  if (!deleted) { res.status(404).json({ error: "Not found" }); return; }
  res.status(204).send();
});

function mapClient(c: typeof pfClientsTable.$inferSelect) {
  return {
    id: c.id,
    companyName: c.companyName,
    contactName: c.contactName,
    email: c.email,
    phone: c.phone ?? undefined,
    address: c.address ?? undefined,
    notes: c.notes ?? undefined,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  };
}

export default router;
