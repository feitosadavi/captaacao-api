import { AddProfile } from '@/domain/usecases'
import { NameInUseError } from '@/presentation/errors'
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

      const result = await this.addProfile.add({
        name: body.name,
        createdBy: accountId,
        createdAt
      })
      return result ? noContent() : badRequest(new NameInUseError())
    } catch (error) {
      return serverError(error)
    }
  }
}
