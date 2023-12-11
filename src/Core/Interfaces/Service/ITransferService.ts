import { Transfer } from "@prisma/client";
import { GeneralResponse } from "../../@types/GeneralResponse";
export interface ITransferService {
  createTransfer(data: Transfer): Promise<GeneralResponse>;
  getTransfers(type: string, pixKey: string): Promise<GeneralResponse>;
  getChartAccumulator(pixKey: string): Promise<GeneralResponse>;
}
