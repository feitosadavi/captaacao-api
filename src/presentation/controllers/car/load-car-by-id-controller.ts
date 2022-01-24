import { LoadCarById } from '@/domain/usecases'
import { noContent, serverError, serverSuccess } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class LoadCarByIdController implements Controller {
  constructor (private readonly loadCarById: LoadCarById) { }
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const car = await this.loadCarById.loadById(httpRequest.params.id)
      return car ? serverSuccess(car) : noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
