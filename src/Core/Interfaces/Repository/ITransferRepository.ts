import { Transfer } from "@prisma/client";

export interface ITransferRepository {
  create(data: Transfer): Promise<Transfer>;
  delete(id: string): Promise<void>;
}
