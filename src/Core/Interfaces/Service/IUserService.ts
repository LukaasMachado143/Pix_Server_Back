import { User } from "@prisma/client";
import { GeneralResponse } from "../../@types/GeneralResponse";
import { LoginRequestDTO } from "../../@types/DTO/Request/User/LoginRequestDTO";
import { UpdateRequestDTO } from "../../@types/DTO/Request/User/UpdateRequestDTO";
import { UpdatePasswordRequestDTO } from "../../@types/DTO/Request/User/UpdatePasswordRequestDTO";

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
  updateBalanceReal(pixKey: string, value: number): Promise<GeneralResponse>;
  checkPixKey(pixKey: string): Promise<boolean>;
  updateBalance(
    pixKey: string,
    value: number,
    isSender: boolean
  ): Promise<boolean>;
}
