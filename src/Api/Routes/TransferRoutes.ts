import { FastifyInstance } from "fastify";
import { CheckToken } from "../middlewares/checkToken";
import { TransferController } from "../Controller/TransferController";

export const TransferRoutes = async (fastify: FastifyInstance) => {
  const controller = new TransferController();
  fastify.post(
    "/create",
    {
      preHandler: CheckToken,
      schema: {
        body: {
          type: "object",
          properties: {
            senderPixKey: { type: "string" },
            receiverPixKey: { type: "string" },
            value: { type: "number" },
          },
          required: ["senderPixKey", "receiverPixKey", "value"],
        },
        security: [{ bearerToken: [] }],
      },
    },
    controller.createTransfer as any
  );

  fastify.get(
    "/:type/:pixKey",
    {
      preHandler: CheckToken,
      schema: {
        security: [{ bearerToken: [] }],
      },
    },
    controller.getTransfers as any
  );

  fastify.get(
    "/chart/accumulator/:pixKey",
    {
      preHandler: CheckToken,
      schema: {
        security: [{ bearerToken: [] }],
      },
    },
    controller.getChartAccumulator as any
  );

  fastify.get(
    "/chart/history/:pixKey",
    {
      preHandler: CheckToken,
      schema: {
        security: [{ bearerToken: [] }],
      },
    },
    controller.getChartHistory as any
  );
  fastify.get(
    "/chart/history/account/:pixKey",
    {
      preHandler: CheckToken,
      schema: {
        security: [{ bearerToken: [] }],
      },
    },
    controller.getChartHistoryAccount as any
  );
};
