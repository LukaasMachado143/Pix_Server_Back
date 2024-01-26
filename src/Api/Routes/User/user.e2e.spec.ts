import { test, expect, describe, beforeAll } from "vitest";
import request from "supertest";
import { app } from "../../../app.ts";
//
describe("User E2E", () => {
  test("deve ser possível criar um usuário", async () => {
    await app.ready();
    const newUser = {
      id: "TesteCreateUserE2E",
      email: "TesteCreateUserE2E@teste.com",
      name: "TesteCreateUserE2E",
      pixKey: "TesteCreateUserE2E",
      phone: "xxxxxxxxxxx",
      balance: 0,
      password: "TesteCreateUserE2E",
      profileImageUrl: "",
      profileImageKey: null,
      createAt: new Date(),
      updateAt: new Date(),
    };
    const response = await request(app.server)
      .post("/user/create")
      .send(newUser)
      .expect(201);
    console.log(response.body);
  });
});
