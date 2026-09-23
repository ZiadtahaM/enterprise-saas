import { pgTable, text, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { usersTable } from "./users";
import { alPropertiesTable } from "./al_properties";
import { alLeadsTable } from "./al_leads";

export const alDealsTable = pgTable("al_deals", {
  id: text("id").primaryKey(),
  ownerUserId: text("owner_user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  leadId: text("lead_id").references(() => alLeadsTable.id, { onDelete: "set null" }),
  propertyId: text("property_id").references(() => alPropertiesTable.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  stage: text("stage").notNull().default("prospect"),
  dealValue: numeric("deal_value", { precision: 14, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  commissionRate: numeric("commission_rate", { precision: 5, scale: 4 }),
  commissionAmount: numeric("commission_amount", { precision: 14, scale: 2 }),
  expectedCloseDate: text("expected_close_date"),
  closedAt: timestamp("closed_at", { withTimezone: true }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertAlDealSchema = createInsertSchema(alDealsTable).omit({ createdAt: true, updatedAt: true });
export type InsertAlDeal = z.infer<typeof insertAlDealSchema>;
export type AlDeal = typeof alDealsTable.$inferSelect;
