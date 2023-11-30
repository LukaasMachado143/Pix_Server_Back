import { IUserRepository } from "../Core/Interfaces/Repository/IUserRepository";
import { IUserService } from "../Core/Interfaces/Service/IUserService";
import { User } from "@prisma/client";
import { UserRepository } from "../Database/Repositories/UserRepository";
import { CreatedUserResponseDTO } from "../Core/@types/DTO/Response/CreatedUserResponseDTO";
import { GeneralResponse } from "../Core/@types/GeneralResponse";
import { hash, compare } from "bcrypt";
import { LoginRequestDTO } from "../Core/@types/DTO/Request/LoginRequestDTO";

export class UserService implements IUserService {
  private _repository: IUserRepository = new UserRepository();

  async createUser(userData: User): Promise<GeneralResponse> {
    const response: GeneralResponse = {
      code: 200,
      message: "",
      success: false,
    };

    const email: string = userData.email;
    let user: User | null = await this._repository.findByEmail(email);
    if (user) {
      response.message = "Email já está em uso, tente outro !";
      return response;
    }

    const name: string = userData.name;
    user = await this._repository.findByName(name);
    if (user) {
      response.message = "Nome já está em uso, tente outro !";
      return response;
    }

    const passworHash = await hash(userData.password, 10);
    const data: User = { ...userData, password: passworHash };
    const newUser: User = await this._repository.create(data);
    const newUserDTO: CreatedUserResponseDTO = {
      email: newUser.email,
      name: newUser.name,
    };
    response.code = 201;
    response.message = "Usuário criado com sucesso !";
    response.success = true;
    response.data = newUserDTO;

    return response;
  }
  async login(loginData: LoginRequestDTO): Promise<GeneralResponse> {
    const response: GeneralResponse = {
      message: "",
      success: false,
    };

    const email: string = loginData.email;
    let user: User | null = await this._repository.findByEmail(email);
    if (!user) {
      response.message = "Email ou senha inválido, tente novamente !";
      return response;
    }

    const checkPassword = await compare(loginData.password, user.password);
    if (!checkPassword) {
      response.message = "Email ou senha inválido, tente novamente !";
      return response;
    }

    response.message = "Logado com sucesso !";
    response.success = true;
    response.data = user;
    return response;
  }
}
