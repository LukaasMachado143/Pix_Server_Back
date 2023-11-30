import { FastifyInstance } from "fastify";
import { UserController } from "../Controller/UserController";

export const UserRoutes = async (fastify: FastifyInstance) => {
  const controller = new UserController();
  fastify.post("/create", controller.createUser);
  fastify.post("/login", controller.login);
};
