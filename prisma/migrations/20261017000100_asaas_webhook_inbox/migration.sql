CREATE TABLE "AsaasWebhookEvent" (
    "id" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "outcome" TEXT,
    CONSTRAINT "AsaasWebhookEvent_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "AsaasWebhookEvent_processedAt_receivedAt_idx" ON "AsaasWebhookEvent"("processedAt", "receivedAt");
