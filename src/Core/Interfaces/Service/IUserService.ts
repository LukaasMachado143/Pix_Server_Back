import { User } from "@prisma/client";
import { GeneralResponse } from "../../@types/GeneralResponse";
import { LoginRequestDTO } from "../../@types/DTO/Request/LoginRequestDTO";
import { UpdateRequestDTO } from "../../@types/DTO/Request/UpdateRequestDTO";
import { UpdatePasswordRequestDTO } from "../../@types/DTO/Request/UpdatePasswordRequestDTO";

export interface IUserService {
  createUser(userData: User): Promise<GeneralResponse>;
  login(loginData: LoginRequestDTO): Promise<GeneralResponse>;
  update(id: string, data: UpdateRequestDTO): Promise<GeneralResponse>;
  updatePassword(
    id: string,
    data: UpdatePasswordRequestDTO
  ): Promise<GeneralResponse>;
  getUserByEmail(email: string): Promise<GeneralResponse>;
  getAllUsers(id: string): Promise<GeneralResponse>;
}
