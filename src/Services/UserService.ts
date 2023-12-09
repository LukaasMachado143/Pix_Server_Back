import { IUserRepository } from "../Core/Interfaces/Repository/IUserRepository";
import { IUserService } from "../Core/Interfaces/Service/IUserService";
import { User } from "@prisma/client";
import { UserRepository } from "../Database/Repositories/UserRepository";
import { CreatedUserResponseDTO } from "../Core/@types/DTO/Response/CreatedUserResponseDTO";
import { GeneralResponse } from "../Core/@types/GeneralResponse";
import { hash, compare } from "bcrypt";
import { LoginRequestDTO } from "../Core/@types/DTO/Request/LoginRequestDTO";
import { sign } from "jsonwebtoken";
import { LoginResponseDTO } from "../Core/@types/DTO/Response/LoginResponseDTO";
import { UpdateRequestDTO } from "../Core/@types/DTO/Request/UpdateRequestDTO";
import { UpdatePasswordRequestDTO } from "../Core/@types/DTO/Request/UpdatePasswordRequestDTO";
import { UserResponseDTO } from "../Core/@types/DTO/Response/UserResponseDTO";

export class UserService implements IUserService {
  private _repository: IUserRepository = new UserRepository();

  async createUser(userData: User): Promise<GeneralResponse> {
    const response: GeneralResponse = {
      code: 200,
      message: "",
      success: false,
    };

    if (!userData) {
      response.message = "Dados pendentes !";
      return response;
    }

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

    const pixKey: string = userData.pixKey;
    user = await this._repository.findByPixKey(pixKey);
    if (user) {
      response.message = "Chave Pix já está em uso, tente outra !";
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

    if (!loginData) {
      response.message = "Dados pendentes !";
      return response;
    }

    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) {
      response.message = "SECRET_KEY pendente !";
      return response;
    }

    const email: string = loginData.email;
    const user: User | null = await this._repository.findByEmail(email);
    if (!user) {
      response.message = "Email ou senha inválido, tente novamente !";
      return response;
    }

    const checkPassword = await compare(loginData.password, user.password);
    if (!checkPassword) {
      response.message = "Email ou senha inválido, tente novamente !";
      return response;
    }

    const token = sign(user, secretKey, {
      subject: user.id,
      expiresIn: "5m",
    });
    if (!token) {
      response.message = "Problemas ao gerar token, tente novamente !";
      return response;
    }

    const responseData: LoginResponseDTO = { email: user.email, token };
    response.message = "Logado com sucesso !";
    response.success = true;
    response.data = responseData;
    return response;
  }
  async update(id: string, data: UpdateRequestDTO): Promise<GeneralResponse> {
    const response: GeneralResponse = {
      message: "",
      success: false,
    };
    if (!id || !data) {
      response.message = "Dados pendentes !";
      return response;
    }

    const user: User | null = await this._repository.findById(id);
    if (!user) {
      response.message = "User not found !";
      return response;
    }
    const updatedData: UpdateRequestDTO = {
      email: data.email ?? user.email,
      name: data.name ?? user.name,
      pixKey: data.pixKey ?? user.pixKey,
    };
    await this._repository.update(id, updatedData);

    response.message = "Updated Successfully !";
    response.success = true;
    return response;
  }

  async updatePassword(
    id: string,
    data: UpdatePasswordRequestDTO
  ): Promise<GeneralResponse> {
    const response: GeneralResponse = {
      message: "",
      success: false,
    };

    if (!id || !data) {
      response.message = "Dados pendentes !";
      return response;
    }

    const user: User | null = await this._repository.findById(id);
    if (!user) {
      response.message = "User not found !";
      return response;
    }

    const checkPassword = await compare(data.oldPassword, user.password);
    if (!checkPassword) {
      response.message = "Senha inválida, tente novamente !";
      return response;
    }

    const passworHash = await hash(data.newPassword, 10);

    await this._repository.updatePassword(id, passworHash);

    response.message = "Updated Successfully !";
    response.success = true;
    return response;
  }

  async getUserByEmail(email: string): Promise<GeneralResponse> {
    const response: GeneralResponse = {
      message: "",
      success: false,
    };

    if (!email) {
      response.message = "Dados pendentes !";
      return response;
    }
    const user: User | null = await this._repository.findByEmail(email);
    if (!user) {
      response.message = "Usuário não encontrado !";
    } else {
      const data: UserResponseDTO = {
        id: user.id,
        email: user.email,
        name: user.name,
        pixKey: user.pixKey,
        balance: 2500,
        profileImageUrl: "",
      };
      response.data = data;
    }
    return response;
  }
}
