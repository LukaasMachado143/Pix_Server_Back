import fastify, { FastifyInstance } from "fastify";
import { UserRoutes } from "./Api/Routes/UserRoutes";
import fastifyCors from "@fastify/cors";
import { TransferRoutes } from "./Api/Routes/TransferRoutes";
import multipart from "@fastify/multipart";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import {
  fastifySwaggeroptions,
  fastifySwaggerUIOptions,
} from "./ExternalConfigs/swaggerConfigs";

const app: FastifyInstance = fastify();

app.register(fastifyCors);
app.register(fastifySwagger as any, fastifySwaggeroptions);
app.register(fastifySwaggerUI as any, fastifySwaggerUIOptions);
app.register(multipart);
app.register(UserRoutes, { prefix: "/user" });
app.register(TransferRoutes, { prefix: "/transfer" });
app.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
// export { app };
