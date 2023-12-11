import { FastifyInstance } from "fastify";
import { CheckToken } from "../middlewares/checkToken";
import { TransferController } from "../Controller/TransferController";

export const TransferRoutes = async (fastify: FastifyInstance) => {
  const controller = new TransferController();
  fastify.post(
    "/create",
    { preHandler: CheckToken },
    controller.createTransfer as any
  );

  fastify.get(
    "/sended/:pixKey",
    { preHandler: CheckToken },
    controller.getSendedTransfers as any
  );
};
