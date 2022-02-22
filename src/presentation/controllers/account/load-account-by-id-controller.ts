import { LoadAccountById } from '@/domain/usecases'
import { serverError, serverSuccess } from '@/presentation/helpers'
import { Controller, HttpResponse } from '@/presentation/protocols'

export class LoadAccountByIdController implements Controller<LoadAccountByIdController.Request> {
  constructor (private readonly loadAccountById: LoadAccountById) { }
  async handle (request: LoadAccountByIdController.Request): Promise<HttpResponse> {
    try {
      const { id } = request
      const account = await this.loadAccountById.loadById(id)
      return serverSuccess(account)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace LoadAccountByIdController {
  export type Request = {
    id: string
  }
}
