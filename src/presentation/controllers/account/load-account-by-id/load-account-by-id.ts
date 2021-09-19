import { noContent, serverError, serverSuccess } from '@/presentation/helpers/http/http-helper'
import { LoadAccountById, Controller, HttpRequest, HttpResponse } from './load-account-by-id-protocols'

export class LoadAccountByIdController implements Controller {
  constructor (private readonly loadAccountById: LoadAccountById) { }
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const car = await this.loadAccountById.loadById(httpRequest.params.id)
      return car ? serverSuccess(car) : noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
