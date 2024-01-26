import { test, expect, describe, beforeAll } from "vitest";
import { ITransferRepository } from "../../../Core/Interfaces/Repository/ITransferRepository";
import { TransferRepository } from "./TransferRepository";
import { Transfer } from "@prisma/client";
import { v4 as uuid } from "uuid";

let repository: ITransferRepository;
beforeAll(() => {
  repository = new TransferRepository();
});
describe("Transfer Repository", () => {
  test("Deve ser possivel resgatar todas as trasnferências registradas", async () => {
    const transferList: Transfer[] = await repository.getAllTransfers();
    if (transferList.length >= 1) {
      const transfer: Transfer = transferList[0];
      expect(transfer).toHaveProperty("id");
      expect(transfer).toHaveProperty("date");
      expect(transfer).toHaveProperty("senderPixKey");
      expect(transfer).toHaveProperty("receiverPixKey");
      expect(transfer).toHaveProperty("value");
    } else if (transferList.length == 0) {
      expect(true).toBe(true);
    } else {
      expect(true).toBe(false);
    }
  });

  test("Deve ser possivel resgatar todas as trasnferências RECEBIDAS através da chave pix", async () => {
    const transferList: Transfer[] = await repository.getReceivedTransfers(
      "SYSTEM_PIX_SERVER"
    );
    if (transferList.length >= 1) {
      const transfer: Transfer = transferList[0];
      expect(transfer).toHaveProperty("id");
      expect(transfer).toHaveProperty("date");
      expect(transfer).toHaveProperty("senderPixKey");
      expect(transfer).toHaveProperty("receiverPixKey");
      expect(transfer).toHaveProperty("value");
    } else if (transferList.length == 0) {
      expect(true).toBe(true);
    } else {
      expect(true).toBe(false);
    }
  });

  test("Deve ser possivel resgatar todas as trasnferências ENVIADAS através da chave pix", async () => {
    const transferList: Transfer[] = await repository.getSendedTransfers(
      "SYSTEM_PIX_SERVER"
    );
    if (transferList.length >= 1) {
      const transfer: Transfer = transferList[0];
      expect(transfer).toHaveProperty("id");
      expect(transfer).toHaveProperty("date");
      expect(transfer).toHaveProperty("senderPixKey");
      expect(transfer).toHaveProperty("receiverPixKey");
      expect(transfer).toHaveProperty("value");
    } else if (transferList.length == 0) {
      expect(true).toBe(true);
    } else {
      expect(true).toBe(false);
    }
  });

  test("Deve ser possivel criar uma transferência", async () => {
    const id: string = uuid();
    const date: any = new Date();
    const newTransfer: Transfer = {
      id,
      date,
      senderPixKey: "SISTEMA_PIX_SERVER",
      receiverPixKey: "TesteTransferService",
      value: 1500,
    };
    const registeredTransfer: Transfer = await repository.create(newTransfer);
    expect(registeredTransfer).toHaveProperty("id");
    expect(registeredTransfer.id).toBe(id);
    expect(registeredTransfer).toHaveProperty("date");
    expect(registeredTransfer.date.toISOString()).toBe(date.toISOString());
    expect(registeredTransfer).toHaveProperty("senderPixKey");
    expect(registeredTransfer.senderPixKey).toBe("SISTEMA_PIX_SERVER");
    expect(registeredTransfer).toHaveProperty("receiverPixKey");
    expect(registeredTransfer.receiverPixKey).toBe("TesteTransferService");
    expect(registeredTransfer).toHaveProperty("value");
    expect(registeredTransfer.value).toBe(1500);
  });

  test("Deve ser possivel deletar uma transferência", async () => {
    const id: string = uuid();
    const date: any = new Date();
    const newTransfer: Transfer = {
      id,
      date,
      senderPixKey: "SISTEMA_PIX_SERVER",
      receiverPixKey: "TesteTransferService",
      value: 1500,
    };
    await repository.create(newTransfer);
    await repository.delete(id);
  });
});
