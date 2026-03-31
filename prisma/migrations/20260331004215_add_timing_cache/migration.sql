-- CreateTable
CREATE TABLE "TimingCache" (
    "id" TEXT NOT NULL,
    "sessionKey" INTEGER NOT NULL,
    "endpoint" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TimingCache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TimingCache_sessionKey_endpoint_key" ON "TimingCache"("sessionKey", "endpoint");
