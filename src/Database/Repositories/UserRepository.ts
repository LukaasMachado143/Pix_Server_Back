import { User } from "@prisma/client";
import { prisma } from "../config/dbConfigs";
import { IUserRepository } from "../../Core/Interfaces/Repository/IUserRepository";

export class UserRepository implements IUserRepository {
  async updatePassword(id: string, newPassword: string): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data: { password: newPassword },
    });
  }
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
  async update(id: string, data: any): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data: { email: data.email, name: data.name, pixKey: data.pixKey },
    });
  }
  findAll(): Promise<any> {
    throw new Error("Method not implemented.");
  }
  async findById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        id,
      },
    });
  }
}
