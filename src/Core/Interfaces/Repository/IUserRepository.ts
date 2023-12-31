import { User } from "@prisma/client";
import { IGeneralRepository } from "../IGeneralRepository";

export interface IUserRepository extends IGeneralRepository {
  findByName(name: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByPixKey(pixKey: string): Promise<User | null>;
  updatePassword(id: string, newPassword: string): Promise<User>;
  updateBalance(id: string,value: number): Promise<User>;
}
