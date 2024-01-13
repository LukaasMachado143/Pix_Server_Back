import { test, expect, describe, beforeAll } from "vitest";
import { IUserRepository } from "../../../Core/Interfaces/Repository/IUserRepository";
import { UserRepository } from "./UserRepository";
import { User } from "@prisma/client";

let repository: IUserRepository;
beforeAll(() => {
  repository = new UserRepository();
});
describe("User Repository", () => {
  test("Deve ser possível criar um usuário", async () => {
    const newUser: User = {
      id: "TesteRepository",
      email: "TesteRepository@teste.com",
      name: "TesteRepository",
      pixKey: "TesteRepository",
      phone: "xxxxxxxxxxx",
      balance: 0,
      password: "TesteRepository",
      profileImageUrl: "",
      profileImageKey: null,
      createAt: new Date(),
      updateAt: new Date(),
    };
    const result: User = await repository.create(newUser);
    expect(result).toHaveProperty("id");
    expect(result.id).toBe("TesteRepository");
  });

  test("Deve ser possível encontrar pelo menos um usuário", async () => {
    const listUsers: User[] = await repository.findAll();
    const userTestRepository = listUsers.find(
      (user: User) => user.id === "TesteRepository"
    );
    if (userTestRepository) {
      expect(userTestRepository).toHaveProperty("id");
      expect(userTestRepository.email).toBe("TesteRepository@teste.com");
    } else {
      expect(true).toBe(false);
    }
  });

  test("Deve ser possível encontrar um usuário através de seu EMAIL", async () => {
    const user: User | null = await repository.findByEmail(
      "TesteRepository@teste.com"
    );
    if (user) {
      expect(user).toHaveProperty("id");
      expect(user.email).toBe("TesteRepository@teste.com");
    } else {
      expect(true).toBe(false);
    }
  });

  test("Deve ser possível encontrar um usuário através de seu NOME", async () => {
    const user: User | null = await repository.findByName("TesteRepository");
    if (user) {
      expect(user).toHaveProperty("id");
      expect(user.name).toBe("TesteRepository");
    } else {
      expect(true).toBe(false);
    }
  });

  test("Deve ser possível encontrar um usuário através de sua CHAVE PIX", async () => {
    const user: User | null = await repository.findByPixKey("TesteRepository");
    if (user) {
      expect(user).toHaveProperty("id");
      expect(user.pixKey).toBe("TesteRepository");
    } else {
      expect(true).toBe(false);
    }
  });

  test("Deve ser possível alterar os dados de um usuário", async () => {
    const user: User | null = await repository.findByPixKey("TesteRepository");
    if (user) {
      const id: string = user.id;
      const data = { email: "TesteRepositoryAlterado@teste.com" };
      const result: User = await repository.update(id, data);
      expect(result.email).toBe("TesteRepositoryAlterado@teste.com");
    } else {
      expect(true).toBe(false);
    }
  });

  test("Deve ser possível alterar a senha de um usuário", async () => {
    const user: User | null = await repository.findByPixKey("TesteRepository");
    if (user) {
      const id: string = user.id;
      const newPassword: string = "TesteRepositoryAlterado";
      const result: User = await repository.updatePassword(id, newPassword);
      expect(result.password).toBe("TesteRepositoryAlterado");
    } else {
      expect(true).toBe(false);
    }
  });

  test("Deve ser possível alterar a o saldo de um usuário", async () => {
    const user: User | null = await repository.findByPixKey("TesteRepository");
    if (user) {
      const id: string = user.id;
      const value: number = 123456789;
      const result: User = await repository.updateBalance(id, value);
      expect(result.balance).toBe(123456789);
    } else {
      expect(true).toBe(false);
    }
  });

  test("Deve ser deletar um usuário", async () => {
    const user: User | null = await repository.findByPixKey("TesteRepository");
    if (user) {
      const id: string = user.id;
      await repository.delete(id);
      expect(true).toBe(true);
    } else {
      expect(true).toBe(false);
    }
  });
});
