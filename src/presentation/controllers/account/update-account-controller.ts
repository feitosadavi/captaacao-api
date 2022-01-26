import { UpdateAccount } from '@/domain/usecases'
import { badRequest, serverError, serverSuccess } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse, Validation } from '@/presentation/protocols'

export class UpdateAccountController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly updateAccount: UpdateAccount
  ) { }

  async handle (httpRequest: HttpRequest<UpdateAccount.Params>): Promise<HttpResponse> {
    try {
      const fieldsToUpdate = httpRequest.body
      const error = this.validation.validate(fieldsToUpdate)
      if (error) {
        return badRequest(error)
      }
      const result = await this.updateAccount.update(fieldsToUpdate)
      return serverSuccess({ ok: result })
    } catch (e) {
      return serverError(e)
    }
  }
}
