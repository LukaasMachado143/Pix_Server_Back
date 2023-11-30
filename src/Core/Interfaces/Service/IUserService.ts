import { User } from "@prisma/client";
import { GeneralResponse } from "../../@types/GeneralResponse";

export interface IUserService {
  createUser(userData: User): Promise<GeneralResponse>;
}
