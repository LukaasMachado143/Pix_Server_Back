import fastify, { FastifyInstance } from "fastify";
import { UserRoutes } from "./Api/Routes/UserRoutes";
import fastifyCors from "@fastify/cors";
import { TransferRoutes } from "./Api/Routes/TransferRoutes";
import multipart from "@fastify/multipart";

const server: FastifyInstance = fastify();
server.register(fastifyCors);
server.register(multipart);
server.register(UserRoutes, { prefix: "/user" });
server.register(TransferRoutes, { prefix: "/transfer" });
server.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
