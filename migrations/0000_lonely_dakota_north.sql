CREATE TABLE "tenants" (
	"tenant_id" varchar(63) PRIMARY KEY NOT NULL,
	"company_name" text NOT NULL,
	"tax_jurisdiction" text NOT NULL,
	"currency" text NOT NULL,
	"colors" json NOT NULL,
	"created_at" timestamp DEFAULT now()
);
