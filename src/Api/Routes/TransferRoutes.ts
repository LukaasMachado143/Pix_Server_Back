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
    "/:type/:pixKey",
    { preHandler: CheckToken },
    controller.getTransfers as any
  );

  fastify.get(
    "/chart/accumulator/:pixKey",
    { preHandler: CheckToken },
    controller.getChartAccumulator as any
  );
};
