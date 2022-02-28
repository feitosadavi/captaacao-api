import { Authentication } from '@/domain/usecases'
import { badRequest, serverError, serverSuccess, unauthorized } from '@/presentation/helpers'
import { Controller, HttpResponse, Validation } from '@/presentation/protocols'

export class LoginController implements Controller<LoginController.Request> {
  constructor (
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) { }

  async handle (request: LoginController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) {
        return badRequest(error)
      }
      const authenticationModel = await this.authentication.auth(request)
      if (!authenticationModel) {
        return unauthorized()
      }

      return serverSuccess(authenticationModel)
    } catch (e) {
      return serverError(e)
    }
  }
}

export namespace LoginController {
  export type Request = {
    email: string
    password: string
  }
}
