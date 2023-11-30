import fastify, { FastifyInstance } from "fastify";
import { UserRoutes } from "./Api/Routes/UserRoutes";

const server: FastifyInstance = fastify();
server.get("/", () => {
  return { message: "api is runnung" };
});
server.register(UserRoutes, { prefix: "/user" });
server.listen({ port: 3000 });
