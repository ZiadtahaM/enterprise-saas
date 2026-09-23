import { pgTable, text, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { usersTable } from "./users";
import { pfClientsTable } from "./pf_clients";
import { pfProposalsTable } from "./pf_proposals";
import { pfContractsTable } from "./pf_contracts";

export const pfDepositsTable = pgTable("pf_deposits", {
  id: text("id").primaryKey(),
  ownerUserId: text("owner_user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  clientId: text("client_id").notNull().references(() => pfClientsTable.id, { onDelete: "cascade" }),
  proposalId: text("proposal_id").references(() => pfProposalsTable.id, { onDelete: "set null" }),
  contractId: text("contract_id").references(() => pfContractsTable.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  status: text("status").notNull().default("pending"),
  dueDate: text("due_date").notNull(),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertPfDepositSchema = createInsertSchema(pfDepositsTable).omit({ createdAt: true, updatedAt: true });
export type InsertPfDeposit = z.infer<typeof insertPfDepositSchema>;
export type PfDeposit = typeof pfDepositsTable.$inferSelect;
