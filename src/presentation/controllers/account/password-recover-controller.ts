import { LoadAccountById } from '@/domain/usecases'
import { NotFoundAccountError } from '@/presentation/errors/not-found-account'
import { badRequest } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class PasswordRecoverController implements Controller {
  constructor (private readonly loadAccountById: LoadAccountById) {}

  async handle (httpRequest: HttpRequest<any, any, {id: string}>): Promise<HttpResponse> {
    const accountId = httpRequest.params.id
    const account = await this.loadAccountById.loadById(accountId)
    if (!account) return badRequest(new NotFoundAccountError())
    return null
  }
}
