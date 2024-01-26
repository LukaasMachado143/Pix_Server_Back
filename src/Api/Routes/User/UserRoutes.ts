import { FastifyInstance } from "fastify";
import { UserController } from "../../Controller/UserController";
import { CheckToken } from "../../middlewares/checkToken";

export const UserRoutes = async (fastify: FastifyInstance) => {
  const controller = new UserController();
  fastify.post(
    "/create",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            email: { type: "string" },
            name: { type: "string" },
            pixKey: { type: "string" },
            phone: { type: "string" },
            password: { type: "string" },
          },
          required: ["email", "name", "pixKey", "phone", "password"],
        },
      },
    },
    controller.createUser
  );
  fastify.post(
    "/login",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            email: { type: "string" },
            password: { type: "string" },
          },
          required: ["email", "password"],
        },
      },
    },
    controller.login
  );
  fastify.put(
    "/update/:id",
    {
      preHandler: CheckToken,
      schema: {
        body: {
          type: "object",
          properties: {
            email: { type: "string" },
            name: { type: "string" },
            pixKey: { type: "string" },
            phone: { type: "string" },
            profileImageKey: { type: "string" },
            profileImageUrl: { type: "string" },
          },
        },
        security: [{ bearerToken: [] }],
      },
    },
    controller.update as any
  );
  fastify.put(
    "/updatePassword/:id",
    {
      preHandler: CheckToken,
      schema: {
        body: {
          type: "object",
          properties: {
            oldPassword: { type: "string" },
            newPassword: { type: "string" },
          },
          required: ["oldPassword", "newPassword"],
        },
        security: [{ bearerToken: [] }],
      },
    },
    controller.updatePassword as any
  );
  fastify.put(
    "/updateBalance/:id/:value",
    {
      preHandler: CheckToken,
      schema: {
        security: [{ bearerToken: [] }],
      },
    },
    controller.updateBalance as any
  );
  // Falta criar o schema corretamente para aparecer input de arquivos
  fastify.put(
    "/updateProfileImage/:id",
    {
      preHandler: CheckToken,
      // schema: {
      //   security: [{ bearerToken: [] }],
      //   consumes: ["multipart/form-data"],
      //   body: {
      //     type: "object",
      //     properties: {
      //       file: {
      //         type: "string",
      //         format: "binary",
      //         description: "Escolha um arquivo de imagem para enviar.",
      //       },
      //     },
      //     required: ["file"],
      //   },
      // },
    },
    controller.updateProfileImage as any
  );

  fastify.get(
    "/:email",
    {
      preHandler: CheckToken,
      schema: {
        security: [{ bearerToken: [] }],
      },
    },
    controller.getUser as any
  );
  fastify.get(
    "/list/:id",
    {
      preHandler: CheckToken,
      schema: {
        security: [{ bearerToken: [] }],
      },
    },
    controller.getAllUsers as any
  );

  fastify.delete(
    "/delete/:email",
    {
      preHandler: CheckToken,
      schema: {
        security: [{ bearerToken: [] }],
      },
    },
    controller.getAllUsers as any
  );
};
