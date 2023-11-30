import { FastifyRequest, FastifyReply } from "fastify";
import { UserService } from "../../Services/UserService";
import { IUserService } from "../../Core/Interfaces/Service/IUserService";
import { User } from "@prisma/client";
import { GeneralResponse } from "../../Core/@types/GeneralResponse";
import { LoginRequestDTO } from "../../Core/@types/DTO/Request/LoginRequestDTO";

export class UserController {
  async createUser(
    request: FastifyRequest<{ Body: User }>,
    replay: FastifyReply
  ) {
    try {
      const service: IUserService = new UserService();
      const userData: User = request.body;
      const response: GeneralResponse = await service.createUser(userData);
      delete response.code;
      replay.status(response.code ?? 200).send(response);
    } catch (error) {
      replay.send({ message: error });
    }
  }

  async login(
    request: FastifyRequest<{ Body: LoginRequestDTO }>,
    replay: FastifyReply
  ) {
    try {
      const service: IUserService = new UserService();
      const loginData: LoginRequestDTO = request.body;
      const response: GeneralResponse = await service.login(loginData);
      replay.send(response);
    } catch (error) {
      replay.send({ message: error });
    }
  }
  async teste(request: FastifyRequest, replay: FastifyReply) {
    try {
      replay.send({ message: "Autorizado" });
    } catch (error) {
      replay.send({ message: error });
    }
  }
}
