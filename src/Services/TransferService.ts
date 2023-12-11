import { Transfer } from "@prisma/client";
import { GeneralResponse } from "../Core/@types/GeneralResponse";
import { ITransferRepository } from "../Core/Interfaces/Repository/ITransferRepository";
import { TransferRepository } from "../Database/Repositories/TransferRepository";
import { IUserService } from "../Core/Interfaces/Service/IUserService";
import { UserService } from "./UserService";
import { ITransferService } from "../Core/Interfaces/Service/ITransferService";
import { TransferListResponseDTO } from "../Core/@types/DTO/Response/Transfer/TransferListResponseDTO";

export class TransferService implements ITransferService {
  private _repository: ITransferRepository = new TransferRepository();
  private _userService: IUserService = new UserService();

  async createTransfer(data: Transfer): Promise<GeneralResponse> {
    const response: GeneralResponse = {
      code: 200,
      message: "",
      success: false,
    };

    if (!data || !data.receiverPixKey || !data.senderPixKey || !data.value) {
      response.message = "Dados pendentes";
      return response;
    }

    if (data.receiverPixKey == data.senderPixKey) {
      response.message = "As chaves são iguais !";
      return response;
    }

    const isExistSender: Promise<boolean> = this._userService.checkPixKey(
      data.senderPixKey
    );
    if (!isExistSender) {
      response.message = "Chave pix do remetente não existe !";
      return response;
    }

    const isExistReceiver: Promise<boolean> = this._userService.checkPixKey(
      data.receiverPixKey
    );
    if (!isExistReceiver) {
      response.message = "Chave pix do remetente não existe !";
      return response;
    }

    const transfer: Transfer = await this._repository.create(data);
    if (!transfer) {
      response.message = "Problemas ao registrar transferência !";
      return response;
    }

    const senderUpdated: boolean = await this._userService.updateBalance(
      data.senderPixKey,
      data.value,
      true
    );
    if (!senderUpdated) {
      await this._repository.delete(transfer.id);
      response.message = "Problemas ao atualizar o balanço do rementente !";
      return response;
    }

    const receiverUpdated: boolean = await this._userService.updateBalance(
      data.receiverPixKey,
      data.value,
      false
    );
    if (!receiverUpdated) {
      await this._userService.updateBalance(
        data.senderPixKey,
        data.value,
        false
      );
      response.message = "Problemas ao atualizar o balanço do recebedor !";
      return response;
    }

    response.message = "Transferência realizada com sucesso !";
    response.code = 201;
    response.data = transfer;
    response.success = true;

    return response;
  }

  async getTransfers(type: string, pixKey: string): Promise<GeneralResponse> {
    const response: GeneralResponse = {
      message: "",
      success: false,
    };

    if (!pixKey || !type) {
      response.message = "Dados pendentes !";
      return response;
    }

    let transfers: Transfer[] = [];
    if (type == "sended") {
      transfers = await this._repository.getSendedTransfers(pixKey);
    } else if (type == "received") {
      transfers = await this._repository.getReceivedTransfers(pixKey);
    } else {
      response.message = "Tipo inexistente !";
      return response;
    }
    const mappedTransfers: TransferListResponseDTO[] = transfers.map(
      (transfer) => {
        return { date: transfer.date, value: transfer.value };
      }
    );
    response.message = "sended";
    response.data = mappedTransfers;
    response.success = true;

    return response;
  }

  async getChartAccumulator(pixKey: string): Promise<GeneralResponse> {
    const response: GeneralResponse = {
      message: "",
      success: false,
    };

    if (!pixKey) {
      response.message = "Dados pendentes !";
      return response;
    }

    const sended: Transfer[] = await this._repository.getSendedTransfers(
      pixKey
    );
    const sendedAcc = sended.reduce((acc, cur) => {
      return (acc += cur.value);
    }, 0);
    const received: Transfer[] = await this._repository.getReceivedTransfers(
      pixKey
    );
    const receivedAcc = received.reduce((acc, cur) => {
      return (acc += cur.value);
    }, 0);
    response.message = "ok";
    response.data = {
      sended: sendedAcc,
      received: receivedAcc,
    };
    response.success = true;

    return response;
  }

  async getChartHistory(pixKey: string): Promise<GeneralResponse> {
    const response: GeneralResponse = {
      message: "",
      success: false,
    };

    if (!pixKey) {
      response.message = "Dados pendentes !";
      return response;
    }

    const sended: Transfer[] = await this._repository.getSendedTransfers(
      pixKey
    );
    const sendedMapped = sended.map((transfer) => transfer.value);
    const received: Transfer[] = await this._repository.getReceivedTransfers(
      pixKey
    );
    const receivedMapped = received.map((transfer) => transfer.value);
    response.message = "ok";
    response.data = {
      sended: sendedMapped,
      received: receivedMapped,
    };
    response.success = true;

    return response;
  }
}
