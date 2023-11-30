import { User } from "@prisma/client";
import { GeneralResponse } from "../../@types/GeneralResponse";
import { LoginRequestDTO } from "../../@types/DTO/Request/LoginRequestDTO";

export interface IUserService {
  createUser(userData: User): Promise<GeneralResponse>;
  login(loginData: LoginRequestDTO): Promise<GeneralResponse>;
}
