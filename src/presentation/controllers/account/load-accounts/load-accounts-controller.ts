import {
  LoadAccounts, LoadAccountByToken, HttpRequest, HttpResponse,
  Controller, forbidden, serverSuccess, serverError,
  AccessDeniedError, noContent
} from './load-accounts-controller-protocols'

export class LoadAccountsController implements Controller {
  constructor (
    private readonly loadAccounts: LoadAccounts,
    private readonly loadAccountByToken: LoadAccountByToken
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token'] // pega o accessToken que eu coloquei nos headers
      const account = await this.loadAccountByToken.load(accessToken)
      if (account) { // se tiver autenticado
        const account = await this.loadAccounts.load()
        return account.length >= 1 ? serverSuccess(account) : noContent()
      } else {
        return forbidden(new AccessDeniedError())
      }
    } catch (e) {
      return serverError(e)
    }
  }
}
