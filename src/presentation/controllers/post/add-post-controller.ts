import { AddPost } from '@/domain/usecases'
import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse, Validation } from '@/presentation/protocols'

export class AddPostController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addPost: AddPost
  ) {}

  async handle (httpRequest: HttpRequest<AddPost.Params>): Promise<HttpResponse> {
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
      await this.addPost.add({
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
