import { LoadAllAccounts } from '@/domain/usecases'
import { noContent, serverError, serverSuccess } from '@/presentation/helpers'
import { Controller, HttpResponse } from '@/presentation/protocols'

export class LoadAllAccountsController implements Controller<LoadAllAccountsController.Request> {
  constructor (
    private readonly loadAccounts: LoadAllAccounts
  ) { }

  async handle (request: LoadAllAccountsController.Request): Promise<HttpResponse> {
    try {
      const account = await this.loadAccounts.load()
      return account.length >= 1 ? serverSuccess(account) : noContent()
    } catch (e) {
      return serverError(e)
    }
  }
}

export namespace LoadAllAccountsController {
  export type Request = any
}
