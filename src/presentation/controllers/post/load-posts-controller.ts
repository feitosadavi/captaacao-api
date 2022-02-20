import { LoadCars } from '@/domain/usecases'
import { noContent, serverError, serverSuccess } from '@/presentation/helpers'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class LoadCarsController implements Controller {
  constructor (private readonly loadCars: LoadCars) { }
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const cars = await this.loadCars.load()
      return cars.length ? serverSuccess(cars) : noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
