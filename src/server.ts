import fastify, { FastifyInstance } from "fastify";
import { UserRoutes } from "./Api/Routes/UserRoutes";
import fastifyCors from "@fastify/cors";
import { TransferRoutes } from "./Api/Routes/TransferRoutes";
import multipart from "@fastify/multipart";

const server: FastifyInstance = fastify();
server.register(fastifyCors);
server.register(multipart);
server.get("/", () => {
  return { message: "api is runnung" };
});
server.register(UserRoutes, { prefix: "/user" });
server.register(TransferRoutes, { prefix: "/transfer" });
server.listen({ port: 3000 });
