import { serverError, serverSuccess } from '@/presentation/helpers/http/http-helper'
import { LoadAccountById, Controller, HttpRequest, HttpResponse } from './load-account-by-id-protocols'

export class LoadAccountByIdController implements Controller {
  constructor (private readonly loadAccountById: LoadAccountById) { }
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const account = await this.loadAccountById.loadById(httpRequest.params.id)
      return serverSuccess(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
