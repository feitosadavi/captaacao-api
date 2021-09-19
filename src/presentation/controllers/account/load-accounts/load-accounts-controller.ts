import {
  LoadAccounts, HttpRequest, HttpResponse, Controller,
  serverSuccess, serverError, noContent
} from './load-accounts-controller-protocols'

export class LoadAccountsController implements Controller {
  constructor (
    private readonly loadAccounts: LoadAccounts
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const account = await this.loadAccounts.load()
      return account.length >= 1 ? serverSuccess(account) : noContent()
    } catch (e) {
      return serverError(e)
    }
  }
}
