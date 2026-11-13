CREATE TABLE "MercadoPagoRelayInstallation" (
  "id" TEXT PRIMARY KEY, "destination" TEXT NOT NULL, "secretEnv" TEXT NOT NULL,
  "local" BOOLEAN NOT NULL DEFAULT false, "enabled" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "MercadoPagoRelayInstallation_single_local" ON "MercadoPagoRelayInstallation" ("local") WHERE "local" = true;
CREATE TABLE "MercadoPagoRelayEvent" (
  "key" TEXT PRIMARY KEY, "resourceId" TEXT NOT NULL, "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE "MercadoPagoRelayDelivery" (
  "id" TEXT PRIMARY KEY, "eventKey" TEXT NOT NULL REFERENCES "MercadoPagoRelayEvent"("key") ON DELETE RESTRICT ON UPDATE CASCADE,
  "installationId" TEXT NOT NULL REFERENCES "MercadoPagoRelayInstallation"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  "status" TEXT NOT NULL DEFAULT 'pending', "outcome" TEXT, "attempts" INTEGER NOT NULL DEFAULT 0,
  "nextAttemptAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "leaseUntil" TIMESTAMP(3),
  "leaseToken" TEXT, "lastError" TEXT, "deliveredAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX "MercadoPagoRelayDelivery_eventKey_installationId_key" ON "MercadoPagoRelayDelivery"("eventKey", "installationId");
CREATE INDEX "MercadoPagoRelayDelivery_status_nextAttemptAt_idx" ON "MercadoPagoRelayDelivery"("status", "nextAttemptAt");
CREATE TABLE "MercadoPagoRelayNonce" ("nonce" TEXT PRIMARY KEY, "expiresAt" TIMESTAMP(3) NOT NULL);
CREATE INDEX "MercadoPagoRelayNonce_expiresAt_idx" ON "MercadoPagoRelayNonce"("expiresAt");
