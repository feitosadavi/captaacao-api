import { noContent, serverError, serverSuccess } from '@/presentation/helpers/http/http-helper'
import { LoadCarById, Controller, HttpRequest, HttpResponse } from './load-car-by-id-protocols'

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
