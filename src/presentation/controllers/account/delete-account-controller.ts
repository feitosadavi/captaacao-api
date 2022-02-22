import { DeleteAccount } from '@/domain/usecases/account/delete-account'
import { serverError, serverSuccess } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpResponse } from '@/presentation/protocols'

export class DeleteAccountController implements Controller<DeleteAccountController.Request> {
  constructor (
    private readonly deleteAccount: DeleteAccount
  ) { }

  async handle (request: DeleteAccountController.Request): Promise<HttpResponse> {
    try {
      const { id } = request
      const result = await this.deleteAccount.delete(id)
      return serverSuccess(result)
    } catch (e) {
      return serverError(e)
    }
  }
}

export namespace DeleteAccountController {
  export type Request = {
    id: string
  }
}
