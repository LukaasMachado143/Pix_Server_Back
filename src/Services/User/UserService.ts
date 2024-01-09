import { IUserRepository } from "../../Core/Interfaces/Repository/IUserRepository";
import { IUserService } from "../../Core/Interfaces/Service/IUserService";
import { User } from "@prisma/client";
import { UserRepository } from "../../Database/Repositories/UserRepository";
import { CreatedUserResponseDTO } from "../../Core/@types/DTO/Response/User/CreatedUserResponseDTO";
import { GeneralResponse } from "../../Core/@types/GeneralResponse";
import { hash, compare } from "bcrypt";
import { LoginRequestDTO } from "../../Core/@types/DTO/Request/User/LoginRequestDTO";
import { sign } from "jsonwebtoken";
import { LoginResponseDTO } from "../../Core/@types/DTO/Response/User/LoginResponseDTO";
import { UpdateRequestDTO } from "../../Core/@types/DTO/Request/User/UpdateRequestDTO";
import { UpdatePasswordRequestDTO } from "../../Core/@types/DTO/Request/User/UpdatePasswordRequestDTO";
import { UserResponseDTO } from "../../Core/@types/DTO/Response/User/UserResponseDTO";
import { MultipartFile } from "@fastify/multipart";
import { AwsS3Service } from "../AwsS3Service";
import { IAwsS3Service } from "../../Core/Interfaces/Service/IAwsS3Service";

export class UserService implements IUserService {
  private _repository: IUserRepository = new UserRepository();

  async createUser(userData: User): Promise<GeneralResponse> {
    const response: GeneralResponse = {
      code: 200,
      message: "",
      success: false,
    };

    if (
      !userData ||
      !userData.email ||
      !userData.name ||
      !userData.pixKey ||
      !userData.phone ||
      !userData.password
    ) {
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

    if (!loginData.email || !loginData.password) {
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

    const expiresIn = process.env.TOKEN_TIME;
    const token = sign(user, secretKey, {
      subject: user.id,
      expiresIn,
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
      phone: data.phone ?? user.phone,
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

    if (!id || !data || !data.newPassword || !data.oldPassword) {
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
  async updateBalance(
    pixKey: string,
    value: number,
    isSender: boolean
  ): Promise<boolean> {
    if (!pixKey || !value || value <= 0 || isSender == null) return false;

    const user: User | null = await this._repository.findByPixKey(pixKey);
    if (!user) return false;

    let newValue: number = user.balance;
    if (isSender) newValue -= value;
    else newValue += value;

    const updatedUser: User = await this._repository.updateBalance(
      user.id,
      newValue
    );
    if (!updatedUser) return false;

    return true;
  }
  async updateBalanceBySystem(
    id: string,
    value: number
  ): Promise<GeneralResponse> {
    const response: GeneralResponse = {
      message: "",
      success: false,
    };

    if (!id || !value) {
      response.message = "Dados pendentes !";
      return response;
    }

    const user: User | null = await this._repository.findById(id);
    if (!user) {
      response.message = "Usuário não encontrado !";
      return response;
    }

    const pixKey: string = user.pixKey;
    const isUpdatedBalance: boolean = await this.updateBalance(
      pixKey,
      value,
      false
    );
    if (!isUpdatedBalance) {
      response.message =
        "Problemas ao atualizar saldo do usuário, tente novamente !";
      return response;
    }

    response.message = "Saldo atualizado com sucesso !";
    response.success = true;
    return response;
  }
  async checkPixKey(pixKey: string): Promise<boolean> {
    if (!pixKey) return false;
    const user: User | null = await this._repository.findByPixKey(pixKey);
    if (!user) return false;
    return true;
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
        balance: user.balance,
        phone: user.phone,
        profileImageUrl: user.profileImageUrl,
      };
      response.data = data;
      response.success = true;
    }
    return response;
  }
  async getAllUsersDifferentLoggedIn(id: string): Promise<GeneralResponse> {
    const response: GeneralResponse = {
      message: "",
      success: false,
    };

    if (!id) {
      response.message = "Dados pendentes !";
      return response;
    }

    const users: User[] = await this._repository.findAll();
    const connectedUser = users.find((user) => user.id == id);
    if (!connectedUser) {
      response.message = "Usuário principal não encontrado !";
      return response;
    }

    const filteredUsers: User[] = users.filter(
      (user) =>
        user.id !== id && user.pixKey != process.env.SYSTEM_PIX_SERVER_KEY
    );
    const mappedUsers: UserResponseDTO[] = filteredUsers.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      pixKey: user.pixKey,
      phone: user.phone,
    }));

    response.data = mappedUsers;
    response.success = true;
    return response;
  }

  async delete(email: string): Promise<GeneralResponse> {
    const response: GeneralResponse = {
      code: 200,
      message: "",
      success: false,
    };

    if (!email) {
      response.message = "Dados pendentes !";
      return response;
    }

    const foundedUser: User | null = await this._repository.findByEmail(email);
    if (!foundedUser) {
      response.message = "Usuário não encontrado !";
      return response;
    }

    const id: string = foundedUser.id;
    await this._repository.delete(id);

    response.success = true;
    response.message = "Usuário deletado com sucesso !";
    response.code = 204;
    return response;
  }
  // Falta criar testePara esse método !
  async updateProfileImage(
    id: string,
    image: MultipartFile
  ): Promise<GeneralResponse> {
    const response: GeneralResponse = {
      message: "",
      success: false,
    };
    if (!id || !image || !image.filename) {
      response.message = "Dados pendentes !";
      return response;
    }

    const user: User | null = await this._repository.findById(id);
    if (!user) {
      response.message = "Usuário não encontrado !";
      return response;
    }

    const s3Instance: IAwsS3Service = new AwsS3Service();
    let data: UpdateRequestDTO = {
      profileImageKey: "",
      profileImageUrl:
        "https://th.bing.com/th/id/OIP.hcRhDT8KVqzySjYJmBhlzgHaHa?rs=1&pid=ImgDetMain",
    };
    if (user.profileImageKey) {
      const isDeleted: Boolean = await s3Instance.delete(user.profileImageKey);
      if (isDeleted) {
        await this._repository.update(user.id, data);
      }
    }
    const originalFileName: string = image.filename;
    const imageBuffer: Buffer = await image.toBuffer();
    const { key, location } = await s3Instance.upload(
      imageBuffer,
      originalFileName
    );
    data.profileImageUrl = location;
    data.profileImageKey = key;

    await this._repository.update(user.id, data);

    response.data = { key, location };
    response.message = "Imagem alterada com sucesso !";
    response.success = true;
    return response;
  }
}
