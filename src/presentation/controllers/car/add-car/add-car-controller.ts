import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse, Validation, AddCar } from './add-car-protocols'

export class AddCarController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addCar: AddCar
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(new Error())
      const {
        name,
        price,
        brand,
        year,
        color,
        kmTraveled,
        vehicleItems
      } = httpRequest.body
      await this.addCar.add({
        name,
        price,
        brand,
        year,
        color,
        kmTraveled,
        vehicleItems,
        addDate: new Date()
      })
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
