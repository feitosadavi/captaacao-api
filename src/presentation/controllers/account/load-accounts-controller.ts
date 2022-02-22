import { LoadAccounts } from '@/domain/usecases'
import { noContent, serverError, serverSuccess } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpResponse } from '@/presentation/protocols'

export class LoadAccountsController implements Controller<LoadAccountsController.Request> {
  constructor (
    private readonly loadAccounts: LoadAccounts
  ) { }

  async handle (request: LoadAccountsController.Request): Promise<HttpResponse> {
    try {
      const account = await this.loadAccounts.load()
      return account.length >= 1 ? serverSuccess(account) : noContent()
    } catch (e) {
      return serverError(e)
    }
  }
}

export namespace LoadAccountsController {
  export type Request = any
}
