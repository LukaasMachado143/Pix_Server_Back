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

app.register(fastifySwagger as any, fastifySwaggeroptions);
app.register(fastifySwaggerUI as any, fastifySwaggerUIOptions);
app.register(fastifyCors, {
  origin: true,
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
  allowedHeaders: '*',

});
app.register(multipart);
app.register(UserRoutes, { prefix: "/user" });
app.register(TransferRoutes, { prefix: "/transfer" });
export { app };
