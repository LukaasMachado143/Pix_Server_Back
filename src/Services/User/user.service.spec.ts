import { test, expect, describe, beforeAll } from "vitest";
import { UserService } from "./UserService";
import { User } from "@prisma/client";
import { GeneralResponse } from "../../Core/@types/GeneralResponse";
import { IUserService } from "../../Core/Interfaces/Service/IUserService";
import { UpdateRequestDTO } from "../../Core/@types/DTO/Request/User/UpdateRequestDTO";
import { UpdatePasswordRequestDTO } from "../../Core/@types/DTO/Request/User/UpdatePasswordRequestDTO";
import { LoginRequestDTO } from "../../Core/@types/DTO/Request/User/LoginRequestDTO";

let service: IUserService;
beforeAll(() => {
  service = new UserService();
});
describe("User Service", () => {
  test("Deve ser possível criar um usuário", async () => {
    const newUser: User = {
      email: "teste@teste.com",
      name: "teste",
      pixKey: "teste",
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

  test("Não deve ser possível criar um usuário, por falta de dados", async () => {
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
    const result: GeneralResponse = await service.createUser(newUser);
    expect(result.success).toBe(false);
  });

  test("Não deve ser possível criar um usuário, por duplicação de Nome", async () => {
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
    const result: GeneralResponse = await service.createUser(newUser);
    expect(result.success).toBe(false);
  });

  test("Não deve ser possível criar um usuário, por duplicação de Chave Pix", async () => {
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
    const result: GeneralResponse = await service.createUser(newUser);
    expect(result.success).toBe(false);
  });

  test("Deve ser possível logar", async () => {
    const loginData: LoginRequestDTO = {
      email: "teste@teste.com",
      password: "teste",
    };
    const result: GeneralResponse = await service.login(loginData);
    expect(result.success).toBe(true);
  });

  test("Não deve ser possível logar, por falta de dados", async () => {
    const loginData: LoginRequestDTO = {
      email: "",
      password: "",
    };
    const result: GeneralResponse = await service.login(loginData);
    expect(result.success).toBe(false);
  });

  test("Não deve ser possível logar, por usuário desconhecido", async () => {
    const loginData: LoginRequestDTO = {
      email: "testeadslkfmafnolsjfdkoghsdfoug@teste.com",
      password: "teste",
    };
    const result: GeneralResponse = await service.login(loginData);
    expect(result.success).toBe(false);
  });

  test("Não deve ser possível logar, por senha incorreta", async () => {
    const loginData: LoginRequestDTO = {
      email: "teste@teste.com",
      password: "testABCDEDDFDFE",
    };
    const result: GeneralResponse = await service.login(loginData);
    expect(result.success).toBe(false);
  });

  test("Não deve ser possível alterar dados do usuário, por falta de id", async () => {
    const userData: UpdateRequestDTO = {};
    const result: GeneralResponse = await service.update("", userData);
    expect(result.success).toBe(false);
  });

  test("Não deve ser possível alterar dados do usuário, por usuário desconhecido", async () => {
    const userData: UpdateRequestDTO = {};
    const result: GeneralResponse = await service.update(
      "kadfhlaskdnfsiopjfngcvnsapjkfgbnvlksjbvfdpkvbgfp",
      userData
    );
    expect(result.success).toBe(false);
  });

  test("Deve ser possível alterar dados do usuário", async () => {
    const foundedUser: GeneralResponse = await service.getUserByEmail(
      "teste@teste.com"
    );
    const id: string = foundedUser.data.id;
    const userData: UpdateRequestDTO = { email: "testeTestando@teste.com" };
    const result: GeneralResponse = await service.update(id, userData);
    expect(result.success).toBe(true);
  });

  test("Não deve ser possível alterar a senha do usuário, por falta id", async () => {
    const data: UpdatePasswordRequestDTO = { newPassword: "", oldPassword: "" };
    const result: GeneralResponse = await service.updatePassword("", data);
    expect(result.success).toBe(false);
  });

  test("Não deve ser possível alterar a senha do usuário, por usuário desconhecido", async () => {
    const data: UpdatePasswordRequestDTO = { newPassword: "", oldPassword: "" };
    const result: GeneralResponse = await service.updatePassword(
      "ajsdhfasdjnfaliohepriofbapsxoicbpsefbfpuewb",
      data
    );
    expect(result.success).toBe(false);
  });

  test("Não deve ser possível alterar a senha do usuário, por falta da nova senha", async () => {
    const foundedUser: GeneralResponse = await service.getUserByEmail(
      "testeTestando@teste.com"
    );
    const id: string = foundedUser.data.id;
    const data: UpdatePasswordRequestDTO = {
      newPassword: "",
      oldPassword: "teste",
    };
    const result: GeneralResponse = await service.updatePassword(id, data);
    expect(result.success).toBe(false);
  });

  test("Não deve ser possível alterar a senha do usuário, por falta da antiga senha", async () => {
    const foundedUser: GeneralResponse = await service.getUserByEmail(
      "testeTestando@teste.com"
    );
    const id: string = foundedUser.data.id;
    const data: UpdatePasswordRequestDTO = {
      newPassword: "testeABCDEF",
      oldPassword: "",
    };
    const result: GeneralResponse = await service.updatePassword(id, data);
    expect(result.success).toBe(false);
  });

  test("Não deve ser possível alterar a senha do usuário, por antiga senha estar incorreta", async () => {
    const foundedUser: GeneralResponse = await service.getUserByEmail(
      "testeTestando@teste.com"
    );
    const id: string = foundedUser.data.id;
    const data: UpdatePasswordRequestDTO = {
      newPassword: "testeABCDEF",
      oldPassword: "testeABCDEF",
    };
    const result: GeneralResponse = await service.updatePassword(id, data);
    expect(result.success).toBe(false);
  });

  test("Deve ser possível alterar a senha do usuário", async () => {
    const foundedUser: GeneralResponse = await service.getUserByEmail(
      "testeTestando@teste.com"
    );
    const id: string = foundedUser.data.id;
    const data: UpdatePasswordRequestDTO = {
      newPassword: "testeABCDEF",
      oldPassword: "teste",
    };
    const result: GeneralResponse = await service.updatePassword(id, data);
    expect(result.success).toBe(true);
  });

  test("Não deve ser possível alterar o balanço do usuário, por falta de dados", async () => {
    const result: boolean = await service.updateBalance("", 0, false);
    expect(result).toBe(false);
  });

  test("Não deve ser possível alterar o balanço do usuário, por usuário desconhecido", async () => {
    const result: boolean = await service.updateBalance(
      "asd;kljnfasl;kndcalnf;aoncaposbendfpofbefouasdnf",
      0,
      false
    );
    expect(result).toBe(false);
  });

  test("Deve ser possível alterar o balanço do usuário", async () => {
    const result: boolean = await service.updateBalance("teste", 200, false);
    expect(result).toBe(true);
  });

  test("Não deve ser possível alterar o balanço do usuário *VIA SISTEMA*, por falta de dados", async () => {
    const result: GeneralResponse = await service.updateBalanceBySystem("", 0);
    expect(result.success).toBe(false);
  });

  test("Não deve ser possível alterar o balanço do usuário *VIA SISTEMA*, por usuário desconhecido", async () => {
    const result: GeneralResponse = await service.updateBalanceBySystem(
      "oasihjgfpaonfpoanfp;oasdnmf[aopjfer[ofndas[pofne-ofrina",
      0
    );
    expect(result.success).toBe(false);
  });

  test("Deve ser possível alterar o balanço do usuário *VIA SISTEMA*", async () => {
    const result: GeneralResponse = await service.updateBalanceBySystem(
      "teste",
      5000
    );
    expect(result.success).toBe(true);
  });

  test("Não deve ser possível validar a chave pix, por falta de dados", async () => {
    const result: boolean = await service.checkPixKey("");
    expect(result).toBe(false);
  });

  test("Não deve ser possível validar a chave pix, por usuário desconhecido", async () => {
    const result: boolean = await service.checkPixKey(
      "asd;kfnjmads;lifna;s'pcvm[apjf]a[e-fgjqw-]etkrq]w-tiq]w-[ojfd]qw-9fj"
    );
    expect(result).toBe(false);
  });

  test("Deve ser possível validar a chave pix", async () => {
    const result: boolean = await service.checkPixKey("teste");
    expect(result).toBe(true);
  });

  test("Não deve ser possível resgatar dados do usuário, por falta de dados", async () => {
    const result: GeneralResponse = await service.getUserByEmail("");
    expect(result.success).toBe(false);
  });

  test("Não deve ser possível resgatar dados do usuário, por usuário desconhecido", async () => {
    const result: GeneralResponse = await service.getUserByEmail(
      "testeABCDDFADAEDADS@teste.com"
    );
    expect(result.success).toBe(false);
  });

  test("Deve ser possível resgatar dados do usuário", async () => {
    const result: GeneralResponse = await service.getUserByEmail(
      "testeTestando@teste.com"
    );
    expect(result.success).toBe(true);
  });

  test("Não deve ser possível resgatar todos os usuários diferente do que está logado, por falta de dados", async () => {
    const result: GeneralResponse = await service.getAllUsersDifferentLoggedIn(
      ""
    );
    expect(result.success).toBe(false);
  });

  test("Não deve ser possível resgatar todos os usuários diferente do que está logado, por usuário desconhecido", async () => {
    const result: GeneralResponse = await service.getAllUsersDifferentLoggedIn(
      "as;ekmfa'dfamf[apweof[asdodfam[efnas]pfnem[eop"
    );
    expect(result.success).toBe(false);
  });

  test("Deve ser possível resgatar todos os usuários diferente do que está logado", async () => {
    const user: GeneralResponse = await service.getUserByEmail(
      "testeTestando@teste.com"
    );
    const id: string = user.data.id;
    const result: GeneralResponse = await service.getAllUsersDifferentLoggedIn(
      id
    );
    expect(result.success).toBe(true);
  });

  test("Não deve ser possível deletar o usuário, por falta de dados", async () => {
    const result: GeneralResponse = await service.delete("");
    expect(result.success).toBe(false);
  });

  test("Não deve ser possível deletar o usuário, por usuário desconhecido", async () => {
    const result: GeneralResponse = await service.delete(
      "testedkjnsfnsdknfsiohbfoensnfsodhfb@teste.com"
    );
    expect(result.success).toBe(false);
  });

  test("Deve ser possível deletar o usuário", async () => {
    const result: GeneralResponse = await service.delete(
      "testeTestando@teste.com"
    );
    expect(result.success).toBe(true);
  });
});
