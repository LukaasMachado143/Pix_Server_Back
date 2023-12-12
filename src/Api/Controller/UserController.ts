import { FastifyRequest, FastifyReply } from "fastify";
import { UserService } from "../../Services/UserService";
import { IUserService } from "../../Core/Interfaces/Service/IUserService";
import { User } from "@prisma/client";
import { GeneralResponse } from "../../Core/@types/GeneralResponse";
import { LoginRequestDTO } from "../../Core/@types/DTO/Request/User/LoginRequestDTO";
import { UpdateRequestDTO } from "../../Core/@types/DTO/Request/User/UpdateRequestDTO";
import { UpdatePasswordRequestDTO } from "../../Core/@types/DTO/Request/User/UpdatePasswordRequestDTO";

export class UserController {
  async createUser(
    request: FastifyRequest<{ Body: User }>,
    replay: FastifyReply
  ) {
    try {
      const service: IUserService = new UserService();
      const userData: User = request.body;
      const response: GeneralResponse = await service.createUser(userData);
      const code = response.code;
      delete response.code;
      replay.status(code ?? 200).send(response);
    } catch (error) {
      console.log(error);
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
  async updatePassword(
    request: FastifyRequest<{
      Body: UpdatePasswordRequestDTO;
      Params: { id: string };
    }>,
    replay: FastifyReply
  ) {
    try {
      const service: IUserService = new UserService();
      const data: UpdatePasswordRequestDTO = request.body;
      const id: string = request.params.id;
      const response: GeneralResponse = await service.updatePassword(id, data);
      replay.send(response);
    } catch (error) {
      replay.send({ message: error });
    }
  }

  async getUser(
    request: FastifyRequest<{
      Params: { email: string };
    }>,
    replay: FastifyReply
  ) {
    try {
      const service: IUserService = new UserService();
      const email: string = request.params.email;
      const response: GeneralResponse = await service.getUserByEmail(email);
      replay.send(response);
    } catch (error) {
      replay.send({ message: error });
    }
  }
  async getAllUsers(
    request: FastifyRequest<{
      Params: { id: string };
    }>,
    replay: FastifyReply
  ) {
    try {
      const service: IUserService = new UserService();
      const id: string = request.params.id;
      const response: GeneralResponse = await service.getAllUsers(id);
      replay.send(response);
    } catch (error) {
      replay.send({ message: error });
    }
  }

  async updateBalance(
    request: FastifyRequest<{
      Params: { id: string; value: string };
    }>,
    replay: FastifyReply
  ) {
    try {
      const service: IUserService = new UserService();
      const id: string = request.params.id;
      const value: number = parseFloat(request.params.value);
      const response: GeneralResponse = await service.updateBalanceReal(
        id,
        value
      );
      replay.send(response);
    } catch (error) {
      replay.send({ message: error });
    }
  }
}
