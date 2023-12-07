import { FastifyRequest, FastifyReply } from "fastify";
import { verify } from "jsonwebtoken";
import { GeneralResponse } from "../../Core/@types/GeneralResponse";

export function CheckToken(
  request: FastifyRequest,
  reply: FastifyReply,
  done: any
) {
  const response: GeneralResponse = {
    message: "",
    success: false,
  };
  const recivedToken = request.headers.authorization;
  if (!recivedToken) {
    response.message = "Token pendente !";
    return reply.code(401).send(response);
  }

  const secretKey = process.env.SECRET_KEY;
  if (!secretKey) {
    response.message = "SECRET_KEY pendente !";
    return reply.code(401).send(response);
  }

  const [, token] = recivedToken.split(" ");
  try {
    verify(token, secretKey);
    done();
  } catch (error) {
    response.message = "Token inválido !";
    return reply.code(401).send(response);
  }
}
