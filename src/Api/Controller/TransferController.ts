import { FastifyRequest, FastifyReply } from "fastify";
import { GeneralResponse } from "../../Core/@types/GeneralResponse";
import { Transfer } from "@prisma/client";
import { ITransferService } from "../../Core/Interfaces/Service/ITransferService";
import { TransferService } from "../../Services/TransferService";

export class TransferController {
  async createTransfer(
    request: FastifyRequest<{ Body: Transfer }>,
    replay: FastifyReply
  ) {
    try {
      const service: ITransferService = new TransferService();
      const data: Transfer = request.body;
      const response: GeneralResponse = await service.createTransfer(data);
      const code = response.code;
      delete response.code;
      replay.status(code ?? 200).send(response);
    } catch (error) {
      console.log(error);
      replay.send({ message: error });
    }
  }

  async getTransfers(
    request: FastifyRequest<{ Params: { pixKey: string; type: string } }>,
    replay: FastifyReply
  ) {
    try {
      const service: ITransferService = new TransferService();
      const { type, pixKey } = request.params;
      const response: GeneralResponse = await service.getTransfers(
        type,
        pixKey
      );
      const code = response.code;
      delete response.code;
      replay.status(code ?? 200).send(response);
    } catch (error) {
      console.log(error);
      replay.send({ message: error });
    }
  }

  async getChartAccumulator(
    request: FastifyRequest<{ Params: { pixKey: string } }>,
    replay: FastifyReply
  ) {
    try {
      const service: ITransferService = new TransferService();
      const pixKey = request.params.pixKey;
      const response: GeneralResponse = await service.getChartAccumulator(
        pixKey
      );
      const code = response.code;
      delete response.code;
      replay.status(code ?? 200).send(response);
    } catch (error) {
      console.log(error);
      replay.send({ message: error });
    }
  }
}
