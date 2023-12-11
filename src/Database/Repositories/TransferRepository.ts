import { Transfer } from "@prisma/client";
import { prisma } from "../config/dbConfigs";
import { ITransferRepository } from "../../Core/Interfaces/Repository/ITransferRepository";

export class TransferRepository implements ITransferRepository {
  async getSendedTransfers(pixKey: string): Promise<Transfer[]> {
    return await prisma.transfer.findMany({ where: { senderPixKey: pixKey } });
  }
  async delete(id: string): Promise<void> {
    await prisma.transfer.delete({ where: { id } });
  }
  async create(data: Transfer): Promise<Transfer> {
    return await prisma.transfer.create({ data });
  }
}
