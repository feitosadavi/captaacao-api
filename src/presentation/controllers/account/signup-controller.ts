import { AddAccount, Authentication } from '@/domain/usecases'
import {
  badRequest,
  forbidden,
  serverError,
  serverSuccess
} from '@/presentation/helpers/http/http-helper'
import { EmailInUseError } from '@/presentation/errors/email-in-use-error'
import { Controller, HttpRequest, HttpResponse, Validation } from '@/presentation/protocols'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) { }

  async handle (httpRequest: HttpRequest<AddAccount.Params>): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const {
        name,
        profileType,
        profilePhoto,
        doc,
        birthDate,
        password,
        email,
        phone,
        role,
        adress
      } = httpRequest.body

      const account = await this.addAccount.add({
        name,
        profileType,
        profilePhoto,
        doc,
        birthDate,
        password,
        email,
        phone,
        role,
        adress
      })
      if (account === null) return forbidden(new EmailInUseError())
      const accessToken = await this.authentication.auth({
        email,
        password
      })

      return serverSuccess({ accessToken })
    } catch (error) {
      console.error(error)
      return serverError(error)
    }
  }
}
