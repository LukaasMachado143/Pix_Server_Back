-- CreateTable
CREATE TABLE "Transfer" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "senderPixKey" TEXT NOT NULL,
    "receiverPixKey" TEXT NOT NULL,

    CONSTRAINT "Transfer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_senderPixKey_fkey" FOREIGN KEY ("senderPixKey") REFERENCES "User"("pixKey") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_receiverPixKey_fkey" FOREIGN KEY ("receiverPixKey") REFERENCES "User"("pixKey") ON DELETE RESTRICT ON UPDATE CASCADE;
