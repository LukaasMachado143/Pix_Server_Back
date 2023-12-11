import { Transfer } from "@prisma/client";
import { GeneralResponse } from "../Core/@types/GeneralResponse";
import { ITransferRepository } from "../Core/Interfaces/Repository/ITransferRepository";
import { TransferRepository } from "../Database/Repositories/TransferRepository";
import { IUserService } from "../Core/Interfaces/Service/IUserService";
import { UserService } from "./UserService";

export class TransferService implements TransferService {
  private _repository: ITransferRepository = new TransferRepository();
  private _userService: IUserService = new UserService();
  async createTransfer(data: Transfer): Promise<GeneralResponse> {
    const response: GeneralResponse = {
      code: 200,
      message: "",
      success: false,
    };

    if (!data || !data.receiverPixKey || !data.receiverPixKey || !data.value) {
      response.message = "Dados pendentes";
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
}
