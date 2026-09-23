import { pgTable, text, timestamp, numeric, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { usersTable } from "./users";

export const alPropertiesTable = pgTable("al_properties", {
  id: text("id").primaryKey(),
  ownerUserId: text("owner_user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  locationText: text("location_text").notNull(),
  city: text("city").notNull(),
  neighborhood: text("neighborhood"),
  price: numeric("price", { precision: 14, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  type: text("type").notNull(),
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  sizeM2: numeric("size_m2", { precision: 10, scale: 2 }),
  status: text("status").notNull().default("available"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertAlPropertySchema = createInsertSchema(alPropertiesTable).omit({ createdAt: true, updatedAt: true });
export type InsertAlProperty = z.infer<typeof insertAlPropertySchema>;
export type AlProperty = typeof alPropertiesTable.$inferSelect;
