import { User } from "@prisma/client";
import { prisma } from "../../config/dbConfigs";
import { IUserRepository } from "../../../Core/Interfaces/Repository/IUserRepository";

export class UserRepository implements IUserRepository {
  async create(data: User): Promise<User> {
    return await prisma.user.create({ data: data });
  }
  async findAll(): Promise<User[]> {
    return await prisma.user.findMany();
  }
  async findById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        id,
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
  async findByName(name: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        name,
      },
    });
  }
  async findByPixKey(pixKey: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        pixKey,
      },
    });
  }
  async update(id: string, data: any): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data: {
        email: data.email,
        name: data.name,
        pixKey: data.pixKey,
        phone: data.phone,
        profileImageKey: data.profileImageKey,
        profileImageUrl: data.profileImageUrl,
      },
    });
  }
  async updatePassword(id: string, newPassword: string): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data: { password: newPassword },
    });
  }
  async updateBalance(id: string, value: number): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data: { balance: value },
    });
  }
  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }
}
