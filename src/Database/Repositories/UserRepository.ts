import { User } from "@prisma/client";
import { prisma } from "../config/dbConfigs";
import { IUserRepository } from "../../Core/Interfaces/Repository/IUserRepository";

export class UserRepository implements IUserRepository {
  async findByName(name: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        name,
      },
    });
  }
  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
  async create(data: User): Promise<User> {
    return await prisma.user.create({ data: data });
  }
  delete(id: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
  update(id: string, data: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  findAll(): Promise<any> {
    throw new Error("Method not implemented.");
  }
  findById(id: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
