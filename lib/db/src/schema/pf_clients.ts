import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { usersTable } from "./users";

export const pfClientsTable = pgTable("pf_clients", {
  id: text("id").primaryKey(),
  ownerUserId: text("owner_user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  companyName: text("company_name").notNull(),
  contactName: text("contact_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  address: text("address"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertPfClientSchema = createInsertSchema(pfClientsTable).omit({ createdAt: true, updatedAt: true });
export type InsertPfClient = z.infer<typeof insertPfClientSchema>;
export type PfClient = typeof pfClientsTable.$inferSelect;
