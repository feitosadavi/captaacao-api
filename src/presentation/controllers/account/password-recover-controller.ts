import { LoadIdByEmail, PasswordRecover } from '@/domain/usecases'
import { Controller, HttpRequest, HttpResponse, Validation } from '@/presentation/protocols'
import { NotFoundAccountError, UnknownError } from '@/presentation/errors'
import { badRequest, serverError, serverSuccess } from '@/presentation/helpers'

export class PasswordRecoverController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly loadIdByEmail: LoadIdByEmail,
    private readonly passwordRecover: PasswordRecover
  ) { }

  async handle (httpRequest: HttpRequest<any, any, { email: string }>): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)

      const email = httpRequest.body.email
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
