import { UpdateAccount } from '@/domain/usecases'
import { badRequest, serverError, serverSuccess } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpResponse, Validation } from '@/presentation/protocols'

export class UpdateAccountController implements Controller<UpdateAccountController.Request> {
  constructor (
    private readonly validation: Validation,
    private readonly updateAccount: UpdateAccount
  ) { }

  async handle (request: UpdateAccountController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) {
        return badRequest(error)
      }
      const { id, fields } = request
      const result = await this.updateAccount.update({ id, fields })
      return serverSuccess({ ok: result })
    } catch (e) {
      return serverError(e)
    }
  }
}

export namespace UpdateAccountController {
  export type Request = {
    id: string
    fields: Record<string, any>
  }
}
