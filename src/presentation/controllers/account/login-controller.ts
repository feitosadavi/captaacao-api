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
      const { email, password } = request
      const accessToken = await this.authentication.auth({ email, password })
      if (!accessToken) {
        return unauthorized()
      }

      return serverSuccess({ accessToken })
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
