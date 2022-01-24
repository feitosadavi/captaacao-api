import { LoadAccountById } from '@/domain/usecases'
import { serverError, serverSuccess } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

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
