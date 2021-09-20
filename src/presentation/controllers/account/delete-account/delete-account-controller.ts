import { DeleteAccount } from '@/domain/usecases/account/delete-account'
import { serverError, serverSuccess, unauthorized } from '@/presentation/helpers/http/http-helper'
import { LoadAccountByToken } from '@/presentation/middlewares/auth-middleware-protocols'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class DeleteAccountController implements Controller {
  constructor (
    private readonly deleteAccount: DeleteAccount,
    private readonly loadAccountByToken: LoadAccountByToken
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers['x-access-token']
      const accountIdToDelete = httpRequest.params.id

      const account = await this.loadAccountByToken.load(accessToken)

      if (account.role === 'admin' || account.id === accountIdToDelete) {
        const result = await this.deleteAccount.delete(account.id)
        return serverSuccess(result)
      } else {
        return unauthorized()
      }
    } catch (e) {
      return serverError(e)
    }
  }
}
