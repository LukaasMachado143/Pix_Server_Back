import { FastifyInstance } from "fastify";

export const UserRoutes = async (fastify: FastifyInstance) => {
  fastify.get("/create", () => {
    return { message: "Initial Route for User" };
  });
};
