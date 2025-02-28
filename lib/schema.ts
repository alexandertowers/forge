import { pgTable, varchar, text, timestamp, json } from "drizzle-orm/pg-core";

export const tenants = pgTable("tenants", {
  tenantId: varchar("tenant_id", { length: 63 }).primaryKey(),
  companyName: text("company_name").notNull(),
  taxJurisdiction: text("tax_jurisdiction").notNull(),
  currency: text("currency").notNull(),
  colors: json("colors").$type<{ primary: string; secondary: string }>().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  orgId: varchar("org_id", { length: 63 }).notNull(),
});
