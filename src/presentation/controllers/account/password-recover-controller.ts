import { LoadIdByEmail, PasswordRecover } from '@/domain/usecases'
import { Controller, HttpResponse, Validation } from '@/presentation/protocols'
import { NotFoundAccountError, UnknownError } from '@/presentation/errors'
import { badRequest, serverError, serverSuccess } from '@/presentation/helpers'

export class PasswordRecoverController implements Controller<PasswordRecoverController.Request> {
  constructor (
    private readonly validation: Validation,
    private readonly loadIdByEmail: LoadIdByEmail,
    private readonly passwordRecover: PasswordRecover
  ) { }

  async handle (request: PasswordRecoverController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) return badRequest(error)

      const { email } = request
      const id = await this.loadIdByEmail.load({ email })
      if (id) {
        const ok = await this.passwordRecover.recover({ id, email })
        return ok ? serverSuccess({ id }) : badRequest(new UnknownError('password recover'))
      } else return badRequest(new NotFoundAccountError())
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace PasswordRecoverController {
  export type Request = {
    email: string
  }
}
