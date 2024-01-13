import { test, expect, describe, beforeAll } from "vitest";
import { ITransferService } from "../../Core/Interfaces/Service/ITransferService";
import { TransferService } from "./TransferService";
import { Transfer } from "@prisma/client";
import { GeneralResponse } from "../../Core/@types/GeneralResponse";
import { v4 as uuid } from "uuid";

let service: ITransferService;
beforeAll(() => {
  service = new TransferService();
});
describe("Transfer Service", () => {
  test("Não deve ser possível registrar uma tranferência, por falta de dados", async () => {
    const newTrasnfer: Transfer = {
      id: "TesteTransferService",
      date: new Date(),
      senderPixKey: "",
      receiverPixKey: "",
      value: 0,
    };
    const result: GeneralResponse = await service.createTransfer(newTrasnfer);
    expect(result.success).toBe(false);
  });

  test("Não deve ser possível registrar uma tranferência, por duplicação de chave pix", async () => {
    const newTrasnfer: Transfer = {
      id: "TesteTransferService",
      date: new Date(),
      senderPixKey: "TesteTransferService",
      receiverPixKey: "TesteTransferService",
      value: 0,
    };
    const result: GeneralResponse = await service.createTransfer(newTrasnfer);
    expect(result.success).toBe(false);
  });

  test("Não deve ser possível registrar uma tranferência, por chave pix do REMETENTE inexistente", async () => {
    const id: string = uuid();
    const newTrasnfer: Transfer = {
      id,
      date: new Date(),
      senderPixKey: "SISTEMA_PIX_SERVER_TESTE",
      receiverPixKey: "TesteTransferService",
      value: 1500,
    };
    const result: GeneralResponse = await service.createTransfer(newTrasnfer);
    expect(result.success).toBe(false);
  });

  test("Não deve ser possível registrar uma tranferência, por chave pix do RECEBEDOR inexistente", async () => {
    const id: string = uuid();
    const newTrasnfer: Transfer = {
      id,
      date: new Date(),
      senderPixKey: "TesteTransferService",
      receiverPixKey: "SISTEMA_PIX_SERVER_TESTE",
      value: 1500,
    };
    const result: GeneralResponse = await service.createTransfer(newTrasnfer);
    expect(result.success).toBe(false);
  });

  test("Deve ser possível registrar uma tranferência", async () => {
    const id: string = uuid();
    const newTrasnfer: Transfer = {
      id,
      date: new Date(),
      senderPixKey: "SISTEMA_PIX_SERVER",
      receiverPixKey: "TesteTransferService",
      value: 1500,
    };
    const result: GeneralResponse = await service.createTransfer(newTrasnfer);
    expect(result.success).toBe(true);
  });

  test("Não deve ser possível resgatar todas as transferências através da chave pix, por falta de dados", async () => {
    const result: GeneralResponse = await service.getTransfers("", "");
    expect(result.success).toBe(false);
  });

  test("Deve ser possível resgatar todas as transferências através da chave pix, do tipo SENDED", async () => {
    for (let index = 0; index < 3; index++) {
      const id: string = uuid();
      const newTrasnfer: Transfer = {
        id,
        date: new Date(),
        senderPixKey: "TesteTransferService",
        receiverPixKey: "SISTEMA_PIX_SERVER",
        value: 1500,
      };
      await service.createTransfer(newTrasnfer);
    }
    const result: GeneralResponse = await service.getTransfers(
      "sended",
      "TesteTransferService"
    );
    expect(result.message).toBe("sended");
    expect(result.data.length >= 3).toBe(true);
  });

  test("Deve ser possível resgatar todas as transferências através da chave pix, do tipo RECEIVED", async () => {
    for (let index = 0; index < 3; index++) {
      const id: string = uuid();
      const newTrasnfer: Transfer = {
        id,
        date: new Date(),
        senderPixKey: "SISTEMA_PIX_SERVER",
        receiverPixKey: "TesteTransferService",
        value: 1500,
      };
      await service.createTransfer(newTrasnfer);
    }
    const result: GeneralResponse = await service.getTransfers(
      "received",
      "TesteTransferService"
    );
    expect(result.message).toBe("received");
    expect(result.data.length >= 3).toBe(true);
  });

  test("Não deve ser possível resgatar os dados do gráfico Chart Accumulator, por falta de dados", async () => {
    const result: GeneralResponse = await service.getChartAccumulator("");
    expect(result.success).toBe(false);
  });

  test("Deve ser possível resgatar os dados do gráfico Chart Accumulator", async () => {
    const result: GeneralResponse = await service.getChartAccumulator(
      "TesteTransferService"
    );
    expect(result.success).toBe(true);
    expect(result.data).toHaveProperty("sended");
    expect(result.data).toHaveProperty("received");
  });

  test("Não deve ser possível resgatar os dados do gráfico Chart History, por falta de dados", async () => {
    const result: GeneralResponse = await service.getChartHistory("");
    expect(result.success).toBe(false);
  });

  test("Deve ser possível resgatar os dados do gráfico Chart History", async () => {
    const result: GeneralResponse = await service.getChartHistory(
      "TesteTransferService"
    );
    expect(result.success).toBe(true);
    expect(result.data).toHaveProperty("sended");
    expect(result.data).toHaveProperty("received");
  });

  test("Não deve ser possível resgatar os dados do gráfico Chart History Account, por falta de dados", async () => {
    const result: GeneralResponse = await service.getChartHistoryAccount("");
    expect(result.success).toBe(false);
  });

  test("Deve ser possível resgatar os dados do gráfico Chart History Account", async () => {
    const result: GeneralResponse = await service.getChartHistoryAccount(
      "TesteTransferService"
    );
    expect(result.success).toBe(true);
  });
});
