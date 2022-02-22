import { UpdatePassword } from '@/domain/usecases'
import { UnknownError } from '@/presentation/errors'
import { badRequest, serverError, serverSuccess } from '@/presentation/helpers'
import { Controller, HttpResponse, Validation } from '@/presentation/protocols'

export class UpdatePasswordController implements Controller<UpdatePasswordController.Request> {
  constructor (
    private readonly validation: Validation,
    private readonly updatePassword: UpdatePassword
  ) { }

  async handle (request: UpdatePasswordController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) {
        return badRequest(error)
      }
      const { id, password } = request
      const success = await this.updatePassword.update({ id: id, password: password })
      return success ? serverSuccess({ ok: success }) : badRequest(new UnknownError('Update Passowrd'))
    } catch (e) {
      return serverError(e)
    }
  }
}

export namespace UpdatePasswordController {
  export type Request = {
    id: string
    password: string
  }
}
