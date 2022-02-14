import { UpdatePassword } from '@/domain/usecases'
import { UnknownError } from '@/presentation/errors'
import { badRequest, serverError, serverSuccess } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse, Validation } from '@/presentation/protocols'

type Body = { password: string }
type Params = {id: string}
export class UpdatePasswordController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly updatePassword: UpdatePassword
  ) { }

  async handle (httpRequest: HttpRequest<Body, any, Params>): Promise<HttpResponse> {
    try {
      const { body, params } = httpRequest
      const error = this.validation.validate(body)
      if (error) {
        return badRequest(error)
      }
      const success = await this.updatePassword.update({ id: params.id, password: body.password })
      return success ? serverSuccess({ ok: success }) : badRequest(new UnknownError('Update Passowrd'))
    } catch (e) {
      return serverError(e)
    }
  }
}
