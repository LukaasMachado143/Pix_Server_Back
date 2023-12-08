import { FastifyInstance } from "fastify";
import { UserController } from "../Controller/UserController";
import { CheckToken } from "../middlewares/checkToken";

export const UserRoutes = async (fastify: FastifyInstance) => {
  const controller = new UserController();
  fastify.post("/create", controller.createUser);
  fastify.post("/login", controller.login);
  fastify.put(
    "/update/:id",
    { preHandler: CheckToken },
    controller.update as any
  );
  fastify.put(
    "/updatePassword/:id",
    { preHandler: CheckToken },
    controller.updatePassword as any
  );
  fastify.get(
    "/:email",
    { preHandler: CheckToken },
    controller.getUser as any
  );
};
