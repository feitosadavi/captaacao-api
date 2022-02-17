import { AddProfile } from '@/domain/usecases'
import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse, Validation } from '@/presentation/protocols'

export class AddProfileController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addProfile: AddProfile
  ) {}

  async handle (httpRequest: HttpRequest<AddProfile.Params>): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)
      const {
        body,
        accountId
      } = httpRequest

      const createdAt = new Date()
      createdAt.toLocaleDateString('pt-BR')

      await this.addProfile.add({
        name: body.name,
        createdBy: accountId,
        createdAt
      })
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
