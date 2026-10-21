-- Preserve historical orders, customer references and webhook receipts.
-- Only future defaults and the active installation provider change.
ALTER TABLE "Order" ALTER COLUMN "paymentProvider" SET DEFAULT 'mercado_pago';
ALTER TABLE "PaymentSettings" ALTER COLUMN "provider" SET DEFAULT 'mercado_pago';
UPDATE "PaymentSettings" SET "provider" = 'mercado_pago';
