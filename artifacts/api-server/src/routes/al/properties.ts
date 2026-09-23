import { Router } from "express";
import { randomUUID } from "crypto";
import { eq, and } from "drizzle-orm";
import { db } from "../../lib/db";
import { alPropertiesTable } from "@workspace/db/schema";
import { requireAuth } from "../../middleware/auth";
import { CreateAlPropertyBody } from "@workspace/api-zod";

const router = Router();

router.get("/al/properties", requireAuth, async (req, res) => {
  const props = await db.select().from(alPropertiesTable).where(eq(alPropertiesTable.ownerUserId, req.user!.userId));
  res.json(props.map(mapProperty));
});

router.post("/al/properties", requireAuth, async (req, res) => {
  const parsed = CreateAlPropertyBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }
  const id = randomUUID();
  const [prop] = await db
    .insert(alPropertiesTable)
    .values({ id, ownerUserId: req.user!.userId, ...parsed.data })
    .returning();
  res.status(201).json(mapProperty(prop));
});

router.get("/al/properties/:id", requireAuth, async (req, res) => {
  const [prop] = await db
    .select()
    .from(alPropertiesTable)
    .where(and(eq(alPropertiesTable.id, req.params.id), eq(alPropertiesTable.ownerUserId, req.user!.userId)));
  if (!prop) { res.status(404).json({ error: "Not found" }); return; }
  res.json(mapProperty(prop));
});

router.put("/al/properties/:id", requireAuth, async (req, res) => {
  const parsed = CreateAlPropertyBody.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }
  const [prop] = await db
    .update(alPropertiesTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(and(eq(alPropertiesTable.id, req.params.id), eq(alPropertiesTable.ownerUserId, req.user!.userId)))
    .returning();
  if (!prop) { res.status(404).json({ error: "Not found" }); return; }
  res.json(mapProperty(prop));
});

router.delete("/al/properties/:id", requireAuth, async (req, res) => {
  const [deleted] = await db
    .delete(alPropertiesTable)
    .where(and(eq(alPropertiesTable.id, req.params.id), eq(alPropertiesTable.ownerUserId, req.user!.userId)))
    .returning();
  if (!deleted) { res.status(404).json({ error: "Not found" }); return; }
  res.status(204).send();
});

function mapProperty(p: typeof alPropertiesTable.$inferSelect) {
  return {
    id: p.id,
    title: p.title,
    description: p.description ?? undefined,
    locationText: p.locationText,
    city: p.city,
    neighborhood: p.neighborhood ?? undefined,
    price: parseFloat(p.price),
    currency: p.currency,
    type: p.type,
    bedrooms: p.bedrooms ?? undefined,
    bathrooms: p.bathrooms ?? undefined,
    sizeM2: p.sizeM2 ? parseFloat(p.sizeM2) : undefined,
    status: p.status,
    notes: p.notes ?? undefined,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

export default router;
