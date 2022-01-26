import { DeleteAccount } from '@/domain/usecases/account/delete-account'
import { serverError, serverSuccess } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class DeleteAccountController implements Controller {
  constructor (
    private readonly deleteAccount: DeleteAccount
  ) { }

  async handle (httpRequest: HttpRequest<any, any, {id: string}>): Promise<HttpResponse> {
    try {
      const accountIdToDelete = httpRequest.params.id
      const result = await this.deleteAccount.delete(accountIdToDelete)
      return serverSuccess(result)
    } catch (e) {
      return serverError(e)
    }
  }
}
