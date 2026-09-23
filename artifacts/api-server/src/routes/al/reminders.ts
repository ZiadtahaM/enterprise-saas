import { Router } from "express";
import { randomUUID } from "crypto";
import { eq, and } from "drizzle-orm";
import { db } from "../../lib/db";
import { alRemindersTable } from "@workspace/db/schema";
import { requireAuth } from "../../middleware/auth";
import { CreateAlReminderBody } from "@workspace/api-zod";

const router = Router();

router.get("/al/reminders", requireAuth, async (req, res) => {
  const reminders = await db.select().from(alRemindersTable).where(eq(alRemindersTable.ownerUserId, req.user!.userId));
  res.json(reminders.map(mapReminder));
});

router.post("/al/reminders", requireAuth, async (req, res) => {
  const parsed = CreateAlReminderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }
  const id = randomUUID();
  const [reminder] = await db
    .insert(alRemindersTable)
    .values({ id, ownerUserId: req.user!.userId, ...parsed.data })
    .returning();
  res.status(201).json(mapReminder(reminder));
});

router.put("/al/reminders/:id", requireAuth, async (req, res) => {
  const parsed = CreateAlReminderBody.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }
  const [reminder] = await db
    .update(alRemindersTable)
    .set(parsed.data)
    .where(and(eq(alRemindersTable.id, req.params.id), eq(alRemindersTable.ownerUserId, req.user!.userId)))
    .returning();
  if (!reminder) { res.status(404).json({ error: "Not found" }); return; }
  res.json(mapReminder(reminder));
});

router.delete("/al/reminders/:id", requireAuth, async (req, res) => {
  const [deleted] = await db
    .delete(alRemindersTable)
    .where(and(eq(alRemindersTable.id, req.params.id), eq(alRemindersTable.ownerUserId, req.user!.userId)))
    .returning();
  if (!deleted) { res.status(404).json({ error: "Not found" }); return; }
  res.status(204).send();
});

router.patch("/al/reminders/:id/done", requireAuth, async (req, res) => {
  const [reminder] = await db
    .update(alRemindersTable)
    .set({ done: true })
    .where(and(eq(alRemindersTable.id, req.params.id), eq(alRemindersTable.ownerUserId, req.user!.userId)))
    .returning();
  if (!reminder) { res.status(404).json({ error: "Not found" }); return; }
  res.json(mapReminder(reminder));
});

function mapReminder(r: typeof alRemindersTable.$inferSelect) {
  return {
    id: r.id,
    title: r.title,
    dueAt: r.dueAt,
    done: r.done,
    leadId: r.leadId ?? undefined,
    dealId: r.dealId ?? undefined,
    propertyId: r.propertyId ?? undefined,
    notes: r.notes ?? undefined,
    createdAt: r.createdAt,
  };
}

export default router;
