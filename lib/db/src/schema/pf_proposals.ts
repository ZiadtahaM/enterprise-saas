import { pgTable, text, timestamp, numeric, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { usersTable } from "./users";
import { pfClientsTable } from "./pf_clients";

export const pfProposalsTable = pgTable("pf_proposals", {
  id: text("id").primaryKey(),
  ownerUserId: text("owner_user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  clientId: text("client_id").notNull().references(() => pfClientsTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  status: text("status").notNull().default("draft"),
  totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull().default("0"),
  currency: text("currency").notNull().default("USD"),
  validUntil: text("valid_until"),
  notes: text("notes"),
  lineItems: jsonb("line_items").notNull().default("[]"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertPfProposalSchema = createInsertSchema(pfProposalsTable).omit({ createdAt: true, updatedAt: true });
export type InsertPfProposal = z.infer<typeof insertPfProposalSchema>;
export type PfProposal = typeof pfProposalsTable.$inferSelect;
