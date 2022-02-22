import { AddProfile } from '@/domain/usecases'
import { NameInUseError } from '@/presentation/errors'
import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpResponse, Validation } from '@/presentation/protocols'

export class AddProfileController implements Controller<AddProfileController.Request> {
  constructor (
    private readonly validation: Validation,
    private readonly addProfile: AddProfile
  ) {}

  async handle (request: AddProfileController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) return badRequest(error)
      const {
        name,
        createdBy
      } = request

      const createdAt = new Date()
      createdAt.toLocaleDateString('pt-BR')

      const result = await this.addProfile.add({
        name,
        createdBy,
        createdAt
      })
      return result ? noContent() : badRequest(new NameInUseError())
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace AddProfileController {
  export type Request = {
    name: string
    createdBy: string
  }
}
