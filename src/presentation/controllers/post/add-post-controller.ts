import { AddPost } from '@/domain/usecases'
import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpResponse, Validation } from '@/presentation/protocols'

export class AddPostController implements Controller<AddPostController.Request> {
  constructor (
    private readonly validation: Validation,
    private readonly addPost: AddPost
  ) {}

  async handle (request: AddPostController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) return badRequest(new Error())
      const {
        name,
        price,
        brand,
        year,
        color,
        kmTraveled,
        vehicleItems
      } = request
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

export namespace AddPostController {
  export type Request = AddPost.Params
}
