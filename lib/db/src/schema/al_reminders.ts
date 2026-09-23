import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { usersTable } from "./users";
import { alLeadsTable } from "./al_leads";
import { alDealsTable } from "./al_deals";
import { alPropertiesTable } from "./al_properties";

export const alRemindersTable = pgTable("al_reminders", {
  id: text("id").primaryKey(),
  ownerUserId: text("owner_user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  dueAt: timestamp("due_at", { withTimezone: true }).notNull(),
  done: boolean("done").notNull().default(false),
  leadId: text("lead_id").references(() => alLeadsTable.id, { onDelete: "set null" }),
  dealId: text("deal_id").references(() => alDealsTable.id, { onDelete: "set null" }),
  propertyId: text("property_id").references(() => alPropertiesTable.id, { onDelete: "set null" }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertAlReminderSchema = createInsertSchema(alRemindersTable).omit({ createdAt: true });
export type InsertAlReminder = z.infer<typeof insertAlReminderSchema>;
export type AlReminder = typeof alRemindersTable.$inferSelect;
