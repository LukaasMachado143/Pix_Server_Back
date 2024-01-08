import { test, expect, describe } from "vitest";
import { UserService } from "./UserService";
import { User } from "@prisma/client";
import { GeneralResponse } from "../../Core/@types/GeneralResponse";
import { LoginRequestDTO } from "../../Core/@types/DTO/Request/User/LoginRequestDTO";

describe("User Service", () => {
  test("Não deve ser possível criar um usuário, por falta de dados", async () => {
    const service = new UserService();
    const newUser: User = {
      email: "",
      name: "",
      pixKey: "",
      phone: "",
      password: "",
      id: "",
      balance: 0,
      profileImageUrl: "",
      profileImageKey: null,
      createAt: new Date(),
      updateAt: null,
    };
    const result: GeneralResponse = await service.createUser(newUser);
    expect(result.success).toBe(false);
  });

  test("Não deve ser possível criar um usuário, por duplicação de Email", async () => {
    const service = new UserService();
    const newUser: User = {
      email: "teste@teste.com",
      name: "teste",
      pixKey: "teste",
      phone: "teste",
      password: "teste",
      id: "",
      balance: 0,
      profileImageUrl: "",
      profileImageKey: null,
      createAt: new Date(),
      updateAt: null,
    };
    await service.createUser(newUser);
    const newUser2: User = {
      email: "teste@teste.com",
      name: "teste",
      pixKey: "teste",
      phone: "teste",
      password: "teste",
      id: "",
      balance: 0,
      profileImageUrl: "",
      profileImageKey: null,
      createAt: new Date(),
      updateAt: null,
    };
    const result: GeneralResponse = await service.createUser(newUser2);
    expect(result.success).toBe(false);
  });

  test("Não deve ser possível criar um usuário, por duplicação de Nome", async () => {
    const service = new UserService();
    const newUser: User = {
      email: "testeA@teste.com",
      name: "teste",
      pixKey: "teste",
      phone: "teste",
      password: "teste",
      id: "",
      balance: 0,
      profileImageUrl: "",
      profileImageKey: null,
      createAt: new Date(),
      updateAt: null,
    };
    await service.createUser(newUser);
    const newUser2: User = {
      email: "testeB@teste.com",
      name: "teste",
      pixKey: "teste",
      phone: "teste",
      password: "teste",
      id: "",
      balance: 0,
      profileImageUrl: "",
      profileImageKey: null,
      createAt: new Date(),
      updateAt: null,
    };
    const result: GeneralResponse = await service.createUser(newUser2);
    expect(result.success).toBe(false);
  });

  test("Não deve ser possível criar um usuário, por duplicação de Chave Pix", async () => {
    const service = new UserService();
    const newUser: User = {
      email: "testeA@teste.com",
      name: "testeA",
      pixKey: "teste",
      phone: "teste",
      password: "teste",
      id: "",
      balance: 0,
      profileImageUrl: "",
      profileImageKey: null,
      createAt: new Date(),
      updateAt: null,
    };
    await service.createUser(newUser);
    const newUser2: User = {
      email: "testeB@teste.com",
      name: "testeB",
      pixKey: "teste",
      phone: "teste",
      password: "teste",
      id: "",
      balance: 0,
      profileImageUrl: "",
      profileImageKey: null,
      createAt: new Date(),
      updateAt: null,
    };
    const result: GeneralResponse = await service.createUser(newUser2);
    expect(result.success).toBe(false);
  });

  test("Deve ser possível criar um usuário", async () => {
    const service = new UserService();
    const newUser: User = {
      email: "testeB@teste.com",
      name: "testeB",
      pixKey: "testeB",
      phone: "teste",
      password: "teste",
      id: "teste",
      balance: 0,
      profileImageUrl: "",
      profileImageKey: null,
      createAt: new Date(),
      updateAt: null,
    };
    const result: GeneralResponse = await service.createUser(newUser);
    expect(result.success).toBe(true);
  });
});
