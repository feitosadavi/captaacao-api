import { UpdateAccount } from '@/domain/usecases'
import { badRequest, serverError, serverSuccess } from '@/presentation/helpers'
import { Controller, HttpResponse, Validation } from '@/presentation/protocols'

export class UpdateAccountController implements Controller<UpdateAccountController.Request> {
  constructor (
    private readonly validation: Validation,
    private readonly updateAccount: UpdateAccount
  ) { }

  async handle (request: UpdateAccountController.Request): Promise<HttpResponse> {
    try {
      const { accountId, ...fields } = request // exclude id
      const error = this.validation.validate(fields)
      if (error) {
        return badRequest(error)
      }

      const result = await this.updateAccount.update({ id: accountId, fields })
      return serverSuccess({ ok: result })
    } catch (e) {
      return serverError(e)
    }
  }
}

export namespace UpdateAccountController {
  export type Request = {
    accountId: string
    name?: string
    profilePhoto?: string
    email?: string
    phone?: string

    cep?: string
    endereco?: string
    complemento?: string
    uf?: string
    cidade?: string
    bairro?: string
  }
}
