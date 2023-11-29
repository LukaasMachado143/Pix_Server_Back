import fastify, { FastifyInstance } from "fastify";

const server: FastifyInstance = fastify();
server.get("/", () => {
    return {message: 'api is runnung'}
});
server.listen({ port: 3000 });
