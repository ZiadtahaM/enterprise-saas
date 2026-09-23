import { pgTable, text, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { usersTable } from "./users";

export const alLeadsTable = pgTable("al_leads", {
  id: text("id").primaryKey(),
  ownerUserId: text("owner_user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  source: text("source"),
  status: text("status").notNull().default("new"),
  budget: numeric("budget", { precision: 14, scale: 2 }),
  currency: text("currency"),
  interestedInType: text("interested_in_type"),
  preferredCity: text("preferred_city"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertAlLeadSchema = createInsertSchema(alLeadsTable).omit({ createdAt: true, updatedAt: true });
export type InsertAlLead = z.infer<typeof insertAlLeadSchema>;
export type AlLead = typeof alLeadsTable.$inferSelect;
