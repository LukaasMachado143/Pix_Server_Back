import { FastifyRequest, FastifyReply } from "fastify";
import { UserService } from "../../Services/UserService";
import { IUserService } from "../../Core/Interfaces/Service/IUserService";
import { User } from "@prisma/client";
import { GeneralResponse } from "../../Core/@types/GeneralResponse";
import { LoginRequestDTO } from "../../Core/@types/DTO/Request/LoginRequestDTO";
import { UpdateRequestDTO } from "../../Core/@types/DTO/Request/UpdateRequestDTO";

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

  async update(
    request: FastifyRequest<{ Body: UpdateRequestDTO; Params: { id: string } }>,
    replay: FastifyReply
  ) {
    try {
      const service: IUserService = new UserService();
      const data: UpdateRequestDTO = request.body;
      const id: string = request.params.id;
      const response: GeneralResponse = await service.update(id, data);
      replay.send(response);
    } catch (error) {
      replay.send({ message: error });
    }
  }
}
