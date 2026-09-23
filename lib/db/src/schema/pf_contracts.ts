import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { usersTable } from "./users";
import { pfClientsTable } from "./pf_clients";
import { pfProposalsTable } from "./pf_proposals";

export const pfContractsTable = pgTable("pf_contracts", {
  id: text("id").primaryKey(),
  ownerUserId: text("owner_user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  clientId: text("client_id").notNull().references(() => pfClientsTable.id, { onDelete: "cascade" }),
  proposalId: text("proposal_id").references(() => pfProposalsTable.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  status: text("status").notNull().default("draft"),
  signedAt: timestamp("signed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertPfContractSchema = createInsertSchema(pfContractsTable).omit({ createdAt: true, updatedAt: true });
export type InsertPfContract = z.infer<typeof insertPfContractSchema>;
export type PfContract = typeof pfContractsTable.$inferSelect;
